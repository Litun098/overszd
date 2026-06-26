// Cloudflare R2 storage helper (S3-compatible).
// Server-only. Used to upload product images / assets and to mint short-lived
// presigned upload URLs for an admin UI later.
import 'server-only';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucket = process.env.R2_BUCKET;
const publicBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

export const isR2Configured = Boolean(
  accountId && accessKeyId && secretAccessKey && bucket
);

let client = null;
function r2() {
  if (!isR2Configured) {
    throw new Error('R2 is not configured. Set R2_* env vars.');
  }
  if (!client) {
    client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  return client;
}

// Public URL for a stored object key.
export function publicUrl(key) {
  return `${publicBase?.replace(/\/$/, '')}/${key}`;
}

// Upload bytes directly (e.g. from a server action). Returns the public URL.
export async function uploadObject(key, body, contentType) {
  await r2().send(
    new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType })
  );
  return publicUrl(key);
}

// Mint a presigned PUT URL so a browser/admin can upload directly to R2.
export async function presignUpload(key, contentType, expiresInSeconds = 300) {
  const url = await getSignedUrl(
    r2(),
    new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType }),
    { expiresIn: expiresInSeconds }
  );
  return { uploadUrl: url, publicUrl: publicUrl(key) };
}

export async function deleteObject(key) {
  await r2().send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}
