import { S3Client } from "@aws-sdk/client-s3";

if (!process.env.CLOUDFLARE_R2_ACCESS_KEY_ID && process.env.NODE_ENV === "production") {
  console.warn("Missing CLOUDFLARE_R2_ACCESS_KEY_ID");
}

if (!process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY && process.env.NODE_ENV === "production") {
  console.warn("Missing CLOUDFLARE_R2_SECRET_ACCESS_KEY");
}

if (!process.env.CLOUDFLARE_R2_ENDPOINT && process.env.NODE_ENV === "production") {
  console.warn("Missing CLOUDFLARE_R2_ENDPOINT");
}

export const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT || "https://dummy.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || "dummy_access_key",
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || "dummy_secret_key",
  },
});

export const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || "dummy-bucket";
export const PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL || "https://dummy.r2.dev";
