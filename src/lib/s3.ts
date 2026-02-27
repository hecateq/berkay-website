import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.S3_REGION || "us-east-1",
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "",
    secretAccessKey: process.env.S3_SECRET_KEY || "",
  },
  forcePathStyle: true, // required for MinIO
});

const BUCKET_NAME = process.env.S3_BUCKET || "berkay-media";

export async function uploadFileToS3(file: File, filename: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: buffer,
    ContentType: file.type,
    // ACL: "public-read", // Assuming bucket is public
  });

  await s3Client.send(command);

  // Return the public URL
  const endpoint = process.env.S3_ENDPOINT || "";
  // If endpoint ends with /, remove it
  const cleanEndpoint = endpoint.endsWith("/") ? endpoint.slice(0, -1) : endpoint;
  
  return `${cleanEndpoint}/${BUCKET_NAME}/${filename}`;
}

export async function deleteFileFromS3(filename: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: filename,
  });

  await s3Client.send(command);
}
