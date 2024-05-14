import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate();

export const runtime = "edge";

export async function POST(request: NextRequest) {
  const { imageUrl } = await request.json();

  if (!imageUrl) {
    return NextResponse.json(
      { error: "Image URL is required" },
      { status: 400 }
    );
  }

  try {
    const input = {
      image: imageUrl,
      prompt: "Describe what you see in the image in detail.",
    };

    const output = await replicate.run(
      "yorickvp/llava-13b:b5f6212d032508382d61ff00469ddda3e32fd8a0e75dc39d8a4191bb742157fb",
      { input }
    );

    if (Array.isArray(output)) {
      const description = output.join("");
      return NextResponse.json({ description }, { status: 200 });
    } else {
      return NextResponse.json(
        {
          error: "Unexpected model output",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error describing image:", error);
    return NextResponse.json(
      { error: "Error describing image" },
      { status: 500 }
    );
  }
}
