import React, { useEffect, useCallback } from "react";
import { AbsoluteFill, Audio, Img, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
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
    const currentCaption = captions.find(caption => caption.start <= currentTime && caption.end >= currentTime);
    return currentCaption?.punctuated_word;
  }

  return (
    <AbsoluteFill>
      {imagesList.map((image, index) => {
        const startTime = (index * durationInFrames) / imagesList.length;
        const scale = (index: number) => interpolate(frame, [startTime, startTime + durationInFrames/2, startTime + durationInFrames], index % 2 == 0 ? [1, 1.8, 1] : [1.8, 1, 1.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

        return (
          <Sequence
            key={index}
            from={startTime}
            durationInFrames={durationInFrames}
          >
            <AbsoluteFill>
              <Img
                src={image}
                style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale(index)})` }}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}

      <AbsoluteFill>
        <p className="text-white text-7xl bg-black/80 rounded-md py-2 px-4 text-center w-fit mx-auto absolute bottom-60 left-0 right-0">{getCurrentCaption()}</p>
      </AbsoluteFill>

      <Audio src={video.audioUrl} />
    </AbsoluteFill>
  );
}