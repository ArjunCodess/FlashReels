"use client";

import React from "react";
import VideoCard, { VideoData } from "@/components/video/video-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface VideoGridProps {
  videos: VideoData[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export default function VideoGrid({
  videos,
  loading,
  error,
  onRetry,
}: VideoGridProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-2 border-red-200 rounded-3xl">
        <CardContent className="flex flex-col items-center justify-center min-h-[300px] text-center p-6">
          <p className="text-lg text-red-500 mb-4">{error}</p>
          <Button onClick={onRetry} className="rounded-full">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (videos.length === 0) {
    return (
      <Card className="border-2 border-dashed rounded-3xl">
        <CardContent className="flex flex-col items-center justify-center min-h-[300px] text-center p-6">
          <p className="text-lg text-neutral-500 mb-4">
            No videos found
          </p>
          <Button className="rounded-full">
            <Link href="create-new">Create New</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {videos.map((video) => (
        <div key={video.id} className="aspect-[3/4]">
          <VideoCard video={video} />
        </div>
      ))}
    </div>
  );
}