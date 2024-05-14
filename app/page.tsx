"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Spotlight } from "@/components/ui/spotlight";
import Logo from "@/components/logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";

export default function SpotlightPreview() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <>
      <div className="relative">
        <div className="absolute mx-[1rem] md:mx-[5rem] lg:mx-[10rem] top-0 left-0 right-0 z-20 p-4">
          <nav className="backdrop-blur-sm justify-between bg-black/20 border border-black/1 w-full h-4 px-10 py-7 rounded-full flex items-center">
            <Logo />
            <div className="flex gap-5 items-center">
              <Link href="#">Features</Link>
              <Link href="#">Team</Link>
              <Link href="/sign-up">
                <Button size={null} className="px-4 py-1">
                  Sign Up
                </Button>
              </Link>
            </div>
          </nav>
        </div>
        <div className="h-[40rem] w-full rounded-md flex md:items-center md:justify-center antialiased bg-grid-white/[0.02] relative overflow-hidden">
          <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20"
            fill="white"
          />
          <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0">
            <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
              The first way to <br /> listen to images.
            </h1>
            <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
              ALAN (Artistic Luminance Audio Network) is a tool that allows
              users to listen to music through the creation of two in-house
              models. One model to describe and comprehend image inputs, and
              another to take those image descriptions and synthesize audio.
            </p>
          </div>
        </div>
      </div>

      {/* <div className="h-[40rem] rounded-md flex flex-col antialiased dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
        <InfiniteMovingCards
          items={testimonials}
          direction="right"
          speed="slow"
        />
      </div> */}

      <div className="flex items-center gap-7 flex-col">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-5xl inline-block text-transparent bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text font-bold">
            Features
          </h1>
          <p className="text-2xl tracking-tight text-white/40">
            What does ALAN have to offer?
          </p>
        </div>
        <div className="grid grid-rows-4 md:mx-[5rem] lg:mx-[10rem] gap-4 md:grid-rows-none md:grid-cols-4">
          {features.map((feature, index) => {
            return (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}

const features = [
  {
    title: "Lightning Generations",
    description:
      "Lightning fast generation of audio from images without any problems.",
  },
  {
    title: "Privacy First",
    description:
      "We don't store any of your images or audio files. Everything is processed on the fly.",
  },
  {
    title: "Quality Audio",
    description:
      "We use the best models to generate the highest quality audio from your images.",
  },
  {
    title: "Easy to Use",
    description:
      "Our simple interface allows you to upload images and get audio in seconds.",
  },
];
