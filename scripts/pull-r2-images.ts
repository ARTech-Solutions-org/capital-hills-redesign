import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Readable } from 'stream';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const accessKeyId = process.env.CLOUDFLARE_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_SECRET_ACCESS_KEY;
const bucketName = process.env.CLOUDFLARE_BUCKET_NAME || 'capital';

if (!accountId || !accessKeyId || !secretAccessKey) {
  console.error('Missing Cloudflare R2 credentials in .env');
  process.exit(1);
}

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: any[] = [];
  for await (const chunk of stream) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

async function main() {
  console.log(`Connecting to Cloudflare R2 bucket "${bucketName}"...`);
  const targetDir = path.resolve(__dirname, '../uploads');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const listCommand = new ListObjectsV2Command({
    Bucket: bucketName,
  });

  const response = await s3.send(listCommand);
  const objects = response.Contents || [];

  console.log(`Found ${objects.length} files in bucket "${bucketName}":`);
  for (const obj of objects) {
    console.log(` - ${obj.Key} (${obj.Size} bytes)`);
  }

  if (objects.length === 0) {
    console.log('No files to download.');
    return;
  }

  for (const obj of objects) {
    if (!obj.Key) continue;
    console.log(`Downloading: ${obj.Key}...`);
    const getCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: obj.Key,
    });

    const getRes = await s3.send(getCommand);
    if (getRes.Body) {
      const buffer = await streamToBuffer(getRes.Body as Readable);
      const filePath = path.join(targetDir, path.basename(obj.Key));
      fs.writeFileSync(filePath, buffer);
      console.log(`Saved to ${filePath}`);
    }
  }

  console.log('All R2 images have been successfully pulled to local uploads/ directory!');
}

main().catch((err) => {
  console.error('Error syncing from R2:', err);
  process.exit(1);
});
