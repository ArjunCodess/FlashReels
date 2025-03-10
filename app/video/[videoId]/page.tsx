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
import { ChevronDown, ChevronUp, Pencil, Loader2 } from "lucide-react";
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Workflow state
  const [isWorkflowInProgress, setIsWorkflowInProgress] = useState(false);
  const [workflowStatus, setWorkflowStatus] = useState<string | null>(null);
  const [renderProgress, setRenderProgress] = useState<number>(0);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
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

  // Check workflow status
  useEffect(() => {
    if (
      !video ||
      !video.isOwner ||
      video.status !== "completed" ||
      video.downloadUrl
    ) {
      return;
    }

    const checkWorkflowStatus = async () => {
      try {
        const response = await axios.get(
          `/api/videos/${videoId}/workflow-status`
        );

        if (
          response.data.status === "in_progress" ||
          response.data.status === "queued"
        ) {
          setIsWorkflowInProgress(true);
          setWorkflowStatus(response.data.status);
          // Set the render progress percentage from the API response
          setRenderProgress(response.data.progressPercentage || 0);

          // Check again after 10 seconds (more frequent updates for better UX)
          setTimeout(checkWorkflowStatus, 10000);
        } else if (response.data.downloadUrl) {
          setIsWorkflowInProgress(false);
          setWorkflowStatus("completed");
          setRenderProgress(100);

          // Update video with download URL
          setVideo((prev) =>
            prev ? { ...prev, downloadUrl: response.data.downloadUrl } : null
          );
        } else {
          setIsWorkflowInProgress(false);
          setWorkflowStatus(response.data.status || null);
          // If the workflow is completed but failed, set progress to 0
          setRenderProgress(response.data.progressPercentage || 0);
        }
      } catch (error) {
        console.error("Error checking workflow status:", error);
        setIsWorkflowInProgress(false);
      }
    };

    // Check workflow status when component mounts
    checkWorkflowStatus();
  }, [videoId, video]);

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
      console.error("Error parsing script:", err);
      return [];
    }
  };

  const scenes = video?.script ? formatScript(video.script) : [];
  console.log("Scenes:", scenes);

  const handleSave = async () => {
    if (!video || !video.isOwner) return;

    setIsSaving(true);
    try {
      await axios.patch(`/api/videos/${videoId}`, {
        title: editedTitle,
        description: editedDescription,
      });

      setVideo((prev) =>
        prev
          ? {
              ...prev,
              title: editedTitle,
              description: editedDescription,
            }
          : null
      );

      setIsEditing(false);
      toast({
        title: "Success",
        description: "Video details updated successfully",
      });
    } catch (err) {
      console.error("Error updating video details:", err);
      toast({
        title: "Error",
        description: "Failed to update video details",
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
        downloadUrl,
      });
      setIsWorkflowInProgress(false);
      setWorkflowStatus("completed");
    }
  };

  // Start a workflow
  const handleStartWorkflow = () => {
    setIsWorkflowInProgress(true);
    setWorkflowStatus("starting");
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
        <div className="col-span-3">
          {/* Title and Description with single edit option */}
          {isEditing ? (
            <div className="mt-2">
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium mb-1"
                >
                  Title
                </label>
                <Input
                  id="title"
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="text-xl w-full"
                  disabled={isSaving}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium mb-1"
                >
                  Description
                </label>
                <Textarea
                  id="description"
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="min-h-[100px] w-full"
                  placeholder="Add a description..."
                  disabled={isSaving}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedTitle(video.title);
                    setEditedDescription(video.description || "");
                  }}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-2">
              <div className="flex items-center mt-2">
                <h1 className="text-3xl font-bold flex-grow">{video.title}</h1>
                {video.isOwner && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setEditedTitle(video.title);
                      setEditedDescription(video.description || "");
                      setIsEditing(true);
                    }}
                    className="ml-2"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">
                  {video.description || "No description"}
                </p>
              </div>
            </div>
          )}

          <hr className="my-6" />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Caption Style
              </h3>
              <p className="mt-1 capitalize">{video.captionStyle}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Voice
              </h3>
              <p className="mt-1">{video.voice}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Status
              </h3>
              <p className="mt-1 capitalize">{video.status}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Created At
              </h3>
              <p className="mt-1">
                {format(new Date(video.createdAt), "PPPP 'at' p")}
              </p>
            </div>
            <div className="col-span-2">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Created By
              </h3>
              <p className="mt-1">{video.creator?.name || "Unknown"}</p>
            </div>
          </div>

          <hr className="my-6" />

          <p className="text-sm text-muted-foreground mb-2">
            <strong>Note:</strong> It may take three or more minutes to download
            and render the video. Please be patient.
          </p>

          {/* Action Buttons - placed just above Technical Details */}
          <div className="grid grid-cols-2 mt-4">
            {video.isOwner &&
              video.status === "completed" &&
              !video.downloadUrl && (
                <div className="col-span-2">
                  {!isWorkflowInProgress && (
                    <RenderButton
                      videoId={video.id}
                      onVideoReady={handleVideoReady}
                      onClick={handleStartWorkflow}
                      className="w-full"
                    />
                  )}
                </div>
              )}
            {isWorkflowInProgress && (
              <div className="col-span-2">
                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 dark:bg-gray-700">
                  <div
                    className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: `${renderProgress}%` }}
                  ></div>
                </div>
                {/* Progress percentage and status */}
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>Progress: {renderProgress}%</span>
                  <span>
                    {workflowStatus === "queued" ? "In Queue" : "Rendering"}
                  </span>
                </div>
                <Button
                  disabled
                  size="sm"
                  className="w-full flex items-center gap-2"
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {workflowStatus === "queued"
                    ? "In Queue..."
                    : "Rendering in Progress..."}
                </Button>
              </div>
            )}
            {video.downloadUrl && (
              <DownloadButton
                videoId={video.id}
                downloadUrl={video.downloadUrl}
                className="w-full col-span-2"
              />
            )}
            {/* Fill empty space with placeholders if buttons aren't shown */}
            {!(video.isOwner && video.status === "completed") &&
              !isWorkflowInProgress &&
              !video.downloadUrl && <div></div>}
            {!video.downloadUrl && !isWorkflowInProgress && <div></div>}
          </div>

          <hr className="my-6" />

          {/* Technical Details Collapsible */}
          <Collapsible
            open={showTechnicalDetails}
            onOpenChange={setShowTechnicalDetails}
            className="space-y-6"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="w-full flex justify-between items-center"
              >
                <span>Technical Details</span>
                {showTechnicalDetails ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              {/* Script */}
              <Collapsible
                open={expandedSections.script}
                onOpenChange={() => toggleSection("script")}
                className="border rounded-md"
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full flex justify-between items-center"
                  >
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Script
                    </span>
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
                          <h4 className="font-medium mb-2">
                            Scene {index + 1}
                          </h4>
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-medium">Content:</span>{" "}
                              {scene.contentText}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-medium">Image Prompt:</span>{" "}
                              {scene.imagePrompt}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </CollapsibleContent>
              </Collapsible>

              <hr className="my-6" />

              {/* Audio */}
              <Collapsible
                open={expandedSections.audio}
                onOpenChange={() => toggleSection("audio")}
                className="border rounded-md"
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full flex justify-between items-center"
                  >
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Audio
                    </span>
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

              <hr className="my-6" />

              {/* Images */}
              <Collapsible
                open={expandedSections.images}
                onOpenChange={() => toggleSection("images")}
                className="border rounded-md"
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full flex justify-between items-center"
                  >
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Images
                    </span>
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
                      <Card
                        key={index}
                        className="relative aspect-[9/16] overflow-hidden"
                      >
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
