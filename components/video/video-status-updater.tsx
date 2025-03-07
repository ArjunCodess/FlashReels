"use client";

import { useEffect } from "react";
import axios from "axios";

interface VideoStatusUpdaterProps {
  videoId: string;
  initialStatus: string;
}

export default function VideoStatusUpdater({ videoId, initialStatus }: VideoStatusUpdaterProps) {
  useEffect(() => {
    // Only run this effect if the video is in generating status
    if (initialStatus === 'generating') {
      const updateVideoStatus = async () => {
        try {
          // Wait a bit to simulate processing time
          await new Promise(resolve => setTimeout(resolve, 5000));
          
          // Update the video status to completed
          await axios.patch('/api/videos', {
            id: videoId,
            status: 'completed'
          });
          
          console.log('Video status updated to completed');
        } catch (error) {
          console.error('Error updating video status:', error);
        }
      };

      updateVideoStatus();
    }
  }, [videoId, initialStatus]);

  // This component doesn't render anything
  return null;
} 