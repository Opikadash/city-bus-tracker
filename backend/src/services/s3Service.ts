import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const s3Client = new S3Client({
  region: 'us-east-1', // Change as needed
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.S3_BUCKET || 'city-bus-locations';

export async function uploadBusData(busData: any): Promise<string> {
  const key = `bus-data/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.json`;
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: JSON.stringify(busData, null, 2),
    ContentType: 'application/json',
  });

  try {
    await s3Client.send(command);
    console.log(`✅ Uploaded to S3: s3://${BUCKET_NAME}/${key}`);
    return key;
  } catch (error) {
    console.error('❌ S3 upload failed:', error);
    throw error;
  }
}

