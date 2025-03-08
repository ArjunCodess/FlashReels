import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Video } from "lucide-react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

interface RenderButtonProps {
  videoId: string;
}

export const RenderButton: React.FC<RenderButtonProps> = ({ videoId }) => {
  const [isRendering, setIsRendering] = useState(false);
  const { toast } = useToast();

  const handleRender = async () => {
    try {
      setIsRendering(true);
      
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
      className="flex items-center gap-2"
    >
      {isRendering ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Rendering...
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