import React from 'react';
import { 
  AbsoluteFill, 
  Audio, 
  Img, 
  Sequence, 
  useCurrentFrame, 
  useVideoConfig,
  interpolate,
  spring
} from 'remotion';

interface Caption {
  word: string;
  start: number;
  end: number;
  confidence: number;
  punctuated_word: string;
}

interface FlashReelVideoProps {
  videoId: string;
  title: string;
  description: string | null;
  imageUrls: string[];
  audioUrl: string;
  captions: Caption[];
  script: string;
  voice: string;
}

const ImageSlide: React.FC<{ src: string, startFrame: number }> = ({ src, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const relativeFrame = frame - startFrame;
  const entryDuration = 15;
  
  // Entry animation
  const opacity = interpolate(
    relativeFrame,
    [0, entryDuration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );
  
  const scale = spring({
    frame: relativeFrame,
    fps,
    config: {
      damping: 20,
      stiffness: 100,
      mass: 0.5,
    }
  });
  
  return (
    <AbsoluteFill style={{ 
      opacity, 
      transform: `scale(${scale})`,
    }}>
      <Img
        src={src}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </AbsoluteFill>
  );
};

const CaptionOverlay: React.FC<{ captions: Caption[], audioStartFrame: number }> = ({ captions, audioStartFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  if (!captions || captions.length === 0) {
    return null;
  }
  
  // Find the current caption based on the frame
  const currentTimeInSecs = (frame - audioStartFrame) / fps;
  const currentCaptions = captions.filter(
    caption => currentTimeInSecs >= caption.start && currentTimeInSecs <= caption.end
  );
  
  const visibleText = currentCaptions.map(c => c.punctuated_word || c.word).join(' ');
  
  return (
    <div style={{
      position: 'absolute',
      bottom: 100,
      left: 0,
      right: 0,
      textAlign: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      padding: '15px',
      color: 'white',
      fontSize: '24px',
      fontFamily: 'sans-serif',
      fontWeight: 'bold',
    }}>
      {visibleText}
    </div>
  );
};

const TitleCard: React.FC<{ title: string; description: string | null }> = ({ title, description }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const titleOpacity = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 100, mass: 0.5 }
  });
  
  const descriptionOpacity = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 20, stiffness: 80, mass: 0.8 }
  });
  
  return (
    <AbsoluteFill style={{
      backgroundColor: 'black',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '50px',
    }}>
      <h1 style={{
        color: 'white',
        fontSize: '48px',
        fontWeight: 'bold',
        textAlign: 'center',
        margin: '20px 0',
        opacity: titleOpacity,
      }}>
        {title}
      </h1>
      
      {description && (
        <p style={{
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '24px',
          textAlign: 'center',
          margin: '20px 0',
          opacity: descriptionOpacity,
          maxWidth: '80%',
        }}>
          {description}
        </p>
      )}
    </AbsoluteFill>
  );
};

export const FlashReelVideo: React.FC<FlashReelVideoProps> = ({
  title,
  description,
  imageUrls,
  audioUrl,
  captions,
}) => {
  const { fps, durationInFrames } = useVideoConfig();
  
  // Calculate frames for each section
  const titleDuration = 3 * fps; // 3 seconds for title
  const audioStartFrame = titleDuration;
  
  // Calculate how many frames per image
  const totalImagesFrames = durationInFrames - titleDuration;
  const validImageUrls = imageUrls?.filter(url => url) || [];
  const imageCount = validImageUrls.length || 1;
  const framesPerImage = Math.floor(totalImagesFrames / imageCount);
  
  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {/* Title card */}
      <Sequence from={0} durationInFrames={titleDuration}>
        <TitleCard title={title} description={description} />
      </Sequence>
      
      {/* Audio track */}
      {audioUrl && (
        <Audio 
          src={audioUrl} 
          startFrom={audioStartFrame} 
        />
      )}
      
      {/* Image slides */}
      {validImageUrls.map((url, index) => {
        const startFrame = audioStartFrame + (index * framesPerImage);
        const duration = index === imageCount - 1 
          ? durationInFrames - startFrame // Last image extends to the end
          : framesPerImage;
          
        return (
          <Sequence key={index} from={startFrame} durationInFrames={duration}>
            <ImageSlide src={url} startFrame={startFrame} />
          </Sequence>
        );
      })}
      
      {/* Captions overlay */}
      {captions && captions.length > 0 && (
        <Sequence from={audioStartFrame} durationInFrames={durationInFrames - audioStartFrame}>
          <CaptionOverlay captions={captions} audioStartFrame={audioStartFrame} />
        </Sequence>
      )}
      
      {/* Video title overlay at bottom */}
      <AbsoluteFill style={{
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '30px 0',
      }}>
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: '10px 20px',
          borderRadius: '10px',
          color: 'white',
          fontSize: '18px',
          fontWeight: 'bold',
          fontFamily: 'sans-serif',
        }}>
          {title}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};