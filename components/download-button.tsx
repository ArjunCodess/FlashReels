import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface DownloadButtonProps {
  videoId: string;
  downloadUrl: string | null;
  className?: string;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ videoId, downloadUrl, className }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!downloadUrl) {
      toast({
        title: "Download not available",
        description: "The video is not yet available for download.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    try {
      setIsDownloading(true);
      
      // Show loading toast
      toast({
        title: "Starting download",
        description: "Your video download will begin shortly...",
        duration: 3000,
      });

      // The simplest and most reliable approach - direct navigation
      // This will trigger the download as a file from our server endpoint
      window.location.href = `/api/videos/${videoId}/download`;
      
      // Set a timeout to reset the downloading state
      setTimeout(() => {
        setIsDownloading(false);
      }, 3000);
    } catch (error) {
      console.error("Error downloading video:", error);
      
      toast({
        title: "Error downloading video",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
        duration: 5000,
      });
      setIsDownloading(false);
    }
  };
  
  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading || !downloadUrl}
      size="sm"
      className={`flex items-center gap-2 ${className}`}
    >
      {isDownloading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Downloading...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          {downloadUrl ? "Download Video" : "Download Unavailable"}
        </>
      )}
    </Button>
  );
}; 