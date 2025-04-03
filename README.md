# Tigris MCP Server

Tigris is a globally distributed S3-compatible object storage service that provides low latency anywhere in the world, enabling developers to store and access any amount of data for a wide range of use cases. As Tigris supports the S3 API, you can use the wide range of available S3 tools, libraries, and extensions. You can get `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` from **[webconsole](https://console.tigris.dev/)** by following these **[the steps](https://www.tigrisdata.com/docs/iam/create-access-key/)**. Please refer to our **[Tigris Data documentation](https://www.tigrisdata.com/docs/get-started/)** for detailed overview.

## Installation
Run `npx -y @tigrisdata/tigris-mcp-server init` in terminal and follow the instructions.

## Manual Configuration
Add the following to your `claude_desktop_config.json` for **Claude Desktop** or go to Cursor Settings/MCP and click on **Add new global MCP server** and following code:

```
{
  "mcpServers": {
    "tigris-mcp-server": {
      "command": "npx",
      "args": ["-y", "@tigrisdata/tigris-mcp-server", "run"],
      "env": {
        "AWS_ACCESS_KEY_ID": "YOUR_AWS_ACCESS_KEY_ID",
        "AWS_SECRET_ACCESS_KEY": "YOUR_AWS_SECRET_ACCESS_KEY",
        "AWS_ENDPOINT_URL_S3": "https://fly.storage.tigris.dev"
      }
    }
  }
}
```

Alternatively, you can use your existing **AWS Profiles** if you have AWS CLI installed and have your AWS credential configured. You can use the following configuration.

```
{
  "mcpServers": {
    "tigris-mcp-server": {
      "command": "npx",
      "args": ["-y", "@tigrisdata/tigris-mcp-server", "run"],
      "env": {
        "USER_AWS_PROFILES": "true",
        "AWS_PROFILE": "default",
        "AWS_ENDPOINT_URL_S3": "https://fly.storage.tigris.dev"
      }
    }
  }
}
```