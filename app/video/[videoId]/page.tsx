"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Pencil } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import RemotionVideoPlayer from "@/components/video/video-player";
import { RenderButton } from "@/components/render-button";
import { DownloadButton } from "@/components/download-button";

interface Caption {
  word: string;
  start: number;
  end: number;
  confidence: number;
  punctuated_word: string;
}

interface Scene {
  imagePrompt: string;
  contentText: string;
}

interface Creator {
  id: string;
  name: string;
  username: string;
  imageUrl: string | null;
}

interface VideoDetails {
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
  downloadUrl: string | null;
  creator: Creator | null;
  isOwner: boolean;
}

export default function VideoPage() {
  const { videoId } = useParams();
  const [video, setVideo] = useState<VideoDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    script: false,
    audio: false,
    images: false,
  });
  
  // Editing states
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const response = await axios.get(`/api/videos/${videoId}`);
        const videoData = response.data;
        console.log("Fetched video data with audio URL:", videoData.audioUrl);
        setVideo(videoData);
        setEditedTitle(videoData.title);
        setEditedDescription(videoData.description || "");
      } catch (err) {
        setError("Failed to load video details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoDetails();
  }, [videoId]);

  const formatScript = (scriptStr: string) => {
    try {
      // First try to parse as JSON
      const scenes = JSON.parse(scriptStr) as Scene[];
      return scenes;
    } catch (err) {
      // If parsing fails, check if it's already an array
      if (Array.isArray(scriptStr)) {
        return scriptStr as Scene[];
      }
      // If all else fails, return empty array
      console.error('Error parsing script:', err);
      return [];
    }
  };

  const scenes = video?.script ? formatScript(video.script) : [];
  console.log('Scenes:', scenes);

  const handleSaveTitle = async () => {
    if (!video || !video.isOwner) return;
    
    setIsSaving(true);
    try {
      await axios.patch(`/api/videos/${videoId}`, { title: editedTitle });
      setVideo(prev => prev ? { ...prev, title: editedTitle } : null);
      setIsEditingTitle(false);
      toast({
        title: "Success",
        description: "Title updated successfully",
      });
    } catch (err) {
      console.error('Error updating title:', err);
      toast({
        title: "Error",
        description: "Failed to update title",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDescription = async () => {
    if (!video || !video.isOwner) return;
    
    setIsSaving(true);
    try {
      await axios.patch(`/api/videos/${videoId}`, { description: editedDescription });
      setVideo(prev => prev ? { ...prev, description: editedDescription } : null);
      setIsEditingDescription(false);
      toast({
        title: "Success",
        description: "Description updated successfully",
      });
    } catch (err) {
      console.error('Error updating description:', err);
      toast({
        title: "Error",
        description: "Failed to update description",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Add a handler for when video is ready with download URL
  const handleVideoReady = (downloadUrl: string) => {
    if (video) {
      setVideo({
        ...video,
        downloadUrl
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="p-6">
          <p className="text-red-500">{error || "Video not found"}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 border rounded-md my-4">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column - Video Player */}
        <RemotionVideoPlayer video={video} />

        {/* Right Column - Video Details */}
        <div className="space-y-3 col-span-3">
          {/* Title with edit option */}
          <div className="flex items-center mt-6">
            {isEditingTitle ? (
              <>
                <Input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="text-3xl font-bold flex-grow focus:outline-none"
                  disabled={isSaving}
                />
                <Button 
                  size="sm"
                  variant="outline" 
                  onClick={handleSaveTitle}
                  disabled={isSaving}
                  className="ml-2"
                >
                  Save
                </Button>
                <Button 
                  size="sm"
                  variant="ghost" 
                  onClick={() => setIsEditingTitle(false)}
                  disabled={isSaving}
                  className="ml-2"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold flex-grow">{video.title}</h1>
                {video.isOwner && (
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => setIsEditingTitle(true)}
                    className="ml-2"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Description with edit option */}
          {isEditingDescription ? (
            <div className="flex flex-col gap-2 mt-0">
              <Textarea
                value={editedDescription}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditedDescription(e.target.value)}
                className="min-h-[100px]"
                placeholder="Add a description..."
                disabled={isSaving}
              />
              <div className="flex justify-end gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleSaveDescription}
                  disabled={isSaving}
                >
                  Save
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => {
                    setIsEditingDescription(false);
                    setEditedDescription(video.description || "");
                  }}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-start mt-0">
              <p className="text-gray-600 dark:text-gray-400 flex-grow my-auto">
                {video.description || "No description"}
              </p>
              {video.isOwner && (
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => setIsEditingDescription(true)}
                  className="ml-2 flex-shrink-0"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Caption Style</h3>
              <p className="mt-1 capitalize">{video.captionStyle}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Voice</h3>
              <p className="mt-1">{video.voice}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
              <p className="mt-1 capitalize">{video.status}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</h3>
              <p className="mt-1">{format(new Date(video.createdAt), "PPPP 'at' p")}</p>
            </div>
            <div className="col-span-2">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Created By</h3>
              <p className="mt-1">{video.creator?.name || "Unknown"}</p>
            </div>
          </div>

          {/* Action Buttons - placed just above Technical Details */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            {video.isOwner && video.status === "completed" && (
              <RenderButton videoId={video.id} onVideoReady={handleVideoReady} />
            )}
            {video.downloadUrl && (
              <DownloadButton videoId={video.id} downloadUrl={video.downloadUrl} />
            )}
            {/* Fill empty space with placeholders if buttons aren't shown */}
            {!(video.isOwner && video.status === "completed") && <div></div>}
            {!video.downloadUrl && <div></div>}
          </div>

          

          {/* Technical Details Collapsible */}
          <Collapsible
            open={showTechnicalDetails}
            onOpenChange={setShowTechnicalDetails}
            className="space-y-4"
          >
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full flex justify-between items-center">
                <span>Technical Details</span>
                {showTechnicalDetails ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4">
              {/* Script */}
              <Collapsible
                open={expandedSections.script}
                onOpenChange={() => toggleSection('script')}
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Script</span>
                    {expandedSections.script ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Card className="mt-2">
                    <div className="divide-y">
                      {scenes.map((scene, index) => (
                        <div key={index} className="p-4">
                          <h4 className="font-medium mb-2">Scene {index + 1}</h4>
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-medium">Content:</span> {scene.contentText}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-medium">Image Prompt:</span> {scene.imagePrompt}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </CollapsibleContent>
              </Collapsible>

              {/* Audio */}
              <Collapsible
                open={expandedSections.audio}
                onOpenChange={() => toggleSection('audio')}
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Audio</span>
                    {expandedSections.audio ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Card className="p-4 mt-2">
                    <audio controls className="w-full">
                      <source src={video.audioUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </Card>
                </CollapsibleContent>
              </Collapsible>

              {/* Images */}
              <Collapsible
                open={expandedSections.images}
                onOpenChange={() => toggleSection('images')}
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Images</span>
                    {expandedSections.images ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {video.imageUrls.map((url: string, index: number) => (
                      <Card key={index} className="relative aspect-[9/16] overflow-hidden">
                        <Image
                          src={url}
                          alt={`Scene ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </Card>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  );
}