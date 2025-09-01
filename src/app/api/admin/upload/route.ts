import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import mime from 'mime-types';
import { extname } from 'path';

// Reusable S3 Client Configuration
function getS3Client() {
  return new S3Client({
    endpoint: process.env.DO_ENDPOINT,
    region: process.env.DO_DEFAULT_REGION || 'sgp1',
    credentials: {
      accessKeyId: process.env.DO_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.DO_SECRET_ACCESS_KEY || ''
    },
    forcePathStyle: process.env.DO_USE_PATH_STYLE_ENDPOINT === 'true'
  });
}

export async function POST(req: NextRequest) {
  try {
    // Use the FormData API to handle file uploads
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const filePrefix = formData.get('filePrefix') as string;
    const folder = formData.get('folder') as string;

    // Validate file exists
    if (!file) {
      return NextResponse.json({
        error: 'No file provided',
        details: 'File is required'
      }, { status: 400 });
    }

    // Generate file path with proper extension
    const fileExtension = extname(file.name).substring(1) ||
      mime.extension(file.type) ||
      'bin';
    const filePath = `${process.env.DO_DIRECTORY}${folder}${filePrefix}.${fileExtension}`;

    // Get the file buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Get S3 Client
    const s3Client = getS3Client();

    // Determine the correct MIME type
    const contentType = file.type || mime.lookup(fileExtension) || 'application/octet-stream';

    // Prepare upload command
    const command = new PutObjectCommand({
      Bucket: process.env.DO_BUCKET,
      Key: filePath,
      Body: fileBuffer,
      ContentType: contentType,
      ACL: 'public-read',
      Metadata: {
        originalFileName: file.name || ''
      }
    });

    // Upload to DigitalOcean Spaces
    await s3Client.send(command);

    // Construct public URL
    const publicUrl = `${process.env.DO_URL}/${filePath}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filePath: filePath
    });
  } catch (error) {
    console.error('Upload error:', error);

    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);

      // Check for specific AWS SDK errors
      if (error.name === 'CredentialsProviderError') {
        return NextResponse.json({
          error: 'Authentication failed',
          details: 'Invalid or missing credentials'
        }, { status: 401 });
      }
    }

    return NextResponse.json({
      error: 'File upload failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}


export const config = {
  api: {
    bodyParser: false,
  },
};