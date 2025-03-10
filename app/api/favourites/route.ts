import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { eq, and } from "drizzle-orm";
import { Favourites, Videos, Users } from "@/config/schema";

// GET /api/favourites - Get all favourites for the current user
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

    // Fetch favourites with video details using a more efficient query
    const favouriteVideos = await db
      .select({
        id: Videos.id,
        title: Videos.title,
        description: Videos.description,
        imageUrls: Videos.imageUrls,
        createdAt: Videos.createdAt,
        status: Videos.status,
      })
      .from(Videos)
      .innerJoin(
        Favourites,
        and(
          eq(Favourites.videoId, Videos.id),
          eq(Favourites.userId, userId)
        )
      );

    // Add isFavourite flag to each video
    const videosWithFavouriteStatus = favouriteVideos.map(video => ({
      ...video,
      isFavourite: true
    }));

    return NextResponse.json(videosWithFavouriteStatus);
  } catch (error) {
    console.error("[FAVOURITES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 