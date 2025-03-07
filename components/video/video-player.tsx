'use client'

import React, { useState } from "react";
import { Player } from "@remotion/player";
import Composition from "./composition";

export interface Caption {
  word: string;
  start: number;
  end: number;
  confidence: number;
  punctuated_word: string;
}

export interface Video {
  id: string;
  title: string;
  description: string | null;
  script: string;
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

  return (
    <div className="border aspect-[9/16] col-span-2 rounded-md">
      <Player
        component={Composition}
        durationInFrames={Number(durationInFrames.toFixed(0)) + 10}
        compositionWidth={720}
        compositionHeight={1280}
        fps={30}
        inputProps={{ video: video, setDurationInFrames: setDurationInFrames }}
        controls
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}