"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";
import VideoGrid from "@/components/video/video-grid";
import { VideoData } from "@/components/video/video-card";

// Interface for raw video data from API
interface RawVideoData {
  id: string;
  title?: string;
  description?: string | null;
  imageUrls?: string[] | string | null;
  createdAt?: string;
  status?: string;
  isFavourite?: boolean;
  [key: string]: unknown; // Allow for other properties with unknown type
}

export default function Dashboard() {
  const [videoList, setVideoList] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Process video data to ensure it has all required fields
  const processVideoData = useCallback((video: RawVideoData): VideoData => {
    return {
      id: video.id,
      imageUrls: Array.isArray(video.imageUrls) ? video.imageUrls : [],
      title: video.title || 'Untitled Video',
      description: video.description || null,
      status: video.status || 'completed',
      createdAt: video.createdAt || new Date().toISOString(),
      isFavourite: video.isFavourite || false
    };
  }, []);

  // Function to merge new videos with existing ones, preserving order and only updating changed videos
  const mergeVideoLists = useCallback((existingVideos: VideoData[], newVideos: VideoData[]): VideoData[] => {
    // Create a map of existing videos by ID for quick lookup
    const existingVideoMap = new Map(existingVideos.map(video => [video.id, video]));
    
    // Create a new array with updated videos
    const updatedVideos = newVideos.map(newVideo => {
      const existingVideo = existingVideoMap.get(newVideo.id);
      
      // If the video exists and its status hasn't changed, keep the existing one
      if (existingVideo && existingVideo.status === newVideo.status) {
        return existingVideo;
      }
      
      // Otherwise use the new video data
      return newVideo;
    });
    
    return updatedVideos;
  }, []);

  const fetchVideos = useCallback(async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setLoading(true);
      }
      setError(null);
      
      // Add cache prevention parameters to ensure we get fresh data
      const response = await axios.get('/api/videos', {
        params: {
          _t: new Date().getTime() // Add timestamp to prevent caching
        },
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      // Process the videos to ensure they have all required fields
      const processedVideos = response.data.map(processVideoData);
      
      // Sort videos by createdAt in descending order (newest first)
      const sortedVideos = [...processedVideos].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      // Merge with existing videos to prevent unnecessary re-renders
      setVideoList(currentVideos => 
        isInitialLoad ? sortedVideos : mergeVideoLists(currentVideos, sortedVideos)
      );
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError('Failed to load videos. Please try again later.');
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      }
    }
  }, [processVideoData, mergeVideoLists]);

  useEffect(() => {
    // Initial load
    fetchVideos(true);

    // Set up polling to check for new videos or status changes
    const intervalId = setInterval(() => fetchVideos(false), 10000);
    
    return () => clearInterval(intervalId);
  }, [fetchVideos]);

  return (
    <div className="pt-4 pb-8 px-8 mx-auto">
      <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold mt-2 mb-4">My Videos</h1>
        <Button>
          <Link href="create-new">Create New</Link>
        </Button>
      </div>
      
      <VideoGrid 
        videos={videoList} 
        loading={loading} 
        error={error} 
        onRetry={() => fetchVideos(true)} 
      />
    </div>
  );
}
