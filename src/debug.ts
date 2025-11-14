/* eslint-disable no-console */
import { BUCKET_TOOLS_HANDLER } from './tools/buckets.js';
import { OBJECT_TOOLS_HANDLER } from './tools/objects.js';
import { parseArgs } from './utils/parse-args.js';
import { ToolRequest } from './utils/types.js';

const AVAILABLE_TOOLS_HANDLERS = {
  ...BUCKET_TOOLS_HANDLER,
  ...OBJECT_TOOLS_HANDLER,
};

export async function debug(toolName: string, args: string) {
  const toolHandler = AVAILABLE_TOOLS_HANDLERS[toolName];
  const request: ToolRequest = {
    params: {
      name: toolName,
      arguments: parseArgs(args),
    },
    method: 'tools/call',
  };

  if (!toolHandler) {
    console.error(`Tool handler for ${toolName} not found`);
    process.exit(1);
  }

  try {
    const result = await toolHandler(request);
    console.log(`Tool ${toolName} executed successfully:`, result);
  } catch (error) {
    console.error(`Error executing tool ${toolName}:`, error);
  }
  console.log(`Tool ${toolName} debug completed.`);
}
