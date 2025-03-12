import React from "react";
import Link from "next/link";
import { ArrowRight, Cpu, Settings2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextEffect } from "@/components/ui/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { cn } from "@/lib/utils";
import { Spotlight } from "@/components/ui/spotlight";
import HeroImage from "@/components/hero-image";

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
      <Spotlight className="overflow-x-hidden" />
      <section className="py-4 sm:py-8 md:py-12">
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
              Transform your ideas into professional videos without technical
              skills. Our AI-powered platform makes it easy to create, edit, and
              share scroll-stopping content that drives engagement.
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
              className="mt-6 sm:mt-10 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4"
            >
              <Button
                asChild
                size="lg"
                className="rounded-xl sm:text-base w-full sm:w-auto"
              >
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
          <div className="mt-2 overflow-hidden px-2 sm:px-4 md:px-6 lg:px-8">
            <div
              className={cn(
                "relative mx-auto max-w-6xl overflow-hidden rounded-xl sm:rounded-2xl border-2 p-1 sm:p-2 md:p-4",
                "bg-background shadow-lg ring-1 ring-foreground/5",
                "dark:bg-background/30 dark:backdrop-blur-sm dark:ring-white/10"
              )}
            >
              <HeroImage />
            </div>
          </div>
        </AnimatedGroup>
      </section>

      <hr className="mb-12 sm:mb-16 md:mb-20 mt-4 sm:mt-8 md:mt-12" />

      <section className="mb-8 sm:mb-12 md:mb-16 lg:mb-20">
        <div className="mx-auto max-w-5xl space-y-6 sm:space-y-8 px-4 sm:px-6 md:space-y-12 lg:space-y-16">
          <div className="relative z-10 mx-auto max-w-xl space-y-4 sm:space-y-6 text-center">
            <h2 className="text-balance text-3xl sm:text-4xl font-medium lg:text-5xl">
              Everything you need to create viral reels
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground px-4 sm:px-0">
              Our platform combines powerful features to help you create, edit,
              and share engaging video content that stands out on social media.
            </p>
          </div>

          <div className="relative mx-auto grid max-w-4xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 overflow-hidden border rounded-2xl">
            <div className="space-y-3 p-6 sm:p-8 lg:p-12 border">
              <div className="flex items-center gap-2">
                <Zap className="size-4" />
                <h3 className="text-sm font-medium">Lightning Fast</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Create professional reels in minutes, not hours, with our
                streamlined editing tools.
              </p>
            </div>
            <div className="space-y-3 p-6 sm:p-8 lg:p-12 border">
              <div className="flex items-center gap-2">
                <Cpu className="size-4" />
                <h3 className="text-sm font-medium">AI-Powered</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Smart automation and AI assistance to enhance your creative
                workflow.
              </p>
            </div>
            <div className="space-y-3 p-6 sm:p-8 lg:p-12 border">
              <div className="flex items-center gap-2">
                <Settings2 className="size-4" />
                <h3 className="text-sm font-medium">Full Control</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Fine-tune every aspect of your content with precise controls and
                customizable settings.
              </p>
            </div>
          </div>
        </div>
      </section>

      <hr className="mb-8 sm:mb-12 md:mb-16 lg:mb-20" />

      <section className="px-4 sm:px-6">
        <div className="mx-auto max-w-5xl rounded-2xl sm:rounded-3xl border py-8 sm:py-12 md:py-16 lg:py-24">
          <div className="text-center px-4 sm:px-6">
            <h2 className="text-balance text-3xl sm:text-4xl font-semibold lg:text-5xl">
              Ready to Create Amazing Reels?
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground">
              Join creators who are already making viral content with Flash
              Reels
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-xl sm:text-base w-full sm:w-auto"
              >
                <Link href="/create-new">
                  <span className="flex items-center">
                    Create Your First AI Reel
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-xl sm:text-base w-full sm:w-auto"
              >
                <Link href="/community">
                  <span>Watch Examples</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <hr className="my-8 sm:my-12 md:my-16 lg:my-20" />
    </main>
  );
}
