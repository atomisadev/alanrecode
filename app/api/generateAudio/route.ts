import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate();

export async function POST(request: NextRequest) {
  const { description } = await request.json();

  if (!description) {
    return NextResponse.json(
      {
        error: "Description is required",
      },
      { status: 400 }
    );
  }

  try {
    const input = {
      prompt: description,
      model_version: "stereo-large",
      output_format: "mp3",
      normalization_strategy: "peak",
    };

    const output = await replicate.run(
      "meta/musicgen:671ac645ce5e552cc63a54a2bbff63fcf798043055d2dac5fc9e36a837eedcfb",
      { input }
    );

    return NextResponse.json(
      { output: JSON.stringify(output) },
      { status: 200 }
    );
  } catch (error) {}
}
