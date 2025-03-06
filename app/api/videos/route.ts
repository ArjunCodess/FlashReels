import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { Videos, Users } from "@/config/schema";
import { eq } from "drizzle-orm";

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

        const { script, audioUrl, captions, imageUrls, voice } = await req.json();

        const video = await db.insert(Videos).values({
            script: JSON.stringify(script),
            audioUrl,
            captions,
            imageUrls,
            voice,
            createdBy: dbUser[0].id
        }).returning();

        return NextResponse.json(video[0]);
    } catch (error) {
        console.log('[VIDEOS_POST]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}