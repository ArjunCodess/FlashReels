"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Card } from "@/components/ui/card";
import VideoStatusUpdater from "@/components/video/video-status-updater";
import Link from "next/link";
import { Heart } from "lucide-react";

export interface VideoData {
  id: string;
  title: string;
  description: string | null;
  imageUrls: string[];
  createdAt: string;
  status: string;
  isFavourite?: boolean;
}

interface VideoCardProps {
  video: VideoData;
}

export default function VideoCard({ video }: VideoCardProps) {
  const [isFavourite, setIsFavourite] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Use useEffect to update the local state when the video prop changes
  useEffect(() => {
    setIsFavourite(!!video.isFavourite);
  }, [video.isFavourite]);
  
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

  const toggleFavourite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Optimistically update the UI immediately for better user experience
      setIsFavourite(!isFavourite);
      
      const response = await fetch(`/api/favourites/${video.id}`, { 
        method: 'POST',
      });
      
      if (response.ok) {
        const data = await response.json();
        // If the server response differs from our optimistic update, correct it
        if (data.isFavourite !== !isFavourite) {
          setIsFavourite(data.isFavourite);
        }
      } else {
        // Revert optimistic update if request failed
        setIsFavourite(!isFavourite);
        console.error('Failed to toggle favourite status');
      }
    } catch (error) {
      // Revert optimistic update if request failed
      setIsFavourite(!isFavourite);
      console.error('Error toggling favourite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link href={`/video/${video.id}`} key={video.id}>
      {video.status === 'generating' && (
        <VideoStatusUpdater videoId={video.id} initialStatus={video.status} />
      )}
      <Card className="group relative overflow-hidden rounded-xl aspect-[9/16] w-full">
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
        
        {/* Favourite button */}
        <button 
          onClick={toggleFavourite}
          disabled={isLoading}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors z-10"
        >
          <Heart 
            className={`w-5 h-5 ${isFavourite ? 'fill-red-500 text-red-500' : 'text-white'} ${isLoading ? 'opacity-50' : ''}`} 
          />
        </button>
        
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
    </Link>
  );
} 