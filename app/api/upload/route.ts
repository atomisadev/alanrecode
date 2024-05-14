import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { connect } from "mongoose";
import File from "@/models/File";
import { Storage } from "@google-cloud/storage";

const keyFilePath = path.join(process.cwd(), "/keyfile.json");
const storage = new Storage({ keyFilename: keyFilePath });
const bucketName = "carbonbucket";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const clerkId = formData.get("clerkId") as string | null;

  if (!file || !clerkId) {
    return NextResponse.json(
      {
        error: "No file uploaded or no clerk ID provided",
      },
      { status: 400 }
    );
  }
  try {
    const fileExtension = file.name.split(".").pop();
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;

    const bucket = storage.bucket(bucketName);
    const blob = bucket.file(uniqueFileName);

    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: {
        contentType: file.type,
      },
    });

    const buffer = await file.arrayBuffer();
    blobStream.end(Buffer.from(buffer));

    const publicUrl = `https://storage.googleapis.com/${bucketName}/${uniqueFileName}`;

    await connect(process.env.MONGODB_URI as string);

    const newFile = new File({
      url: publicUrl,
      clerkId,
    });
    await newFile.save();

    return NextResponse.json({ publicUrl }, { status: 200 });
  } catch (error) {
    console.error("Error writing file:", error);
    return NextResponse.json(
      {
        error: "Error writing file",
      },
      {
        status: 500,
      }
    );
  }
}
