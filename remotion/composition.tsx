import React, { useEffect, useCallback } from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";
import { Video } from "@/components/video/video-player";

// Add font styles
const fontStyles = {
  __html: `
    @font-face {
      font-family: 'Geist';
      src: url(${staticFile('/fonts/Geist-Regular.woff2')}) format('woff2');
      font-weight: normal;
      font-style: normal;
    }
    @font-face {
      font-family: 'Geist';
      src: url(${staticFile('/fonts/Geist-Bold.woff2')}) format('woff2');
      font-weight: bold;
      font-style: normal;
    }
    @font-face {
      font-family: 'Geist';
      src: url(${staticFile('/fonts/Geist-Light.woff2')}) format('woff2');
      font-weight: 300;
      font-style: normal;
    }
  `
};

export default function Composition({ 
  video, 
  setDurationInFrames 
}: { 
  video: Video; 
  setDurationInFrames?: (duration: number) => void 
}) {
  const captions = video.captions;
  const imagesList = video.imageUrls;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Debug log for audio url
  useEffect(() => {
    console.log("Audio URL:", video.audioUrl);
  }, [video.audioUrl]);

  // Function to handle audio URL for Remotion
  const getAudioSource = useCallback(() => {
    if (!video.audioUrl) return null;
    
    // If it's already a full URL (starts with http or https), return it as is
    if (video.audioUrl.startsWith('http://') || video.audioUrl.startsWith('https://')) {
      return video.audioUrl;
    }
    
    // Otherwise, try to handle it as a relative path
    try {
      return staticFile(video.audioUrl);
    } catch (error) {
      console.error("Error loading audio file:", error);
      return video.audioUrl; // Fallback to original
    }
  }, [video.audioUrl]);

  const audioSource = getAudioSource();

  const getDurationInFrames = useCallback(() => {
    if (!captions || captions.length === 0) {
      return 0;
    }
    const totalDuration = captions[captions.length - 1].end * fps;
    return totalDuration;
  }, [captions, fps]);

  const durationInFrames = getDurationInFrames();
  
  // Use an effect to update the parent component's state
  useEffect(() => {
    // Only call setDurationInFrames if it exists
    if (typeof setDurationInFrames === 'function') {
      setDurationInFrames(durationInFrames);
    }
  }, [durationInFrames, setDurationInFrames]);

  const getCurrentCaption = () => {
    const currentTime = frame / fps;
    const currentCaption = captions.find(
      (caption: { start: number; end: number }) =>
        caption.start <= currentTime && caption.end >= currentTime
    );
    return currentCaption?.punctuated_word;
  };

  const getCaptionStyle = () => {
    const captionText = getCurrentCaption();
    if (!captionText) return null;

    switch (video.captionStyle) {
      case "classic":
        return (
          <p style={{
            color: 'white',
            fontSize: '3rem',
            backgroundColor: 'rgba(0,0,0,0.8)',
            padding: '0.5rem 1rem',
            textAlign: 'center',
            width: 'fit-content',
            margin: '0 auto',
            position: 'absolute',
            bottom: '20rem',
            left: 0,
            right: 0,
            borderRadius: '0.5rem',
            fontFamily: '"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            {captionText}
          </p>
        );
      case "supreme":
        return (
          <p style={{
            color: 'white',
            fontSize: '3rem',
            fontWeight: 'bold',
            backgroundColor: '#0a0a0a',
            padding: '0.75rem 1.5rem',
            textAlign: 'center',
            width: 'fit-content',
            margin: '0 auto',
            position: 'absolute',
            bottom: '20rem',
            left: 0,
            right: 0,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            border: '2px solid #262626',
            borderRadius: '0.5rem',
            fontFamily: '"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            {captionText}
          </p>
        );
      case "glitch":
        return (
          <div style={{
            width: 'fit-content',
            margin: '0 auto',
            position: 'absolute',
            bottom: '20rem',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            borderRadius: '0.5rem'
          }}>
            <p style={{
              color: 'white',
              fontSize: '3rem',
              fontWeight: 'bold',
              padding: '0.5rem 1rem',
              textAlign: 'center',
              position: 'relative',
              fontFamily: '"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
              {captionText}
            </p>
            <p style={{
              color: '#2563eb', // blue-600
              fontSize: '3rem',
              fontWeight: 'bold',
              padding: '0.5rem 1rem',
              textAlign: 'center',
              position: 'absolute',
              top: 0,
              left: '0.25rem',
              opacity: 0.7,
              fontFamily: '"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
              {captionText}
            </p>
            <p style={{
              color: '#dc2626', // red-600
              fontSize: '3rem',
              fontWeight: 'bold',
              padding: '0.5rem 1rem',
              textAlign: 'center',
              position: 'absolute',
              top: 0,
              left: '-4px',
              opacity: 0.7,
              fontFamily: '"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
              {captionText}
            </p>
          </div>
        );
      case "fire":
        return (
          <div style={{
            width: 'fit-content',
            margin: '0 auto',
            position: 'absolute',
            bottom: '20rem',
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            borderRadius: '0.5rem'
          }}>
            <p style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              padding: '0.5rem 1rem',
              textAlign: 'center',
              color: 'transparent',
              backgroundImage: 'linear-gradient(to bottom, #fef08a, #facc15, #dc2626)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 8px rgba(234,88,12,0.7))',
              fontFamily: '"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
              {captionText}
            </p>
          </div>
        );
      case "futuristic":
        return (
          <p style={{
            color: '#67e8f9', // cyan-300
            fontSize: '3rem',
            fontWeight: 300,
            padding: '0.5rem 1rem',
            textAlign: 'center',
            width: 'fit-content',
            margin: '0 auto',
            position: 'absolute',
            bottom: '20rem',
            left: 0,
            right: 0,
            border: '1px solid #22d3ee', // cyan-400
            backgroundColor: 'rgba(0,0,0,0.4)',
            letterSpacing: '0.05em',
            filter: 'drop-shadow(0 0 5px rgba(6,182,212,0.7))',
            borderRadius: '0.5rem',
            fontFamily: '"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            {captionText}
          </p>
        );
      default:
        return (
          <p style={{
            color: 'white',
            fontSize: '3rem',
            backgroundColor: 'rgba(0,0,0,0.8)',
            borderRadius: '0.375rem',
            padding: '0.5rem 1rem',
            textAlign: 'center',
            width: 'fit-content',
            margin: '0 auto',
            position: 'absolute',
            bottom: '20rem',
            left: 0,
            right: 0,
            fontFamily: '"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            {captionText}
          </p>
        );
    }
  };

  return (
    <AbsoluteFill>
      <style dangerouslySetInnerHTML={fontStyles} />
      {imagesList.map((image: string, index: number) => {
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

      {audioSource && (
        <Audio 
          src={audioSource} 
          volume={1}
        />
      )}
    </AbsoluteFill>
  );
}
