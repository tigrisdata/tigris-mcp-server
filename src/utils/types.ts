import {
  CallToolRequestSchema,
  Result,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

export type ToolRequest = z.infer<typeof CallToolRequestSchema>;

export type ToolHandlers = Record<
  string,
  (request: ToolRequest) => Promise<Result>
>;

export type MCP_SERVER_CONFIG = Record<
  string,
  {
    command: string;
    args: string[];
    env: Record<string, string>;
  }
>;

export type MCP_SERVER_CONFIG_FILE = Record<string, MCP_SERVER_CONFIG>;
