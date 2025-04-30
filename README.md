# 🦁 Tigris MCP Server

Tigris is a high-performance, S3-compatible object storage system designed for multi-cloud and AI workloads. We move your data all around the world based on where it's needed so that downloads are fast and the data is close to your users. You can store anything you want on Tigris (AI models, training data, database backups, request logs, social media uploads, or anything else) with no egress fees.

The **Tigris MCP Server** implements the [MCP specification](https://modelcontextprotocol.io/) to create a seamless connection between AI agents and Tigris key features like bucket and object management.

## 🎯 Features

The Tigris MCP server provides your agents context to your Tigris buckets and objects. That allows you to use Tigris in your AI editor workflows.

Here are some example prompts you can try:

#### 📦 Buckets

- List my tigris buckets
- Create a new tigris bucket and call it `my-bucket`
- Delete my tigris bucket called `my-bucket`

#### 🔗 Objects

- List my objects in bucket `my-bucket`
- Upload `/Users/ME/tigris-mcp-server/myfile.txt` to `my-bucket`
- Create a folder named `test` in `my-bucket`
- Create a file `test.txt` with content `Hello World` in `my-bucket`
- Give me a link to share for `test.txt`
- Delete `myfile.txt` from `my-bucket`

Checkout our blog post about [Vibe coding](https://www.tigrisdata.com/blog/vibes-off/) with Tigris MCP Server and more tips on [sharing files](https://www.tigrisdata.com/blog/mcp-server-sharing/) using Tigris MCP Server

## 🚀 Getting Started

As Tigris supports the S3 API, you can use the wide range of available S3 tools, libraries, and extensions. You can get `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` from [webconsole](https://console.tigris.dev/) by following these [the steps](https://www.tigrisdata.com/docs/iam/create-access-key/). Please refer to our [Tigris Data documentation](https://www.tigrisdata.com/docs/get-started/) for detailed overview.

To get started:

* Sign up for an account at [storage.new](https://storage.new).
* Get an access key at [storage.new/accesskey](https://storage.new/accesskey).
* Copy the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` to a safe place like your password manager. These will not be shown again.

### ⚒️ Requirements

Tigris MCP server can be used both with `npx` and `docker`. We recommend [running with `docker`](https://www.tigrisdata.com/blog/mcp-server/#trust) as it provides better sandboxing.

We support installing the Tigris MCP server two ways:

1. [🐳 Docker](https://www.docker.com/)
1. [📦 NPX](https://docs.npmjs.com/cli/v8/commands/npx)

We ]suggest installing and using the MCP server with Docker](https://www.tigrisdata.com/blog/mcp-server/#trust) as it provides much better sandboxing than NPX.

- Running the Tigris MCP server with `docker` requires the Docker Engine to be installed. If you don't have it installed, follow the instructions [here](https://docs.docker.com/engine/install/).
- Running the Tigris MCP server with `npx` requires Node.js to be installed. If you don't have it installed, follow the instructions [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

### ⚙️ Installation

#### 🪄 One click install for VS Code

Click one of these buttons to install the Tigris MCP Server for VS Code or VS Code Insiders.

[![VS Code - Install Tigris MCP Server](https://img.shields.io/badge/VS%20Code-Install%20Tigris%20MCP%20Server-0098FF?logo=)](https://insiders.vscode.dev/redirect/mcp/install?name=Tigris%20MCP%20Server&config=%7B%22mcpServers%22%3A%7B%22tigris-mcp-server%22%3A%7B%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40tigrisdata%2Ftigris-mcp-server%22%2C%22run%22%5D%2C%22env%22%3A%7B%22AWS_ACCESS_KEY_ID%22%3A%22YOUR_AWS_ACCESS_KEY_ID%22%2C%22AWS_SECRET_ACCESS_KEY%22%3A%22YOUR_AWS_SECRET_ACCESS_KEY%22%2C%22AWS_ENDPOINT_URL_S3%22%3A%22https%3A%2F%2Ffly.storage.tigris.dev%22%7D%7D%7D%7D) [![VS Code Insiders - Install Tigris MCP Server](https://img.shields.io/badge/VS%20Code%20Insiders-Install%20Tigris%20MCP%20Server-24bfa5)](https://insiders.vscode.dev/redirect/mcp/install?name=Tigris%20MCP%20Server&config=%7B%22mcpServers%22%3A%7B%22tigris-mcp-server%22%3A%7B%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40tigrisdata%2Ftigris-mcp-server%22%2C%22run%22%5D%2C%22env%22%3A%7B%22AWS_ACCESS_KEY_ID%22%3A%22YOUR_AWS_ACCESS_KEY_ID%22%2C%22AWS_SECRET_ACCESS_KEY%22%3A%22YOUR_AWS_SECRET_ACCESS_KEY%22%2C%22AWS_ENDPOINT_URL_S3%22%3A%22https%3A%2F%2Ffly.storage.tigris.dev%22%7D%7D%7D%7D&quality=insiders)

#### 📦 Claude Desktop and Cursor AI

You can install the Tigris MCP server in [Claude Desktop](https://claude.ai/download) and [Cursor](https://www.cursor.com/) by running our install script:

```
npx -y @tigrisdata/tigris-mcp-server init
```

#### 🪏 Manual Installation

Add the following to your `claude_desktop_config.json` for **Claude Desktop** or go to Cursor Settings/MCP and click on **Add new global MCP server** and following code:

##### Via NPX

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

##### Via Docker

Please note that the server will only allow operations within `/User/**CurrentUser**/tigris-mcp-server. This allows for a secure sandboxing environment.

```json
{
  "mcpServers": {
    "tigris-mcp-server": {
      "command": "docker",
      "args": [
        "-e",
        "AWS_ACCESS_KEY_ID",
        "-e",
        "AWS_SECRET_ACCESS_KEY",
        "-e",
        "AWS_ENDPOINT_URL_S3",
        "--network",
        "host",
        "--name",
        "tigris-mcp-server-claude-for-desktop", // tigris-mcp-server-cursor for Cursor AI
        "-i",
        "--rm",
        "--mount",
        "type=bind,src=/Users/CURRENT_USER/tigris-mcp-server,dst=/Users/CURRENT_USER/tigris-mcp-server",
        "quay.io/tigrisdata/tigris-mcp-server:latest"
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
        "-e",
        "USE_AWS_PROFILES",
        "-e",
        "AWS_PROFILE",
        "-e",
        "AWS_ENDPOINT_URL_S3",
        "--network",
        "host",
        "--name",
        "tigris-mcp-server-claude-for-desktop", // tigris-mcp-server-cursor for Cursor AI
        "-i",
        "--rm",
        "--mount",
        "type=bind,src=/Users/CURRENT_USER/tigris-mcp-server,dst=/Users/CURRENT_USER/tigris-mcp-server",
        "quay.io/tigrisdata/tigris-mcp-server:latest"
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

For development, refer to the [CONTRIBUTING.md](CONTRIBUTING.md) file.
