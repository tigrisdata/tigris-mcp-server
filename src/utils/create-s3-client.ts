import { S3Client } from '@aws-sdk/client-s3';
import { fromIni } from '@aws-sdk/credential-providers';

export function createS3Client() {
  const {
    USE_AWS_PROFILES = 'false',
    AWS_PROFILE = 'default',
    AWS_ACCESS_KEY_ID = '',
    AWS_SECRET_ACCESS_KEY = '',
    AWS_ENDPOINT_URL_S3,
  } = process.env;

  return new S3Client({
    credentials:
      USE_AWS_PROFILES === 'true'
        ? fromIni({ profile: AWS_PROFILE })
        : {
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY,
          },
    region: 'auto',
    endpoint: AWS_ENDPOINT_URL_S3,
  });
}
