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
}: {
  onUserSelect: (fieldName: string, fieldValue: string) => void;
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
            value != options[0] && onUserSelect("topic", value);
          }}
        >
          <SelectTrigger>
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
      </div>

      <div>
        {selectedOption === options[0] && (
          <Textarea
            placeholder="Enter your custom prompt here"
            className="mt-2"
            onChange={(e) => onUserSelect("topic", e.target.value)}
          />
        )}
      </div>
    </div>
  );
}
