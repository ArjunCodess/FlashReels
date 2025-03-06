"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SelectCaptionStyle({
  onUserSelect,
  error,
}: {
  onUserSelect: (fieldName: string, fieldValue: string) => void;
  error: boolean;
}) {
  const [selectedOption, setSelectedOption] = useState("");

  const captionStyles = [
    { name: "Classic", value: "classic" },
    { name: "Supreme", value: "supreme" },
    { name: "Neon", value: "neon" },
    { name: "Glitch", value: "glitch" },
    { name: "Fire", value: "fire" },
    { name: "Futuristic", value: "futuristic" }
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Caption Style</h2>
      <p className="text-sm text-neutral-500 mb-2">
        Choose how your captions will appear
      </p>
      <Select
        value={selectedOption}
        onValueChange={(value) => {
          setSelectedOption(value);
          onUserSelect("captionStyle", value);
        }}
      >
        <SelectTrigger className={error ? "border-red-500" : ""}>
          <SelectValue placeholder="Select Caption Style" />
        </SelectTrigger>
        <SelectContent>
          {captionStyles.map((style, index) => (
            <SelectItem key={index} value={style.value}>
              {style.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-red-500 text-sm mt-1">Please select a caption style</p>
      )}
    </div>
  );
} 