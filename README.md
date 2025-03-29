# Tigris MCP Server

## How to test temporarily

Run
`npm run build`

### Usage with Claude Desktop/Cursor AI
Add the following to your claude_desktop_config.json:

```
{
  "mcpServers": {
    "tigris-mcp-server": {
      "command": "node",
      "args": [
        "PATH_TO/tigris-mcp-server/dist/index.js",
        "run"
      ],
      "env": {
        "AWS_ACCESS_KEY_ID": "YOUR_AWS_ACCESS_KEY_ID",
        "AWS_SECRET_ACCESS_KEY": "YOUR_AWS_SECRET_ACCESS_KEY",
        "TIGRIS_GLOBAL_ENDPOINT": "https://fly.storage.tigris.dev"
      }
    }
  }
}
```