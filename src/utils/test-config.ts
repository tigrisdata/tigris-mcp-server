export function testConfig() {
  const {
    USE_AWS_PROFILES = 'false',
    AWS_ACCESS_KEY_ID = '',
    AWS_SECRET_ACCESS_KEY = '',
    AWS_ENDPOINT_URL_S3,
  } = process.env;

  if (USE_AWS_PROFILES === 'false') {
    if (AWS_ACCESS_KEY_ID === '') {
      throw new Error(
        'Tigris MCP Server is not configured correctly, environment variable AWS_ACCESS_KEY_ID is not set',
      );
    }

    if (AWS_SECRET_ACCESS_KEY === '') {
      throw new Error(
        'Tigris MCP Server is not configured correctly, environment variable AWS_SECRET_ACCESS_KEY is not set',
      );
    }

    if (AWS_ENDPOINT_URL_S3 === '') {
      throw new Error(
        'Tigris MCP Server is not configured correctly, environment variable AWS_ENDPOINT_URL_S3 is not set',
      );
    }
  }
}
