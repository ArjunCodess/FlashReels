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
import { ChevronDown, ChevronUp, Pencil, Check, X } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import RemotionVideoPlayer from "@/components/video/video-player";

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
  captions: string;
  imageUrls: string[];
  voice: string;
  captionStyle: string;
  createdAt: string;
  status: string;
  createdBy: string;
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
        setVideo(response.data);
        setEditedTitle(response.data.title);
        setEditedDescription(response.data.description || "");
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
      const scenes = JSON.parse(scriptStr) as Scene[];
      return scenes;
    } catch (err) {
      console.error('Error parsing script:', err);
      return [];
    }
  };

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

  const scenes = formatScript(video.script);

  return (
    <div className="container mx-auto py-8 px-4 border rounded-md my-4">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column - Video Player */}
        <RemotionVideoPlayer />

        {/* Right Column - Video Details */}
        <div className="space-y-6 col-span-3">
          {/* Title with edit option */}
          <div>
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <Input
                  value={editedTitle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedTitle(e.target.value)}
                  className="text-2xl font-bold"
                  disabled={isSaving}
                />
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={handleSaveTitle}
                  disabled={isSaving}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => {
                    setIsEditingTitle(false);
                    setEditedTitle(video.title);
                  }}
                  disabled={isSaving}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">{video.title}</h1>
                {video.isOwner && (
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => setIsEditingTitle(true)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}

            {/* Description with edit option */}
            {isEditingDescription ? (
              <div className="flex flex-col gap-2 mt-2">
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
              <div className="flex items-start gap-2 mt-2">
                <p className="text-gray-600 dark:text-gray-400">
                  {video.description || "No description"}
                </p>
                {video.isOwner && (
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => setIsEditingDescription(true)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>

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