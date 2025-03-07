"use client";

import React from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Card } from "@/components/ui/card";
import VideoStatusUpdater from "@/components/video-status-updater";

export interface VideoData {
  id: string;
  title: string;
  description: string | null;
  imageUrls: string[];
  createdAt: string;
  status: string;
}

interface VideoCardProps {
  video: VideoData;
}

export default function VideoCard({ video }: VideoCardProps) {
  const getThumbnail = (video: VideoData) => {
    return video.imageUrls && video.imageUrls.length > 0 ? video.imageUrls[0] : null;
  };

  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'recently';
    }
  };

  return (
    <React.Fragment key={video.id}>
      {video.status === 'generating' && (
        <VideoStatusUpdater videoId={video.id} initialStatus={video.status} />
      )}
      <Card className="group relative overflow-hidden rounded-3xl aspect-[3/4] w-full">
        {getThumbnail(video) ? (
          <Image 
            src={getThumbnail(video)!} 
            alt={video.title} 
            fill 
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">No thumbnail</p>
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/60" />
        
        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">{video.title}</h2>
          <p className="text-sm text-gray-200">{formatTimeAgo(video.createdAt)}</p>
        </div>

        {/* Generating overlay */}
        {video.status === 'generating' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mb-2"></div>
              <p className="text-white text-sm">Generating...</p>
            </div>
          </div>
        )}
      </Card>
    </React.Fragment>
  );
} 