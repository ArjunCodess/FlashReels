import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { TextEffect } from "@/components/ui/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { cn } from "@/lib/utils";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

export default function Home() {
  return (
    <main>
      <section className="pt-4 sm:pt-8 md:pt-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mx-auto pb-6 sm:pb-8 md:pb-12 lg:pb-16">
            <TextEffect
              preset="fade-in-blur"
              speedSegment={0.5}
              as="h1"
              className="mt-4 sm:mt-6 text-balance font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5rem] tracking-tight"
            >
              Reels That Wow, Made in No Time!
            </TextEffect>

            <TextEffect
              per="line"
              preset="fade-in-blur"
              speedSegment={0.5}
              delay={0.5}
              as="p"
              className="mx-auto mt-4 sm:mt-6 md:mt-8 max-w-3xl text-balance text-sm sm:text-base md:text-lg text-foreground/80 leading-relaxed px-4 sm:px-0"
            >
              Transform your ideas into professional videos without technical skills. 
              Our AI-powered platform makes it easy to create, edit, and share
              scroll-stopping content that drives engagement.
            </TextEffect>

            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.08,
                      delayChildren: 0.75,
                    },
                  },
                },
                ...transitionVariants,
              }}
              className="mt-6 sm:mt-10 flex flex-row items-center justify-center gap-4 px-4"
            >
              <Button asChild size="lg" className="rounded-xl sm:text-base w-full sm:w-auto">
                <Link href="/sign-up">
                  Start Creating Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-xl sm:text-base w-full sm:w-auto"
              >
                <Link href="/community">See Examples</Link>
              </Button>
            </AnimatedGroup>
          </div>
        </div>

        <AnimatedGroup
          variants={{
            container: {
              visible: {
                transition: {
                  staggerChildren: 0.05,
                  delayChildren: 0.85,
                },
              },
            },
            ...transitionVariants,
          }}
        >
          <div className="mt-2 overflow-hidden px-2 sm:px-4 md:px-6 lg:px-8 pb-8 sm:pb-12 md:pb-16">
            <div
              className={cn(
                "relative mx-auto max-w-6xl overflow-hidden rounded-xl sm:rounded-2xl border-2 p-1 sm:p-2 md:p-4",
                "bg-background shadow-lg ring-1 ring-foreground/5",
                "dark:bg-background/30 dark:backdrop-blur-sm dark:ring-white/10"
              )}
            >
              <Image
                className="aspect-[16/9] w-full relative hidden rounded-lg sm:rounded-xl dark:block"
                src="/dark.png"
                alt="Application dashboard"
                width={2700}
                height={1440}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
                priority
              />

              <Image
                className="aspect-[16/9] w-full relative rounded-lg sm:rounded-xl border border-border/20 dark:hidden"
                src="/light.png"
                alt="Application dashboard"
                width={2700}
                height={1440}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
                priority
              />
            </div>
          </div>
        </AnimatedGroup>
      </section>
    </main>
  );
}