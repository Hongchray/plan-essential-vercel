import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import mime from "mime-types";
import { extname } from "path";

// Reusable S3 Client Configuration
function getS3Client() {
  return new S3Client({
    endpoint: process.env.DO_ENDPOINT,
    region: process.env.DO_DEFAULT_REGION || "sgp1",
    credentials: {
      accessKeyId: process.env.DO_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.DO_SECRET_ACCESS_KEY || "",
    },
    forcePathStyle: process.env.DO_USE_PATH_STYLE_ENDPOINT === "true",
  });
}

// File type validation
const ALLOWED_TYPES = {
  image: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ],
  video: ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"],
  audio: ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/mp4"],
};

const MAX_FILE_SIZE = {
  image: 10 * 1024 * 1024, // 10MB
  video: 100 * 1024 * 1024, // 100MB
  audio: 20 * 1024 * 1024, // 20MB
};

function getFileCategory(mimeType: string): "image" | "video" | "audio" | null {
  if (ALLOWED_TYPES.image.includes(mimeType)) return "image";
  if (ALLOWED_TYPES.video.includes(mimeType)) return "video";
  if (ALLOWED_TYPES.audio.includes(mimeType)) return "audio";
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "/uploads";

    // Validate file exists
    if (!file) {
      return NextResponse.json(
        {
          error: "No file provided",
          details: "File is required",
        },
        { status: 400 }
      );
    }

    // Validate file type
    const fileCategory = getFileCategory(file.type);
    if (!fileCategory) {
      return NextResponse.json(
        {
          error: "Invalid file type",
          details: `Supported types: images (JPEG, PNG, GIF, WebP), videos (MP4, WebM, MOV), audio (MP3, WAV, OGG)`,
          receivedType: file.type,
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE[fileCategory]) {
      return NextResponse.json(
        {
          error: "File too large",
          details: `Maximum size for ${fileCategory}: ${
            MAX_FILE_SIZE[fileCategory] / (1024 * 1024)
          }MB`,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(2)}MB`,
        },
        { status: 400 }
      );
    }

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileExtension = extname(file.name) || `.${mime.extension(file.type)}`;
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFileName = `${timestamp}-${randomString}-${sanitizedFileName}`;

    // Ensure folder path is properly formatted
    const normalizedFolder = folder.startsWith("/") ? folder : `/${folder}`;
    const folderPath = normalizedFolder.endsWith("/")
      ? normalizedFolder
      : `${normalizedFolder}/`;
    const filePath = `${
      process.env.DO_DIRECTORY || ""
    }${folderPath}${uniqueFileName}`;

    // Get the file buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Get S3 Client
    const s3Client = getS3Client();

    // Determine the correct MIME type
    const contentType =
      file.type || mime.lookup(fileExtension) || "application/octet-stream";

    // Prepare upload command with proper cache control for media files
    const command = new PutObjectCommand({
      Bucket: process.env.DO_BUCKET,
      Key: filePath,
      Body: fileBuffer,
      ContentType: contentType,
      ACL: "public-read",
      CacheControl:
        fileCategory === "image"
          ? "public, max-age=31536000"
          : "public, max-age=86400",
      Metadata: {
        originalFileName: file.name || "",
        uploadedAt: new Date().toISOString(),
        fileCategory: fileCategory,
      },
    });

    // Upload to DigitalOcean Spaces
    await s3Client.send(command);

    // Construct public URL
    const publicUrl = `${process.env.DO_URL}/${filePath}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: filePath,
      fileType: fileCategory,
      fileName: uniqueFileName,
      originalName: file.name,
      size: file.size,
      mimeType: contentType,
    });
  } catch (error) {
    console.error("Upload error:", error);

    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);

      if (error.name === "CredentialsProviderError") {
        return NextResponse.json(
          {
            error: "Authentication failed",
            details: "Invalid or missing credentials",
          },
          { status: 401 }
        );
      }

      if (error.name === "NoSuchBucket") {
        return NextResponse.json(
          {
            error: "Storage bucket not found",
            details: "The specified bucket does not exist",
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      {
        error: "File upload failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
