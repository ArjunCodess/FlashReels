import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { Videos, Users, Favourites } from "@/config/schema";
import { eq, and } from "drizzle-orm";

// Create a new video
export async function POST(req: Request) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

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

        const { 
            script, 
            audioUrl, 
            captions, 
            imageUrls, 
            voice, 
            captionStyle,
            title,
            description 
        } = await req.json();

        const video = await db.insert(Videos).values({
            title: title || `Video - ${new Date().toLocaleDateString()}`,
            description: description || "",
            script: JSON.stringify(script),
            audioUrl,
            captions,
            imageUrls,
            voice,
            captionStyle,
            status: 'generating',
            createdBy: dbUser[0].id
        }).returning();

        return NextResponse.json(video[0]);
    } catch (error) {
        console.log('[VIDEOS_POST]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// Get all videos for the current user
export async function GET() {
    try {
        const { userId: clerkUserId } = auth();
        const user = await currentUser();

        if (!clerkUserId || !user?.emailAddresses?.[0]?.emailAddress) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Get the user's email from Clerk
        const userEmail = user.emailAddresses[0].emailAddress;

        // Get the user's UUID from our database
        const dbUser = await db
            .select({
                id: Users.id
            })
            .from(Users)
            .where(eq(Users.email, userEmail))
            .limit(1);

        if (dbUser.length === 0) {
            return new NextResponse("User not found", { status: 404 });
        }

        const userId = dbUser[0].id;

        // First, get all videos
        const videos = await db
            .select({
                id: Videos.id,
                title: Videos.title,
                description: Videos.description,
                imageUrls: Videos.imageUrls,
                createdAt: Videos.createdAt,
                status: Videos.status,
            })
            .from(Videos);

        // Then, get all favorites for this user
        const favorites = await db
            .select({
                videoId: Favourites.videoId
            })
            .from(Favourites)
            .where(eq(Favourites.userId, userId));

        // Create a Set of favorited video IDs for efficient lookup
        const favoritedVideoIds = new Set(favorites.map(f => f.videoId));

        // Add isFavourite flag to each video
        const videosWithFavoriteStatus = videos.map(video => ({
            ...video,
            isFavourite: favoritedVideoIds.has(video.id)
        }));

        return NextResponse.json(videosWithFavoriteStatus);
    } catch (error) {
        console.error("[VIDEOS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// Update a video's status or other fields
export async function PATCH(req: Request) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id, status, title, description, downloadUrl } = await req.json();
        
        if (!id) {
            return new NextResponse("Video ID is required", { status: 400 });
        }

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

        // Update fields that were provided
        const updateData: Record<string, string | null> = {};
        if (status) updateData.status = status;
        if (title) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (downloadUrl !== undefined) updateData.downloadUrl = downloadUrl;

        // Only update if there are fields to update
        if (Object.keys(updateData).length === 0) {
            return new NextResponse("No fields to update", { status: 400 });
        }

        // Update the video
        const updatedVideo = await db.update(Videos)
            .set(updateData)
            .where(
                and(
                    eq(Videos.id, id),
                    eq(Videos.createdBy, dbUser[0].id)
                )
            )
            .returning();

        if (!updatedVideo || updatedVideo.length === 0) {
            return new NextResponse("Video not found or not owned by user", { status: 404 });
        }

        return NextResponse.json(updatedVideo[0]);
    } catch (error) {
        console.log('[VIDEOS_PATCH]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// Delete a video
export async function DELETE(req: Request) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        
        if (!id) {
            return new NextResponse("Video ID is required", { status: 400 });
        }

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

        // Delete the video
        const deletedVideo = await db.delete(Videos)
            .where(
                and(
                    eq(Videos.id, id),
                    eq(Videos.createdBy, dbUser[0].id)
                )
            )
            .returning();

        if (!deletedVideo || deletedVideo.length === 0) {
            return new NextResponse("Video not found or not owned by user", { status: 404 });
        }

        return NextResponse.json({ message: "Video deleted successfully" });
    } catch (error) {
        console.log('[VIDEOS_DELETE]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}