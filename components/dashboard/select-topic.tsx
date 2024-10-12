"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function SelectTopic({
  onUserSelect,
  error,
}: {
  onUserSelect: (fieldName: string, fieldValue: string) => void;
  error: boolean;
}) {
  const [selectedOption, setSelectedOption] = useState("");

  const options = [
    "Custom Prompt",
    "Random AI Story",
    "Scary Story",
    "Historical Facts",
    "Bed Time Story",
    "Motivational",
    "Fun Facts",
  ];

  return (
    <div>
      <div>
        <h2 className="text-lg font-semibold mb-2">Content</h2>
        <p className="text-sm text-neutral-500 mb-2">
          What is the topic of your video?
        </p>
        <Select
          value={selectedOption}
          onValueChange={(value) => {
            setSelectedOption(value);
            if (value !== options[0]) {
              onUserSelect("topic", value);
            }
          }}
        >
          <SelectTrigger className={error ? "border-red-500" : ""}>
            <SelectValue placeholder="Select Topic" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option, index) => (
              <SelectItem key={index} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && (
          <p className="text-red-500 text-sm mt-1">Please select a topic</p>
        )}
      </div>

      <div>
        {selectedOption === options[0] && (
          <Textarea
            placeholder="Enter your custom prompt here"
            className={`mt-2 ${error ? "border-red-500" : ""}`}
            onChange={(e) => onUserSelect("topic", e.target.value)}
          />
        )}
      </div>
    </div>
  );
}
