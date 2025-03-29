import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerBucketTools } from './tools/buckets.js';
import { registerObjectTools } from './tools/objects.js';
import pjson from './../package.json' with { type: 'json' };

export async function main() {
  const { version } = pjson;

  const server = new McpServer({
    name: 'Tigris MCP Server',
    version,
  });

  registerBucketTools(server);
  registerObjectTools(server);

  // Start receiving messages on stdin and sending messages on stdout
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
