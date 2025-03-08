'use client'

import React, { useState, useEffect } from "react";
import { Player } from "@remotion/player";
import VideoComposition from "@/remotion/composition";

export interface Caption {
  word: string;
  start: number;
  end: number;
  confidence: number;
  punctuated_word: string;
}

export interface Scene {
  imagePrompt: string;
  contentText: string;
}

export interface Video {
  id: string;
  title: string;
  description: string | null;
  script: string | Scene[];
  audioUrl: string;
  captions: Caption[];
  imageUrls: string[];
  voice: string;
  captionStyle: string;
  createdAt: string;
  status: string;
  createdBy: string;
}

export default function VideoPlayer({ video }: { video: Video }) {
  const [durationInFrames, setDurationInFrames] = useState(0);

  // Debug log the video props
  useEffect(() => {
    console.log("VideoPlayer received video props:", {
      id: video.id,
      title: video.title,
      audioUrl: video.audioUrl,
      hasAudio: !!video.audioUrl,
      imageCount: video.imageUrls.length,
      captionCount: video.captions.length
    });
  }, [video]);

  return (
    <div className="border aspect-[9/16] col-span-2 rounded-md">
      <Player
        component={VideoComposition}
        durationInFrames={Number(durationInFrames.toFixed(0)) + 10}
        compositionWidth={720}
        compositionHeight={1280}
        fps={30}
        inputProps={{ 
          video: {
            ...video,
            // Ensure audioUrl is properly passed
            audioUrl: video.audioUrl || ''
          }, 
          setDurationInFrames: setDurationInFrames 
        }}
        controls
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}