import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { eq, and } from "drizzle-orm";
import { Favourites, Videos, Users } from "@/config/schema";

type Context = {
  params: Promise<{ videoId: string }>;
};

// POST /api/favourites/[videoId] - Toggle favourite status
export async function POST(
  request: NextRequest,
  context: Context
) {
  const { videoId } = await context.params;
  
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

    // Check if video exists
    const video = await db
      .select()
      .from(Videos)
      .where(eq(Videos.id, videoId))
      .limit(1);

    if (video.length === 0) {
      return new NextResponse("Video not found", { status: 404 });
    }

    // Check if already favourited
    const existingFavourite = await db
      .select()
      .from(Favourites)
      .where(
        and(
          eq(Favourites.userId, userId),
          eq(Favourites.videoId, videoId)
        )
      )
      .limit(1);

    // If already favourited, remove it
    if (existingFavourite.length > 0) {
      await db
        .delete(Favourites)
        .where(
          and(
            eq(Favourites.userId, userId),
            eq(Favourites.videoId, videoId)
          )
        );
      
      return NextResponse.json({ isFavourite: false });
    }
    
    // Otherwise, add it as a favourite
    await db.insert(Favourites).values({
      userId,
      videoId,
    });
    
    return NextResponse.json({ isFavourite: true });
  } catch (error) {
    console.error("[FAVOURITE_TOGGLE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// GET /api/favourites/[videoId] - Check if a video is favourited
export async function GET(
  request: NextRequest,
  context: Context
) {
  const { videoId } = await context.params;
  
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

    // Check if already favourited
    const existingFavourite = await db
      .select()
      .from(Favourites)
      .where(
        and(
          eq(Favourites.userId, userId),
          eq(Favourites.videoId, videoId)
        )
      )
      .limit(1);
    
    return NextResponse.json({ 
      isFavourite: existingFavourite.length > 0 
    });
  } catch (error) {
    console.error("[FAVOURITE_CHECK]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 