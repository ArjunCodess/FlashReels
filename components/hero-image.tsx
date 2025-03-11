"use client";

import { useState } from "react";
import { Lens } from "@/components/ui/lens";
import Image from "next/image";

export default function HeroImage() {
  const [hovering, setHovering] = useState(false);

  return (
    <>
      <div className="hidden dark:block relative">
        <Lens hovering={hovering} setHovering={setHovering}>
          <Image
            className="aspect-[16/9] w-full relative rounded-lg sm:rounded-xl"
            src="/dark.png"
            alt="Application dashboard"
            width={2700}
            height={1440}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
            priority
          />
        </Lens>
      </div>

      <div className="dark:hidden relative">
        <Lens hovering={hovering} setHovering={setHovering}>
          <Image
            className="aspect-[16/9] w-full relative rounded-lg sm:rounded-xl border border-border/20"
            src="/light.png"
            alt="Application dashboard"
            width={2700}
            height={1440}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
            priority
          />
        </Lens>
      </div>
    </>
  );
}
