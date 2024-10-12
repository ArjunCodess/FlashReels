"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SelectStyle({
  onUserSelect,
}: {
  onUserSelect: (fieldName: string, fieldValue: string) => void;
}) {
  const [selectedOption, setSelectedOption] = useState("");

  const options = ["Realistic", "Cartoon", "Comic", "Water Colour", "GTA"];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Style</h2>
      <p className="text-sm text-neutral-500 mb-2">
        Select the style of your video
      </p>
      <Select
        value={selectedOption}
        onValueChange={(value) => {
          setSelectedOption(value);
          onUserSelect("imageStyle", value);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Style" />
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
  );
}
