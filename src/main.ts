import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { BUCKET_TOOLS_HANDLER, TIGRIS_BUCKET_TOOLS } from './tools/buckets.js';
import { OBJECT_TOOLS_HANDLER, TIGRIS_OBJECT_TOOLS } from './tools/objects.js';
import { testConfig } from './utils/test-config.js';

const AVAILABLE_TOOLS = [...TIGRIS_BUCKET_TOOLS, ...TIGRIS_OBJECT_TOOLS];
const AVAILABLE_TOOLS_HANDLERS = {
  ...BUCKET_TOOLS_HANDLER,
  ...OBJECT_TOOLS_HANDLER,
};

export async function main() {
  const server = new Server(
    {
      name: 'Tigris MCP Server',
      version: '1.13.0',
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  // Handle tool listing
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: AVAILABLE_TOOLS };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const tool = request.params.name;

    switch (tool) {
      default:
        if (tool in AVAILABLE_TOOLS_HANDLERS) {
          try {
            testConfig();
            return await AVAILABLE_TOOLS_HANDLERS[tool](request);
          } catch (error) {
            return {
              content: [
                {
                  type: 'text',
                  text: `Error: ${error instanceof Error ? error.message : String(error)}`,
                },
              ],
            };
          }
        } else {
          throw new Error(`Unknown tool: ${tool}`);
        }
    }
  });

  // Start receiving messages on stdin and sending messages on stdout
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
