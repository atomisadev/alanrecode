"use client";

import { Button } from "@/components/ui/button";
import File from "@/models/File";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const { isLoaded, user } = useUser();
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState("");
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status) {
      timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else {
      setSeconds(0);
    }

    return () => {
      clearInterval(timer);
    };
  }, [status]);

  const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (!file) {
      alert("Please select a file.");
      return;
    }

    setFileName(file.name);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("clerkId", user?.id!);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const publicUrl = data.publicUrl;

        setStatus("Generating description...");

        // Describe the uploaded image
        const describeResponse = await fetch("/api/describeImage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageUrl: publicUrl }),
        });

        if (describeResponse.ok) {
          const describeData = await describeResponse.json();
          const description = describeData.description;

          setStatus("Generating music...");

          const generateResponse = await fetch("/api/generateAudio", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ description }),
          });

          if (generateResponse.ok) {
            const generateData = await generateResponse.json();
            let audioUrl = generateData.output;

            audioUrl = audioUrl.replace(/\\/g, "").replace(/^"(.*)"$/, "$1");

            setStatus("");
            window.open(audioUrl, "_blank", "noopener,noreferrer");
          } else {
            setStatus("Audio generation failed");
          }
        } else {
          setStatus("Image generation failed");
        }
      } else {
        setStatus("File upload failed.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setStatus("File upload failed.");
    }
  };

  return (
    <>
      <div className="mx-[1rem] md:mx-[5rem] lg:mx-[10rem]">
        <h1 className="text-4xl font-semibold tracking-tighter mt-[3rem]">
          Welcome, {user?.fullName ?? "loading..."}
        </h1>
        <div className="flex justify-center items-center flex-col space-y-3 h-[60vh]">
          <h1 className="text-3xl font-semibold">Generate Audio</h1>
          <form onSubmit={handleFileUpload}>
            <div className="mb-4">
              <input
                type="file"
                id="file"
                name="file"
                accept="image/*"
                className="border border-white/2 rounded-md p-3"
              />
            </div>
            <Button type="submit" className="w-full">
              Generate Audio
            </Button>
          </form>
          {status && (
            <div className="flex justify-center flex-col items-center max-w-[24rem]">
              <p className="text-lg">
                {status} ({seconds}s)
              </p>
              {seconds > 6 && (
                <p className="text-sm text-center text-white/20 mt-2">
                  If models aren't in use for a while, they cool down, it may
                  take up to a minute for a model to warm back up.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
