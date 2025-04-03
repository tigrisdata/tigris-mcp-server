import fs from 'fs';
import inquirer from 'inquirer';
import os from 'os';
import path from 'path';
import { MCP_SERVER_CONFIG, MCP_SERVER_CONFIG_FILE } from './utils/types.js';

export async function init() {
  const { mode } = await inquirer.prompt([
    {
      type: 'list',
      name: 'mode',
      message: 'Select Application:',
      choices: ['Claude', 'Cursor'],
    },
  ]);

  const { useAwsProfiles } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'useAwsProfiles',
      message: 'Do you want to use AWS profiles?',
      default: true,
    },
  ]);

  let config: MCP_SERVER_CONFIG = {
    'tigris-mcp-server': {
      command: 'npx',
      args: ['-y', '@tigrisdata/tigris-mcp-server', 'run'],
      env: {},
    },
  };

  if (useAwsProfiles) {
    const { awsProfile } = await inquirer.prompt([
      {
        type: 'input',
        name: 'awsProfile',
        message: 'Enter AWS profile name:',
        default: 'default',
      },
    ]);
    config['tigris-mcp-server'].env.USE_AWS_PROFILES = 'true';
    config['tigris-mcp-server'].env.AWS_PROFILE = awsProfile;
  } else {
    const { awsAccessKeyId } = await inquirer.prompt([
      {
        type: 'input',
        name: 'awsAccessKeyId',
        message: 'Enter you AWS Access Key Id:',
      },
    ]);
    const { awsSecretAccessKey } = await inquirer.prompt([
      {
        type: 'input',
        name: 'awsSecretAccessKey',
        message: 'Enter AWS Secret Access Key:',
      },
    ]);
    config['tigris-mcp-server'].env.AWS_ACCESS_KEY_ID = awsAccessKeyId;
    config['tigris-mcp-server'].env.AWS_SECRET_ACCESS_KEY = awsSecretAccessKey;
  }

  const { awsEndpointUrl } = await inquirer.prompt([
    {
      type: 'input',
      name: 'awsEndpointUrl',
      message: 'Enter AWS_ENDPOINT_URL_S3:',
      default: 'https://fly.storage.tigris.dev',
    },
  ]);
  config['tigris-mcp-server'].env.AWS_ENDPOINT_URL_S3 = awsEndpointUrl;

  // Determine the file path based on mode
  const filePath =
    mode === 'Claude'
      ? path.join(
          os.homedir(),
          'Library',
          'Application Support',
          'Claude',
          'claude_desktop_config.json',
        )
      : path.join(os.homedir(), '.cursor', 'mcp.json');

  let existingConfig: MCP_SERVER_CONFIG_FILE = {};

  if (fs.existsSync(filePath)) {
    try {
      existingConfig = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(
        `Warning: Could not parse existing config file at ${filePath}, using an empty config.`,
        { error },
      );
    }
  }

  const newConfig = {
    ...existingConfig,
    mcpServers: { ...existingConfig.mcpServers, ...config },
  };
  fs.writeFileSync(filePath, JSON.stringify(newConfig, null, 2));
  // eslint-disable-next-line no-console
  console.log(`Configuration saved to for ${mode}`);
}
