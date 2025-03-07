"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import useDebounce from "@/hooks/useDebounce";
import SelectTopic from "@/components/dashboard/select-topic";
import SelectStyle from "@/components/dashboard/select-style";
import SelectDuration from "@/components/dashboard/select-duration";
import SelectVoice from "@/components/dashboard/select-voice";
import SelectCaptionStyle from "@/components/dashboard/select-caption-style";
import CustomLoader from "@/components/custom-loader";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

interface VideoScene {
  imagePrompt: string;
  contentText: string;
  audioUrl?: string;
}

interface formData {
  [key: string]: string;
}

interface OnUserSelectType {
  (fieldName: string, fieldValue: string): void;
}

export default function CreateNew() {
  const router = useRouter();
  const [formData, setFormData] = useState<formData>({});
  const [inputValue, setInputValue] = useState({
    fieldName: "",
    fieldValue: "",
  });
  const [errors, setErrors] = useState({
    topic: false,
    imageStyle: false,
    voice: false,
    captionStyle: false,
  });
  const [loading, setLoading] = useState(false);
  const [, setVideoScript] = useState<VideoScene[]>([]);
  const [, setGeneratedImages] = useState<string[]>([]);
  const [audioGenerating, setAudioGenerating] = useState(false);
  const [, setAudioUrl] = useState<string>('');
  const [, setCaptions] = useState<Array<{
    word: string;
    start: number;
    end: number;
    confidence: number;
    punctuated_word: string;
  }>>([]);

  const debouncedInputValue = useDebounce(inputValue, 500);

  useEffect(() => {
    if (debouncedInputValue.fieldName && debouncedInputValue.fieldValue) {
      console.log(
        debouncedInputValue.fieldName,
        debouncedInputValue.fieldValue
      );
    }
  }, [debouncedInputValue]);

  const onHandleInputChange: OnUserSelectType = useCallback(
    (fieldName, fieldValue) => {
      setInputValue({ fieldName, fieldValue });
      setFormData((prev) => ({
        ...prev,
        [fieldName]: fieldValue,
      }));
      setErrors((prev) => ({
        ...prev,
        [fieldName]: !fieldValue,
      }));
    },
    []
  );

  const generateImages = async (scenes: VideoScene[]) => {
    const images: string[] = [];
    
    for (const scene of scenes) {
      try {
        const response = await axios.post('/api/generate-image', {
          prompt: scene.imagePrompt
        });
        
        const imageUrl = response.data.imageUrl;
        console.log('Generated image URL:', imageUrl);
        images.push(imageUrl);
      } catch (error) {
        console.error('Error generating image:', error);
        images.push('');
      }
    }
    
    return images;
  };

  const generateCaptions = async (audioUrl: string) => {
    try {
      console.log('Generating captions for audio:', audioUrl);
      const response = await axios.post('/api/generate-captions', {
        audioUrl
      });
      
      const captionData = response.data.transcript;
      console.log('Generated captions:', captionData);
      setCaptions(captionData);
      return captionData;
    } catch (error) {
      console.error('Error generating captions:', error);
      return [];
    }
  };

  const getVideoScript = async () => {
    const newErrors = {
      topic: !formData.topic,
      imageStyle: !formData.imageStyle,
      voice: !formData.voice,
      captionStyle: !formData.captionStyle,
    };
    setErrors(newErrors);

    if (newErrors.topic || newErrors.imageStyle || newErrors.voice || newErrors.captionStyle) return;

    setLoading(true);

    const prompt = `Generate a ${formData.duration || "30"}-second video script on the topic: "${formData.topic}". For each scene, provide an AI-generated image prompt in the "${formData.imageStyle}" style. Return the result in JSON format with "imagePrompt" and "contentText" as fields. No plain text output.`;

    try {
      const result = await axios.post('/api/get-video-script', { prompt });
      const scriptData = result.data.result;
      setVideoScript(scriptData);
      
      // Generate images for each scene
      const images = await generateImages(scriptData);
      setGeneratedImages(images);
      
      // Generate audio after getting the script
      setAudioGenerating(true);
      try {
        const audioResponse = await axios.post('/api/generate-audio', {
          scenes: scriptData,
          voice: formData.voice
        });
        if (audioResponse.data.success) {
          const audioUrl = audioResponse.data.audioUrl;
          console.log('Audio uploaded to:', audioUrl);
          setAudioUrl(audioUrl);
          
          // Generate captions ONCE after audio is created
          console.log('Calling generateCaptions with audioUrl:', audioUrl);
          const captionData = await generateCaptions(audioUrl);
          
          // Create a title from the topic
          const title = `${formData.topic.charAt(0).toUpperCase() + formData.topic.slice(1)}`;
          
          // Get the first sentence of the first scene as description
          const description = scriptData[0]?.contentText.split('.')[0] + '.';
          
          try {
            // Submit video data to database with captions
            const videoData = await submitVideoData(
              scriptData, 
              audioUrl, 
              captionData, 
              images,
              formData.voice,
              formData.captionStyle,
              title,
              description
            );
            
            if (videoData) {
              toast({
                title: "Video created successfully!",
                description: "Your video is now being processed.",
              });
              
              // Redirect to dashboard after video creation
              router.push('/dashboard');
            } else {
              throw new Error("Failed to save video data");
            }
          } catch (error) {
            console.error('Error saving video data:', error);
            toast({
              title: "Error saving video",
              description: "There was a problem saving your video. Please try again.",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error('Error generating audio:', error);
        toast({
          title: "Error generating audio",
          description: "There was a problem generating audio for your video. Please try again.",
          variant: "destructive",
        });
      } finally {
        setAudioGenerating(false);
      }
      
    } catch (error) {
      console.error("Error generating video script:", error);
      toast({
        title: "Error generating script",
        description: "There was a problem generating the script for your video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const submitVideoData = async (
    script: VideoScene[], 
    audioUrl: string, 
    captions: Array<{
      word: string;
      start: number;
      end: number;
      confidence: number;
      punctuated_word: string;
    }>, 
    imageUrls: string[],
    voice: string,
    captionStyle: string,
    title: string,
    description: string
  ) => {
    try {
      // Ensure imageUrls is an array of strings
      const validImageUrls = imageUrls.filter(url => typeof url === 'string' && url.trim() !== '');
      
      // Convert captions to string if needed
      const captionsData = typeof captions === 'string' ? captions : JSON.stringify(captions);
      
      const response = await axios.post('/api/videos', {
        script: JSON.stringify(script),
        audioUrl,
        captions: captionsData,
        imageUrls: validImageUrls,
        voice,
        captionStyle,
        title,
        description
      });
      
      console.log('Video data saved:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error saving video data:', error);
      return null;
    }
  };

  return (
    <div className="pt-4 pb-8 px-8 mx-auto">
      <h1 className="text-2xl font-bold mt-2 mb-4">Create New</h1>

      <div className="space-y-8">
        <SelectTopic onUserSelect={onHandleInputChange} error={errors.topic} />
        <SelectStyle onUserSelect={onHandleInputChange} error={errors.imageStyle} />
        <SelectVoice onUserSelect={onHandleInputChange} error={errors.voice} />
        <SelectCaptionStyle onUserSelect={onHandleInputChange} error={errors.captionStyle} />
        <SelectDuration onUserSelect={onHandleInputChange} />
      </div>

      <Button className="w-full mt-8" size="lg" onClick={getVideoScript}>
        Create
      </Button>

      <CustomLoader loading={loading || audioGenerating} />
    </div>
  );
}