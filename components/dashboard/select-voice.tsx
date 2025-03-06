"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SelectVoice({
  onUserSelect,
  error,
}: {
  onUserSelect: (fieldName: string, fieldValue: string) => void;
  error: boolean;
}) {
  const [selectedOption, setSelectedOption] = useState("");

  // 5 best Microsoft Edge TTS voices with user-friendly names
  const voices = [
    { name: "Aria (US Female)", value: "en-US-AriaNeural" },
    { name: "Guy (US Male)", value: "en-US-GuyNeural" },
    { name: "Jenny (US Female)", value: "en-US-JennyNeural" },
    { name: "Sonia (UK Female)", value: "en-GB-SoniaNeural" },
    { name: "Natasha (AU Female)", value: "en-AU-NatashaNeural" }
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Voice</h2>
      <p className="text-sm text-neutral-500 mb-2">
        Select the voice for your video
      </p>
      <Select
        value={selectedOption}
        onValueChange={(value) => {
          setSelectedOption(value);
          onUserSelect("voice", value);
        }}
      >
        <SelectTrigger className={error ? "border-red-500" : ""}>
          <SelectValue placeholder="Select Voice" />
        </SelectTrigger>
        <SelectContent>
          {voices.map((voice, index) => (
            <SelectItem key={index} value={voice.value}>
              {voice.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-red-500 text-sm mt-1">Please select a voice</p>
      )}
    </div>
  );
} 