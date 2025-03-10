import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Video } from "lucide-react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

interface RenderButtonProps {
  videoId: string;
  onVideoReady?: (downloadUrl: string) => void;
  onClick?: () => void;
  className?: string;
}

export const RenderButton: React.FC<RenderButtonProps> = ({ videoId, onVideoReady, onClick, className }) => {
  const [isRendering, setIsRendering] = useState(false);
  const { toast } = useToast();

  const handleRender = async () => {
    try {
      setIsRendering(true);
      
      // Call the onClick handler if provided
      if (onClick) {
        onClick();
      }
      
      // Call the render API endpoint
      await axios.post(`/api/videos/${videoId}/render`, {
        width: 1080,
        height: 1920,
        fps: 30,
        duration: 30,
      });
      
      // Show success toast
      toast({
        title: "Video render started",
        description: "Your video is being rendered. This may take a few minutes.",
        duration: 5000,
      });
      
      // Set a timeout to check the workflow status after a delay
      setTimeout(async () => {
        try {
          // Poll for the workflow status
          const checkWorkflowStatus = async () => {
            try {
              const response = await axios.get(`/api/videos/${videoId}/workflow-status`);
              
              if (response.data.downloadUrl) {
                // Update the video with the downloadUrl
                await axios.patch('/api/videos', {
                  id: videoId,
                  downloadUrl: response.data.downloadUrl
                });
                
                // Show a success message
                toast({
                  title: "Video is ready for download",
                  description: "Your rendered video is now available for download.",
                  duration: 5000,
                });
                
                // Call the callback function if provided
                if (onVideoReady && typeof onVideoReady === 'function') {
                  onVideoReady(response.data.downloadUrl);
                }
              } else {
                // If the download URL is not available yet, check again after some time
                setTimeout(checkWorkflowStatus, 10000); // Check every 10 seconds
              }
            } catch (error) {
              console.error("Error checking workflow status:", error);
            }
          };
          
          // Start polling after 5 seconds
          setTimeout(checkWorkflowStatus, 5000);
        } catch (error) {
          console.error("Error setting up workflow status check:", error);
        }
      }, 5000);
      
    } catch (error) {
      console.error("Error rendering video:", error);
      
      // Show error toast
      toast({
        title: "Error rendering video",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsRendering(false);
    }
  };
  
  return (
    <Button
      onClick={handleRender}
      disabled={isRendering}
      variant="default"
      size="sm"
      className={`flex items-center gap-2 ${className}`}
    >
      {isRendering ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Starting render...
        </>
      ) : (
        <>
          <Video className="h-4 w-4" />
          Render Video
        </>
      )}
    </Button>
  );
}; 