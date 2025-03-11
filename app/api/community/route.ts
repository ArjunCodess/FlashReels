import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { Videos, Users, Favourites } from "@/config/schema";
import { eq, desc } from "drizzle-orm";

// Get all videos for the community page with creator info
export async function GET() {
  try {
    // Get all videos along with their creator info
    const videosWithCreators = await db
      .select({
        id: Videos.id,
        title: Videos.title,
        description: Videos.description,
        imageUrls: Videos.imageUrls,
        createdAt: Videos.createdAt,
        status: Videos.status,
        createdBy: Videos.createdBy,
        creator: {
          id: Users.id,
          name: Users.name,
          username: Users.username,
          imageUrl: Users.imageUrl
        }
      })
      .from(Videos)
      .innerJoin(Users, eq(Videos.createdBy, Users.id))
      .where(eq(Videos.status, 'completed')) // Only show completed videos
      .orderBy(desc(Videos.createdAt)); // Sort by newest first

    // Check if user is authenticated to add favorite status
    const { userId: clerkUserId } = auth();
    let userFavorites = new Set();
    
    if (clerkUserId) {
      // Get user's favorites if they're logged in
      const user = await currentUser();
      const userEmail = user?.emailAddresses?.[0]?.emailAddress;
      
      if (userEmail) {
        // Get the user's UUID from our database
        const dbUser = await db
          .select({
            id: Users.id
          })
          .from(Users)
          .where(eq(Users.email, userEmail))
          .limit(1);

        if (dbUser.length > 0) {
          const userId = dbUser[0].id;
          
          // Get user's favorites
          const favorites = await db
            .select({
              videoId: Favourites.videoId
            })
            .from(Favourites)
            .where(eq(Favourites.userId, userId));

          // Create a Set of favorited video IDs for efficient lookup
          userFavorites = new Set(favorites.map(f => f.videoId));
        }
      }
    }

    // Format the response with proper typing and add favorite status
    const formattedVideos = videosWithCreators.map(video => ({
      id: video.id,
      title: video.title,
      description: video.description,
      imageUrls: Array.isArray(video.imageUrls) ? video.imageUrls : [],
      createdAt: video.createdAt,
      status: video.status,
      creator: video.creator,
      isFavourite: userFavorites.has(video.id)
    }));

    return NextResponse.json(formattedVideos);
  } catch (error) {
    console.error("[COMMUNITY_VIDEOS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 