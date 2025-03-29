import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerBucketTools } from './tools/buckets.js';
import { registerObjectTools } from './tools/objects.js';

export async function main() {
  // Create an MCP server
  const server = new McpServer({
    name: 'Tigris MCP Server',
    version: '1.0.0',
  });

  registerBucketTools(server);
  registerObjectTools(server);

  // Start receiving messages on stdin and sending messages on stdout
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
