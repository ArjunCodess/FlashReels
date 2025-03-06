"use client";

import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";

export default function SelectDuration({
  onUserSelect,
}: {
  onUserSelect: (fieldName: string, fieldValue: string) => void;
}) {
  const [duration, setDuration] = useState(30);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Duration</h2>
      <p className="text-sm text-neutral-500 mb-2">
        Select the duration of your video
      </p>
      <Slider
        min={1}
        max={60}
        step={1}
        value={[duration]}
        onValueChange={(value) => {
            setDuration(value[0]);
            onUserSelect('duration', `${value[0]}`)
        }}
        className="mb-2"
      />
      <p className="text-sm text-neutral-500">Duration: {duration} seconds</p>
    </div>
  );
}
