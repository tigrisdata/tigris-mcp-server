# Contribution Guide

## Developer Guide for Tigris MCP Server

This guide explains how to set up, develop, and debug the **Tigris MCP Server** project using Node.js and Docker.

---

## Prerequisites

Before starting, ensure you have the following installed on your system:

- **Node.js** (v20 or higher)
- **npm** (comes with Node.js)
- **Docker** (for containerized development)
- **Git** (for version control)

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/tigrisdata/tigris-mcp-server.git
cd tigris-mcp-server
```

### 2. Install Dependencies

Run the following command to install the required dependencies:

```bash
npm ci
```

---

## Development

### 1. Build the Project

To compile the TypeScript code into JavaScript, run:

```bash
npm run build
```

The compiled files will be located in the `dist` directory.

### 3. Lint and Format Code

- **Linting**: Run the linter to check for code issues:

  ```bash
  npm run lint
  ```

- **Formatting**: Use Prettier to format the code:

  ```bash
  npm run format
  ```

---

## Debugging

### Debugging Tools

The project includes a `debug` command to test individual tools. For example:

```bash
npm run build
node dist/index.js debug tigris_list_buckets
```

You can pass arguments to the tool using query strings. For example:

```bash
node dist/index.js debug tigris_put_object "bucketName=my-bucket&key=my-key&content=HelloWorld"
```

---

## Running with Docker

### 1. Build the Docker Image

To build the Docker image for the project, run:

```bash
docker build -t tigris-mcp-server -f Dockerfile .
```

### 2. Run the Server in Docker

To start the server in Docker, use:

```bash
docker run -it --rm \
  -e AWS_ACCESS_KEY_ID=your-access-key-id \
  -e AWS_SECRET_ACCESS_KEY=your-secret-access-key \
  -e AWS_ENDPOINT_URL_S3=https://fly.storage.tigris.dev \
  tigris-mcp-server
```

## Environment Variables

The project uses the following environment variables:

- `AWS_ACCESS_KEY_ID`: Your AWS/Tigris access key ID.
- `AWS_SECRET_ACCESS_KEY`: Your AWS/Tigris secret access key.
- `AWS_ENDPOINT_URL_S3`: The S3-compatible endpoint URL (default: `https://fly.storage.tigris.dev`).

You can configure these in a `.env` file for local development.

---

## Additional Notes

- **Dockerized Development**: The `init` command in the project can generate Docker configurations for tools like **Claude for Desktop** and **Cursor AI**.
- **Semantic Release**: The project uses `semantic-release` for automated versioning and publishing.

For more details, refer to the [README.md](README.md) file.

---
