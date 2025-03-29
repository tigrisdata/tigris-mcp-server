import {
  CreateBucketCommand,
  DeleteBucketCommand,
  paginateListBuckets,
  S3Client,
} from '@aws-sdk/client-s3';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createS3Client } from '../utils/create-s3-client.js';
import { z } from 'zod';

const listBuckets = async (S3: S3Client) => {
  const buckets = [];
  for await (const page of paginateListBuckets({ client: S3 }, {})) {
    if (page.Buckets) {
      buckets.push(...page.Buckets);
    }
  }
  return buckets;
};

const createBucket = async (S3: S3Client, bucketName: string) => {
  return S3.send(new CreateBucketCommand({ Bucket: bucketName }));
};

export function registerBucketTools(server: McpServer) {
  server.tool('list-buckets', async () => {
    const S3 = createS3Client();

    const buckets = await listBuckets(S3);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(buckets),
        },
      ],
    };
  });

  server.tool(
    'create-buckets',
    { bucketName: z.string() },
    async ({ bucketName }) => {
      const S3 = createS3Client();

      const buckets = await createBucket(S3, bucketName);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(buckets),
          },
        ],
      };
    },
  );

  server.tool(
    'delete-bucket',
    { bucketName: z.string() },
    async ({ bucketName }) => {
      const S3 = createS3Client();

      const deleteBucketCommand = new DeleteBucketCommand({
        Bucket: bucketName,
      });
      const response = await S3.send(deleteBucketCommand);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              response.$metadata.httpStatusCode === 204
                ? 'Bucket deleted'
                : 'Bucket not deleted',
            ),
          },
        ],
      };
    },
  );
}
