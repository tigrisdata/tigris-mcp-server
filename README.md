# Tigris MCP Server

Tigris is a globally distributed S3-compatible object storage service that provides low latency anywhere in the world, enabling developers to store and access any amount of data for a wide range of use cases. As Tigris supports the S3 API, you can use the wide range of available S3 tools, libraries, and extensions. You can get `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` from **[webconsole](https://console.tigris.dev/)** by following these **[the steps](https://www.tigrisdata.com/docs/iam/create-access-key/)**. Please refer to our **[Tigris Data documentation](https://www.tigrisdata.com/docs/get-started/)** for detailed overview.

## Installation

Run `npx -y @tigrisdata/tigris-mcp-server init` in terminal and follow the instructions.

## Manual Configuration

Add the following to your `claude_desktop_config.json` for **Claude Desktop** or go to Cursor Settings/MCP and click on **Add new global MCP server** and following code:

### Via NPX

```json
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

### Via Docker

#### Build Docker Image

`docker build -t tigris-mcp-server -f Dockerfile .`

Please note that the server will only allow operations within `/User/CurrentUser/tigris-mcp-server. This allows for a secure sandboxing environment.

```json
{
  "mcpServers": {
    "tigris-mcp-server": {
      "command": "docker",
      "args": [
        "run",
        "-e AWS_ACCESS_KEY_ID",
        "-e AWS_SECRET_ACCESS_KEY",
        "-e AWS_ENDPOINT_URL_S3",
        "--network",
        "host",
        "--name",
        "tigris-mcp-server",
        "-i",
        "-v",
        "tigris-mcp-server:/app/dist",
        "--rm",
        "tigris-mcp-server"
      ],
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

```json
{
  "mcpServers": {
    "tigris-mcp-server": {
      "command": "npx",
      "args": ["-y", "@tigrisdata/tigris-mcp-server", "run"],
      "env": {
        "USE_AWS_PROFILES": "true",
        "AWS_PROFILE": "default",
        "AWS_ENDPOINT_URL_S3": "https://fly.storage.tigris.dev"
      }
    }
  }
}
```

or via docker

```json
{
  "mcpServers": {
    "tigris-mcp-server": {
      "command": "docker",
      "args": [
        "run",
        "-e USE_AWS_PROFILES",
        "-e AWS_PROFILE",
        "-e AWS_ENDPOINT_URL_S3",
        "--network",
        "host",
        "--name",
        "tigris-mcp-server",
        "-i",
        "-v",
        "tigris-mcp-server:/app/dist",
        "--rm",
        "tigris-mcp-server"
      ],
      "env": {
        "USE_AWS_PROFILES": "true",
        "AWS_PROFILE": "default",
        "AWS_ENDPOINT_URL_S3": "https://fly.storage.tigris.dev"
      }
    }
  }
}
```
