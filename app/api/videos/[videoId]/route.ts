import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { Videos, Users } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const resolvedParams = await params;
    // Get the video without requiring authentication
    const video = await db.select().from(Videos)
      .where(eq(Videos.id, resolvedParams.videoId));

    if (!video || video.length === 0) {
      return new NextResponse("Video not found", { status: 404 });
    }

    // Process video to ensure compatibility
    const processedVideo = {
      ...video[0],
      imageUrls: Array.isArray(video[0].imageUrls) ? video[0].imageUrls : [],
    };

    // Get creator info
    const creator = await db.select({
      id: Users.id,
      name: Users.name,
      username: Users.username,
      imageUrl: Users.imageUrl
    }).from(Users)
      .where(eq(Users.id, video[0].createdBy));

    // Add creator info to response
    const response = {
      ...processedVideo,
      creator: creator.length > 0 ? creator[0] : null,
      isOwner: false
    };

    // Check if the current user is the owner
    const { userId } = auth();
    if (userId) {
      const user = await currentUser();
      const userEmail = user?.emailAddresses[0]?.emailAddress;
      
      if (userEmail) {
        const dbUser = await db.select().from(Users).where(eq(Users.email, userEmail));
        
        if (dbUser && dbUser.length > 0) {
          response.isOwner = dbUser[0].id === video[0].createdBy;
        }
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.log('[VIDEO_GET]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const resolvedParams = await params;
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title, description } = await req.json();
    
    // Get user's email from Clerk
    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress;
    
    if (!userEmail) {
      return new NextResponse("User email not found", { status: 400 });
    }

    // Find user in our database by email
    const dbUser = await db.select().from(Users).where(eq(Users.email, userEmail));
    
    if (!dbUser || dbUser.length === 0) {
      return new NextResponse("User not found in database", { status: 404 });
    }

    // Get the video
    const video = await db.select().from(Videos)
      .where(eq(Videos.id, resolvedParams.videoId));

    if (!video || video.length === 0) {
      return new NextResponse("Video not found", { status: 404 });
    }

    // Check if the user is the creator of the video
    if (video[0].createdBy !== dbUser[0].id) {
      return new NextResponse("Unauthorized: You are not the creator of this video", { status: 403 });
    }

    // Update fields that were provided
    const updateData: Record<string, string | null> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;

    // Only update if there are fields to update
    if (Object.keys(updateData).length === 0) {
      return new NextResponse("No fields to update", { status: 400 });
    }

    // Update the video
    await db.update(Videos)
      .set(updateData)
      .where(eq(Videos.id, resolvedParams.videoId));

    return NextResponse.json({ message: "Video updated successfully" });
  } catch (error) {
    console.log('[VIDEO_PATCH]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 