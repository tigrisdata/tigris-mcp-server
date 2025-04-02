import {
  DeleteObjectCommand,
  GetObjectCommand,
  paginateListObjectsV2,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { readFile } from 'node:fs/promises';
import { createS3Client } from '../utils/create-s3-client.js';
import { ToolHandlers } from '../utils/types.js';

const TIGRIS_LIST_OBJECTS_TOOL: Tool = {
  name: 'tigris_list_objects',
  description: 'List all objects in a buckets',
  inputSchema: {
    type: 'object',
    properties: {
      bucketName: {
        type: 'string',
        description: 'Name of the bucket',
      },
    },
    required: ['bucketName'],
  },
};

const TIGRIS_PUT_OBJECT_TOOL: Tool = {
  name: 'tigris_put_object',
  description: 'Creates an object in bucket',
  inputSchema: {
    type: 'object',
    properties: {
      bucketName: {
        type: 'string',
        description: 'Name of the bucket',
      },
      key: {
        type: 'string',
        description: 'Key of the object to put',
      },
      content: {
        type: 'string',
        description: 'Content to store in the object',
      },
      contentType: {
        type: 'string',
        description: 'Optional MIME type of the content',
      },
    },
    required: ['bucketName', 'key', 'content'],
  },
};

const TIGRIS_PUT_OBJECT_FROM_PATH_TOOL: Tool = {
  name: 'tigris_put_object_from_path',
  description: 'Creates an object in bucket from a path on the filesystem',
  inputSchema: {
    type: 'object',
    properties: {
      bucketName: {
        type: 'string',
        description: 'Name of the bucket',
      },
      key: {
        type: 'string',
        description: 'Key of the object to put',
      },
      path: {
        type: 'string',
        description: 'Absolute path to the file to upload',
      },
    },
    required: ['bucketName', 'key', 'path'],
  },
};

const TIGRIS_GET_OBJECT_TOOL: Tool = {
  name: 'tigris_get_object',
  description: 'Get an object in a bucket',
  inputSchema: {
    type: 'object',
    properties: {
      bucketName: {
        type: 'string',
        description: 'Name of the bucket',
      },
      key: {
        type: 'string',
        description: 'Key of the object to delete',
      },
    },
    required: ['bucketName', 'key'],
  },
};

const TIGRIS_DELETE_OBJECT_TOOL: Tool = {
  name: 'tigris_delete_object',
  description: 'Delete an object in a bucket',
  inputSchema: {
    type: 'object',
    properties: {
      bucketName: {
        type: 'string',
        description: 'Name of the bucket',
      },
      key: {
        type: 'string',
        description: 'Key of the object to put',
      },
    },
    required: ['bucketName', 'key'],
  },
};

export const TIGRIS_OBJECT_TOOLS: Array<Tool> = [
  TIGRIS_LIST_OBJECTS_TOOL,
  TIGRIS_PUT_OBJECT_TOOL,
  TIGRIS_PUT_OBJECT_FROM_PATH_TOOL,
  TIGRIS_GET_OBJECT_TOOL,
  TIGRIS_DELETE_OBJECT_TOOL,
];

export const OBJECT_TOOLS_HANDLER: ToolHandlers = {
  [TIGRIS_LIST_OBJECTS_TOOL.name]: async (request) => {
    const { bucketName } = request.params.arguments as { bucketName: string };

    const objects = await listObjects(bucketName);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(objects),
        },
      ],
    };
  },
  [TIGRIS_PUT_OBJECT_TOOL.name]: async (request) => {
    const { bucketName, key, content, contentType } = request.params
      .arguments as {
      bucketName: string;
      key: string;
      content: string;
      contentType: string;
    };

    const objects = await putObject(bucketName, key, content, contentType);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(objects),
        },
      ],
    };
  },
  [TIGRIS_PUT_OBJECT_FROM_PATH_TOOL.name]: async (request) => {
    const { bucketName, key, path } = request.params.arguments as {
      bucketName: string;
      key: string;
      path: string;
    };

    const objects = await putObjectFromFS(bucketName, key, path);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(objects),
        },
      ],
    };
  },
  [TIGRIS_GET_OBJECT_TOOL.name]: async (request) => {
    const { bucketName, key } = request.params.arguments as {
      bucketName: string;
      key: string;
    };

    const object = await getObject(bucketName, key);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(object),
        },
      ],
    };
  },
  [TIGRIS_DELETE_OBJECT_TOOL.name]: async (request) => {
    const { bucketName, key } = request.params.arguments as {
      bucketName: string;
      key: string;
    };

    const object = await deleteObject(bucketName, key);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(object),
        },
      ],
    };
  },
};

const listObjects = async (bucketName: string) => {
  const S3 = createS3Client();

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

const putObject = async (
  bucketName: string,
  key: string,
  content: string,
  contentType: string,
) => {
  const S3 = createS3Client();

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: content,
    ContentType: contentType,
  });

  const response = await S3.send(command);
  return response;
};

const putObjectFromFS = async (
  bucketName: string,
  key: string,
  filePath: string,
) => {
  const S3 = createS3Client();

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: await readFile(filePath),
  });

  const response = await S3.send(command);
  return response;
};

const getObject = async (bucketName: string, fileName: string) => {
  const S3 = createS3Client();

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: fileName,
  });

  const response = await S3.send(command);
  const arrayBuffer = await response.Body?.transformToByteArray();
  const buffer = Buffer.from(arrayBuffer!);
  return buffer;
};

const deleteObject = async (bucketName: string, fileName: string) => {
  const S3 = createS3Client();

  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: fileName,
  });

  const response = await S3.send(command);
  return response;
};
