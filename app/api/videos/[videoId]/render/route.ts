import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import axios, { AxiosError } from "axios";

interface RenderRequestBody {
  width?: number;
  height?: number;
  fps?: number;
  duration?: number;
}

// Create a type that combines videoId with Promise methods
type ParamsWithPromiseMethods = { 
  videoId: string;
  then: Promise<unknown>['then'];
  catch: Promise<unknown>['catch'];
  finally: Promise<unknown>['finally'];
  [Symbol.toStringTag]: string;
};

// Simplify the route handler to avoid type issues
export async function POST(
  req: NextRequest,
  { params }: { params: ParamsWithPromiseMethods }
) {
  try {
    const { userId } = auth();
    const { videoId } = params;

    // Check if user is authenticated
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Validate videoId
    if (!videoId) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      );
    }

    // Get input parameters from request with fallback values
    const requestBody = await req.json().catch(() => ({})) as RenderRequestBody;
    const { 
      width = 1080, 
      height = 1920, 
      fps = 30, 
      duration = 30 
    } = requestBody;

    // Create GitHub workflow dispatch payload
    const payload = {
      ref: "add-remotion-action", // Use your current branch name
      inputs: {
        videoId,
        width: width.toString(),
        height: height.toString(),
        fps: fps.toString(),
        duration: duration.toString(),
      },
    };

    // Get GitHub PAT from environment variables
    const githubToken = process.env.PAT_TOKEN;
    const githubRepo = process.env.REPO_NAME || "username/repo-name";

    if (!githubToken) {
      return NextResponse.json(
        { error: "GitHub token not configured. Please add PAT_TOKEN to your environment variables." },
        { status: 500 }
      );
    }

    // Log the GitHub repo and workflow we're trying to access (for debugging)
    console.log(`Attempting to trigger workflow in repo: ${githubRepo}, branch: ${payload.ref}`);
    console.log(`Using token: ${githubToken ? 'Token exists (first 4 chars: ' + githubToken.substring(0, 4) + '...)' : 'No token found'}`);
    
    try {
      // First try to list all workflows to find the correct one
      console.log(`Listing all workflows in repo: ${githubRepo}`);
      const workflowsResponse = await axios.get(
        `https://api.github.com/repos/${githubRepo}/actions/workflows`,
        {
          headers: {
            Authorization: `token ${githubToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );
      
      console.log(`Found ${workflowsResponse.data.workflows.length} workflows`);
      
      // Find the render video workflow
      const renderWorkflow = workflowsResponse.data.workflows.find(
        (wf: { name: string; path: string; id: number }) => 
          wf.name === "Render Video" || wf.path.includes("render-video.yml")
      );
      
      if (!renderWorkflow) {
        throw new Error("Render Video workflow not found in repository");
      }
      
      console.log(`Found workflow: ${renderWorkflow.name} (${renderWorkflow.path}), ID: ${renderWorkflow.id}`);
      
      // Use the workflow ID instead of the path
      console.log(`Making request to trigger workflow ID: ${renderWorkflow.id}`);
      console.log(`With payload: ${JSON.stringify(payload)}`);
      
      const response = await axios.post(
        `https://api.github.com/repos/${githubRepo}/actions/workflows/${renderWorkflow.id}/dispatches`,
        payload,
        {
          headers: {
            Authorization: `token ${githubToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );
      
      console.log("GitHub API response status:", response.status);
      
      // Return success response
      return NextResponse.json(
        { 
          message: "Video render job submitted successfully",
          videoId,
          jobDetails: {
            workflow: "render-video.yml",
            triggered: true,
            repository: githubRepo
          }
        }, 
        { status: 200 }
      );
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("GitHub API Error:", axiosError.response?.status, axiosError.response?.data);
      
      // More specific error message based on status code
      let errorMessage = "Failed to trigger video render";
      if (axiosError.response?.status === 404) {
        errorMessage = "Workflow file not found or not configured for manual triggering. Make sure you've committed .github/workflows/render-video.yml to your repository and it has the workflow_dispatch trigger.";
      } else if (axiosError.response?.status === 401) {
        errorMessage = "GitHub authentication failed. Check your PAT_TOKEN token and make sure it has the 'workflow' scope.";
      } else if (axiosError.response?.status === 422) {
        errorMessage = "Invalid request to GitHub API. Check your repository name format and make sure the branch exists.";
      } else if (axiosError.response?.status === 403) {
        errorMessage = "Permission denied. Make sure your PAT_TOKEN has the necessary permissions and GitHub Actions is enabled in your repository.";
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          details: axiosError.response?.data || axiosError.message || "Unknown error",
          repository: githubRepo,
          workflow: "render-video.yml"
        }, 
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error triggering video render:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to trigger video render",
        details: error instanceof Error ? error.message : "Unknown error"
      }, 
      { status: 500 }
    );
  }
}