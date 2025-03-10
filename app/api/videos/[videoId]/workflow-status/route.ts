import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import axios from "axios";
import { Videos, Users } from "@/config/schema";
import { db } from "@/config/db";
import { eq, and } from "drizzle-orm";

// Define types for GitHub API responses
interface GitHubWorkflowRun {
  id: number;
  name: string;
  status: string;
  conclusion: string;
  event: string;
  created_at: string;
  updated_at: string;
  url: string;
  inputs?: {
    videoId?: string;
    [key: string]: string | undefined;
  };
}

interface GitHubWorkflowRunDetails {
  workflow_run: GitHubWorkflowRun;
}

interface GitHubArtifact {
  id: number;
  name: string;
  size_in_bytes: number;
  archive_download_url: string;
}

interface GitHubRunsResponse {
  workflow_runs: GitHubWorkflowRun[];
}

interface GitHubArtifactsResponse {
  artifacts: GitHubArtifact[];
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const { userId } = auth();
    const resolvedParams = await params;
    const videoId = resolvedParams.videoId;

    // Check if user is authenticated
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get GitHub PAT from environment variables
    const githubToken = process.env.PAT_TOKEN;
    const githubRepo = process.env.REPO_NAME || "username/repo-name";

    if (!githubToken) {
      return NextResponse.json(
        { error: "GitHub token not configured" },
        { status: 500 }
      );
    }

    // First try to list all runs for the repository
    const runsResponse = await axios.get<GitHubRunsResponse>(
      `https://api.github.com/repos/${githubRepo}/actions/runs`,
      {
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );
    
    // First, get all render video workflow runs
    const allWorkflowRuns = runsResponse.data.workflow_runs.filter(
      (run: GitHubWorkflowRun) => run.name === "Render Video" && 
        run.event === "workflow_dispatch"
    );

    // Sort runs by created_at, most recent first
    allWorkflowRuns.sort((a: GitHubWorkflowRun, b: GitHubWorkflowRun) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Try to find a run specifically for this videoId by checking inputs
    let videoRun: GitHubWorkflowRun | null = null;
    let progressPercentage = 0;
    
    for (const run of allWorkflowRuns) {
      try {
        // Make a request to get the workflow run details which includes inputs
        const runDetailsUrl = run.url;
        const runDetails = await axios.get<GitHubWorkflowRunDetails>(runDetailsUrl, {
          headers: {
            Authorization: `token ${githubToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
        });
        
        // Check if this run was for our specific videoId
        const workflowRun = runDetails.data.workflow_run;
        if (workflowRun.inputs && workflowRun.inputs.videoId === videoId) {
          videoRun = workflowRun;
          
          // Calculate progress percentage based on time elapsed since the workflow started
          // This is a time-based estimation since we can't directly get render progress from GitHub
          if (workflowRun.status === "in_progress" || workflowRun.status === "queued") {
            const startTime = new Date(workflowRun.created_at).getTime();
            const currentTime = new Date().getTime();
            
            // Assume the workflow takes around 3 minutes (180000ms) to complete
            // This is an estimation and can be adjusted based on actual rendering times
            const estimatedTotalTime = 180000;
            const elapsedTime = currentTime - startTime;
            
            // Calculate percentage with a maximum of 95% (to avoid showing 100% before it's actually done)
            progressPercentage = Math.min(Math.floor((elapsedTime / estimatedTotalTime) * 100), 95);
          } else if (workflowRun.status === "completed" && workflowRun.conclusion === "success") {
            progressPercentage = 100;
          }
          
          break;
        }
      } catch (error) {
        console.error("Error fetching workflow run details:", error);
        continue;
      }
    }

    // If we didn't find a specific run for this videoId, just use the most recent one
    if (!videoRun && allWorkflowRuns.length > 0) {
      videoRun = allWorkflowRuns[0];
      
      // Set a default progress for this case
      if (videoRun.status === "in_progress") {
        const startTime = new Date(videoRun.created_at).getTime();
        const currentTime = new Date().getTime();
        const estimatedTotalTime = 180000;
        const elapsedTime = currentTime - startTime;
        progressPercentage = Math.min(Math.floor((elapsedTime / estimatedTotalTime) * 100), 95);
      } else if (videoRun.status === "completed" && videoRun.conclusion === "success") {
        progressPercentage = 100;
      }
    }

    // If no completed runs are found
    if (!videoRun) {
      return NextResponse.json(
        { 
          message: "No completed render workflows found",
          progressPercentage: 0
        },
        { status: 200 }
      );
    }

    // Get artifacts for this run
    const artifactsResponse = await axios.get<GitHubArtifactsResponse>(
      `https://api.github.com/repos/${githubRepo}/actions/runs/${videoRun.id}/artifacts`,
      {
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    const artifacts = artifactsResponse.data.artifacts;
    
    // Find the artifact that contains our video ID
    const videoArtifact = artifacts.find(
      (artifact: GitHubArtifact) => artifact.name.includes(videoId) || artifact.name.includes("rendered-video")
    );

    let downloadUrl = null;
    
    if (videoArtifact) {
      // Create a direct download URL
      downloadUrl = videoArtifact.archive_download_url;
      progressPercentage = 100; // If we have an artifact, the render is complete
    }

    // Update the video in the database with the downloadUrl
    if (downloadUrl) {
      try {
        // Get user's email from Clerk
        const user = await currentUser();
        const userEmail = user?.emailAddresses[0]?.emailAddress;
        
        if (!userEmail) {
          throw new Error("User email not found");
        }
        
        // Find user in our database by email
        const dbUser = await db.select().from(Users).where(eq(Users.email, userEmail));
        
        if (dbUser && dbUser.length > 0) {
          // Update the video
          await db.update(Videos)
            .set({ downloadUrl })
            .where(
              and(
                eq(Videos.id, videoId),
                eq(Videos.createdBy, dbUser[0].id)
              )
            );
        }
      } catch (error) {
        console.error("Error updating video with downloadUrl:", error);
      }
    }

    return NextResponse.json({
      status: videoRun.status,
      conclusion: videoRun.conclusion,
      created_at: videoRun.created_at,
      updated_at: videoRun.updated_at,
      downloadUrl,
      workflow_id: videoRun.id,
      artifacts_count: artifacts.length,
      progressPercentage // Include the progress percentage in the response
    });

  } catch (error) {
    console.error("Error checking workflow status:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to check workflow status",
        details: error instanceof Error ? error.message : "Unknown error",
        progressPercentage: 0
      }, 
      { status: 500 }
    );
  }
} 