import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Videos } from "@/config/schema";
import { db } from "@/config/db";
import { eq } from "drizzle-orm";
import JSZip from "jszip";

// Create a type that combines videoId with Promise methods
type ParamsWithPromiseMethods = { 
  videoId: string;
  then: Promise<unknown>['then'];
  catch: Promise<unknown>['catch'];
  finally: Promise<unknown>['finally'];
  [Symbol.toStringTag]: string;
};

export async function GET(
  req: NextRequest,
  { params }: { params: ParamsWithPromiseMethods }
) {
  try {
    const { userId } = auth();
    const { videoId } = params;

    console.log(`Download request for video ID: ${videoId}`);

    // Check if user is authenticated
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the video from the database to get the downloadUrl
    const videos = await db.select().from(Videos).where(eq(Videos.id, videoId));
    
    if (!videos || videos.length === 0) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }

    const video = videos[0];
    
    // Check if downloadUrl exists
    if (!video.downloadUrl) {
      return NextResponse.json(
        { error: "Video download URL not available" },
        { status: 404 }
      );
    }

    // Get GitHub PAT from environment variables
    const githubToken = process.env.PAT_TOKEN;
    
    if (!githubToken) {
      console.error("GitHub token not configured");
      return NextResponse.json(
        { error: "GitHub token not configured" },
        { status: 500 }
      );
    }

    try {
      // Create a simple redirect to the GitHub download URL with Authorization
      // This won't work directly in the browser, so instead we'll proxy the request
      const response = await fetch(video.downloadUrl, {
        headers: {
          'Authorization': `token ${githubToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      // Get the zip data
      const zipData = await response.arrayBuffer();
      
      // Use JSZip to unzip the file
      const zip = new JSZip();
      const zipContents = await zip.loadAsync(zipData);
      
      // Find video files in the zip
      const videoFiles = Object.keys(zipContents.files).filter(filename => 
        filename.endsWith('.mp4') && !zipContents.files[filename].dir
      );
      
      console.log(`Found video files: ${videoFiles.join(', ')}`);
      
      if (videoFiles.length === 0) {
        return NextResponse.json(
          { error: "No video files found in the artifact" },
          { status: 404 }
        );
      }
      
      // Get the first video file
      const videoFile = zipContents.files[videoFiles[0]];
      const videoData = await videoFile.async('arraybuffer');
      
      // Return the video file with appropriate headers
      return new NextResponse(videoData, {
        headers: {
          'Content-Type': 'video/mp4',
          'Content-Disposition': `attachment; filename="video-${videoId}.mp4"`,
          'Content-Length': videoData.byteLength.toString(),
        },
      });
    } catch (error) {
      console.error("Error downloading or processing artifact:", error);
      return NextResponse.json(
        { 
          error: "Error processing GitHub artifact", 
          details: error instanceof Error ? error.message : String(error)
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in download endpoint:", error);
    return NextResponse.json(
      { 
        error: "Failed to download video",
        details: error instanceof Error ? error.message : "Unknown error"
      }, 
      { status: 500 }
    );
  }
} 