import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createS3Client } from '../utils/create-s3-client.js';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  paginateListObjectsV2,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { z } from 'zod';
import { readFile } from 'node:fs/promises';

const listObjects = async (S3: S3Client, bucketName: string) => {
  const paginator = paginateListObjectsV2(
    { client: S3, pageSize: 100 },
    { Bucket: bucketName },
  );
  const objects = [];

  for await (const page of paginator) {
    if (page.Contents) {
      objects.push(page.Contents.map((o) => o.Key)); // only get object keys
    }
  }
  return objects;
};

const uploadObjectFromFS = async (
  S3: S3Client,
  bucketName: string,
  fileName: string,
  filePath: string,
) => {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    Body: await readFile(filePath),
  });

  const response = await S3.send(command);
  return response;
};

const getObject = async (
  S3: S3Client,
  bucketName: string,
  fileName: string,
) => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: fileName,
  });

  const response = await S3.send(command);
  const arrayBuffer = await response.Body?.transformToByteArray();
  const buffer = Buffer.from(arrayBuffer!);
  return buffer;
};

const deleteObject = async (
  S3: S3Client,
  bucketName: string,
  fileName: string,
) => {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: fileName,
  });

  const response = await S3.send(command);
  return response;
};

export function registerObjectTools(server: McpServer) {
  server.tool(
    'list-objects',
    { bucketName: z.string() },
    async ({ bucketName }) => {
      const S3 = createS3Client();

      const objects = await listObjects(S3, bucketName);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(objects),
          },
        ],
      };
    },
  );

  server.tool(
    'create-object',
    { bucketName: z.string(), fileName: z.string(), filePath: z.string() },
    async ({ bucketName, fileName, filePath }) => {
      const S3 = createS3Client();

      const response = await uploadObjectFromFS(
        S3,
        bucketName,
        fileName,
        filePath,
      );

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response),
          },
        ],
      };
    },
  );

  server.tool(
    'replace-object',
    { bucketName: z.string(), fileName: z.string(), filePath: z.string() },
    async ({ bucketName, fileName, filePath }) => {
      const S3 = createS3Client();

      const response = await uploadObjectFromFS(
        S3,
        bucketName,
        fileName,
        filePath,
      );

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response),
          },
        ],
      };
    },
  );

  server.tool(
    'get-object',
    { bucketName: z.string(), fileName: z.string() },
    async ({ bucketName, fileName }) => {
      const S3 = createS3Client();

      const response = await getObject(S3, bucketName, fileName);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response),
          },
        ],
      };
    },
  );

  server.tool(
    'delete-object',
    { bucketName: z.string(), fileName: z.string() },
    async ({ bucketName, fileName }) => {
      const S3 = createS3Client();

      const response = await deleteObject(S3, bucketName, fileName);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response),
          },
        ],
      };
    },
  );
}
