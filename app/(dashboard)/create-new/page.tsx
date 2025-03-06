"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import useDebounce from "@/hooks/useDebounce";
import SelectTopic from "@/components/dashboard/select-topic";
import SelectStyle from "@/components/dashboard/select-style";
import SelectDuration from "@/components/dashboard/select-duration";
import CustomLoader from "@/components/custom-loader";
import axios from "axios";

interface VideoScene {
  imagePrompt: string;
  contentText: string;
}

interface formData {
  [key: string]: string;
}

interface OnUserSelectType {
  (fieldName: string, fieldValue: string): void;
}

export default function CreateNew() {
  const [formData, setFormData] = useState<formData>({});
  const [inputValue, setInputValue] = useState({
    fieldName: "",
    fieldValue: "",
  });
  const [errors, setErrors] = useState({
    topic: false,
    imageStyle: false,
  });
  const [loading, setLoading] = useState(false);
  const [, setVideoScript] = useState<VideoScene[]>([]);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [audioGenerating, setAudioGenerating] = useState(false);
  const [, setAudioUrl] = useState<string>('');
  const [, setCaptions] = useState<string>('');

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
    
    setGeneratedImages(images);
    return images;
  };

  const getVideoScript = async () => {
    const newErrors = {
      topic: !formData.topic,
      imageStyle: !formData.imageStyle,
    };
    setErrors(newErrors);

    if (newErrors.topic || newErrors.imageStyle) return;

    setLoading(true);

    const prompt = `Generate a ${formData.duration || "30"}-second video script on the topic: "${formData.topic}". For each scene, provide an AI-generated image prompt in the "${formData.imageStyle}" style. Return the result in JSON format with "imagePrompt" and "contentText" as fields. No plain text output.`;

    try {
      const result = await axios.post('/api/get-video-script', { prompt });
      const scriptData = result.data.result;
      setVideoScript(scriptData);
      
      // Generate images for each scene
      await generateImages(scriptData);
      
      // Generate audio after getting the script
      setAudioGenerating(true);
      try {
        const audioResponse = await axios.post('/api/generate-audio', {
          scenes: scriptData
        });
        if (audioResponse.data.success) {
          console.log('Audio uploaded to:', audioResponse.data.audioUrl);
          setAudioUrl(audioResponse.data.audioUrl);
          setCaptions(audioResponse.data.captions || '');

          // Submit video data to database
          await submitVideoData(scriptData, audioResponse.data.audioUrl, audioResponse.data.captions || '', generatedImages);
        }
      } catch (error) {
        console.error('Error generating audio:', error);
      } finally {
        setAudioGenerating(false);
      }
      
    } catch (error) {
      console.error("Error generating video script:", error);
    } finally {
      setLoading(false);
    }
  };

  const submitVideoData = async (
    script: VideoScene[], 
    audioUrl: string, 
    captions: string, 
    imageUrls: string[]
  ) => {
    try {
      const response = await axios.post('/api/videos', {
        script,
        audioUrl,
        captions,
        imageUrls
      });
      console.log('Video data saved:', response.data);
    } catch (error) {
      console.error('Error saving video data:', error);
    }
  };

  return (
    <div className="pt-4 pb-8 px-8 mx-auto">
      <h1 className="text-2xl font-bold mt-2 mb-4">Create New</h1>

      <div className="space-y-8">
        <SelectTopic onUserSelect={onHandleInputChange} error={errors.topic} />
        <SelectStyle onUserSelect={onHandleInputChange} error={errors.imageStyle} />
        <SelectDuration onUserSelect={onHandleInputChange} />
      </div>

      <Button className="w-full mt-8" size="lg" onClick={getVideoScript}>
        Create
      </Button>

      <CustomLoader loading={loading || audioGenerating} />
    </div>
  );
}
