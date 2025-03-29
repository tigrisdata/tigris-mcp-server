import { S3Client } from '@aws-sdk/client-s3';

export function createS3Client() {
  const {
    AWS_ACCESS_KEY_ID = '',
    AWS_SECRET_ACCESS_KEY = '',
    TIGRIS_GLOBAL_ENDPOINT = '',
  } = process.env;

  return new S3Client({
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
    region: 'auto',
    endpoint: TIGRIS_GLOBAL_ENDPOINT,
  });
}
