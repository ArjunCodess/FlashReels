import React, { useEffect, useCallback } from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Video } from "./video-player";

export default function Composition({
  video,
  setDurationInFrames,
}: {
  video: Video;
  setDurationInFrames: (duration: number) => void;
}) {
  const captions = video.captions;
  const imagesList = video.imageUrls;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const getDurationInFrames = useCallback(() => {
    if (!captions || captions.length === 0) {
      return 0;
    }
    const totalDuration = captions[captions.length - 1].end * fps;
    setDurationInFrames(totalDuration);
    return totalDuration;
  }, [captions, fps, setDurationInFrames]);

  const durationInFrames = getDurationInFrames();

  useEffect(() => {
    if (video) {
      getDurationInFrames();
    }
  }, [video, getDurationInFrames]);

  const getCurrentCaption = () => {
    const currentTime = frame / fps;
    const currentCaption = captions.find(
      (caption) => caption.start <= currentTime && caption.end >= currentTime
    );
    return currentCaption?.punctuated_word;
  };

  const getCaptionStyle = () => {
    const captionText = getCurrentCaption();
    if (!captionText) return null;

    switch (video.captionStyle) {
      case "classic":
        return (
          <p className="text-white text-7xl bg-black/80 py-2 px-4 text-center w-fit mx-auto absolute bottom-80 left-0 right-0 rounded-lg">
            {captionText}
          </p>
        );
      case "supreme":
        return (
          <p className="text-white text-7xl font-bold bg-neutral-950 py-3 px-6 text-center w-fit mx-auto absolute bottom-80 left-0 right-0 shadow-lg border-2 rounded-lg">
            {captionText}
          </p>
        );
      case "glitch":
        return (
          <div className="w-fit mx-auto absolute bottom-80 left-0 right-0 bg-white rounded-lg">
            <p className="text-white text-7xl font-bold py-2 px-4 text-center relative">
              {captionText}
            </p>
            <p className="text-blue-600 text-7xl font-bold py-2 px-4 text-center absolute top-0 left-1 opacity-70">
              {captionText}
            </p>
            <p className="text-red-600 text-7xl font-bold py-2 px-4 text-center absolute top-0 left-[-4px] opacity-70">
              {captionText}
            </p>
          </div>
        );
      case "fire":
        return (
          <div className="w-fit mx-auto absolute bottom-80 left-0 right-0 bg-black/80 rounded-lg">
            <p className="text-7xl font-bold py-2 px-4 text-center text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-red-600 drop-shadow-[0_0_8px_rgba(234,88,12,0.7)]">
              {captionText}
            </p>
          </div>
        );
      case "futuristic":
        return (
          <p className="text-cyan-300 text-7xl font-light py-2 px-4 text-center w-fit mx-auto absolute bottom-80 left-0 right-0 border border-cyan-400 bg-black/40 tracking-wider drop-shadow-[0_0_5px_rgba(6,182,212,0.7)] rounded-lg">
            {captionText}
          </p>
        );
      default:
        return (
          <p className="text-white text-7xl bg-black/80 rounded-md py-2 px-4 text-center w-fit mx-auto absolute bottom-80 left-0 right-0">
            {captionText}
          </p>
        );
    }
  };

  return (
    <AbsoluteFill>
      {imagesList.map((image, index) => {
        const startTime = (index * durationInFrames) / imagesList.length;
        const scale = (index: number) =>
          interpolate(
            frame,
            [
              startTime,
              startTime + durationInFrames / 2,
              startTime + durationInFrames,
            ],
            index % 2 == 0 ? [1, 1.8, 1] : [1.8, 1, 1.8],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

        return (
          <Sequence
            key={index}
            from={startTime}
            durationInFrames={durationInFrames}
          >
            <AbsoluteFill>
              <Img
                src={image}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: `scale(${scale(index)})`,
                }}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}

      <AbsoluteFill>{getCaptionStyle()}</AbsoluteFill>

      <Audio src={video.audioUrl} />
    </AbsoluteFill>
  );
}
