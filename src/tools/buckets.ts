import {
  CreateBucketCommand,
  DeleteBucketCommand,
  paginateListBuckets,
} from '@aws-sdk/client-s3';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { createS3Client } from '../utils/create-s3-client.js';
import { ToolHandlers } from '../utils/types.js';

const TIGRIS_LIST_BUCKETS_TOOL: Tool = {
  name: 'tigris_list_buckets',
  description: 'List all Tigris buckets in your account',
  inputSchema: {
    type: 'object',
    properties: {},
  },
};

const TIGRIS_CREATE_BUCKET_TOOL: Tool = {
  name: 'tigris_create_bucket',
  description: 'Create a Tigris bucket in your account',
  inputSchema: {
    type: 'object',
    properties: {
      bucketName: {
        type: 'string',
        description: 'Name of the bucket to create',
      },
      isPublic: {
        type: 'boolean',
        description: 'Set your bucket as public or private',
      },
    },
    required: ['bucketName'],
  },
};

const TIGRIS_DELETE_BUCKET_TOOL: Tool = {
  name: 'tigris_delete_bucket',
  description: 'Delete a Tigris bucket in your account',
  inputSchema: {
    type: 'object',
    properties: {
      bucketName: {
        type: 'string',
        description: 'Name of the bucket to delete',
      },
    },
    required: ['bucketName'],
  },
};

export const TIGRIS_BUCKET_TOOLS: Array<Tool> = [
  TIGRIS_LIST_BUCKETS_TOOL,
  TIGRIS_CREATE_BUCKET_TOOL,
  TIGRIS_DELETE_BUCKET_TOOL,
];

export const BUCKET_TOOLS_HANDLER: ToolHandlers = {
  [TIGRIS_LIST_BUCKETS_TOOL.name]: async () => {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(await listBuckets()),
        },
      ],
    };
  },
  [TIGRIS_CREATE_BUCKET_TOOL.name]: async (request) => {
    const { bucketName, isPublic } = request.params.arguments as {
      bucketName: string;
      isPublic: boolean;
    };

    await createBucket(bucketName, isPublic);
    return {
      content: [
        {
          type: 'text',
          text: `Successfully created bucket: ${bucketName}`,
        },
      ],
    };
  },
  [TIGRIS_DELETE_BUCKET_TOOL.name]: async (request) => {
    const { bucketName } = request.params.arguments as { bucketName: string };

    await deleteBucket(bucketName);
    return {
      content: [
        {
          type: 'text',
          text: `Successfully delete bucket: ${bucketName}`,
        },
      ],
    };
  },
};

const listBuckets = async () => {
  const S3 = createS3Client();
  const buckets = [];

  for await (const page of paginateListBuckets({ client: S3 }, {})) {
    if (page.Buckets) {
      buckets.push(...page.Buckets);
    }
  }
  return buckets;
};

const createBucket = async (bucketName: string, isPublic: boolean = false) => {
  const S3 = createS3Client();
  return S3.send(
    new CreateBucketCommand({
      Bucket: bucketName,
      ACL: isPublic ? 'public-read' : 'private',
    }),
  );
};

const deleteBucket = async (bucketName: string) => {
  const S3 = createS3Client();
  return S3.send(new DeleteBucketCommand({ Bucket: bucketName }));
};
