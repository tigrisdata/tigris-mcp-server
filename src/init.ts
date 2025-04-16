/* eslint-disable no-console */
import { spawnSync } from 'child_process';
import fs from 'fs';
import inquirer from 'inquirer';
import os from 'os';
import path from 'path';
import { MCP_SERVER_CONFIG, MCP_SERVER_CONFIG_FILE } from './utils/types.js';

const supportedApplications = ['Claude for Desktop', 'Cursor AI'];
const supportedModes = ['npx', 'docker'];
const tigrisMcpServerImage = 'quay.io/tigrisdata/tigris-mcp-server:latest';

export async function init() {
  const { application } = await inquirer.prompt([
    {
      type: 'list',
      name: 'application',
      message: 'Select Application:',
      choices: supportedApplications,
    },
  ]);

  const { mode } = await inquirer.prompt([
    {
      type: 'list',
      name: 'mode',
      message: 'Run via:',
      choices: supportedModes,
    },
  ]);

  const { useAwsProfiles } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'useAwsProfiles',
      message: 'Do you want to use AWS profiles?',
      default: false,
    },
  ]);

  const command = mode === supportedModes[0] ? 'npx' : 'docker';
  const args =
    mode === supportedModes[0]
      ? ['-y', '@tigrisdata/tigris-mcp-server', 'run'] // npx command
      : ['run']; // docker command

  let env: Record<string, string> = {};

  if (useAwsProfiles) {
    const { awsProfile } = await inquirer.prompt([
      {
        type: 'input',
        name: 'awsProfile',
        message: 'Enter AWS profile name:',
        default: 'default',
      },
    ]);
    env.USE_AWS_PROFILES = 'true';
    env.AWS_PROFILE = awsProfile;
  } else {
    const { awsAccessKeyId } = await inquirer.prompt([
      {
        type: 'input',
        name: 'awsAccessKeyId',
        message: 'Enter you AWS/Tigris Access Key Id:',
      },
    ]);
    const { awsSecretAccessKey } = await inquirer.prompt([
      {
        type: 'input',
        name: 'awsSecretAccessKey',
        message: 'Enter AWS/Tigris Secret Access Key:',
      },
    ]);
    env.AWS_ACCESS_KEY_ID = awsAccessKeyId;
    env.AWS_SECRET_ACCESS_KEY = awsSecretAccessKey;
  }

  const { awsEndpointUrl } = await inquirer.prompt([
    {
      type: 'input',
      name: 'awsEndpointUrl',
      message: 'Enter AWS/Tigris S3 Endpoint:',
      default: 'https://fly.storage.tigris.dev',
    },
  ]);
  env.AWS_ENDPOINT_URL_S3 = awsEndpointUrl;

  if (command === 'docker') {
    console.log(
      'Pulling the Tigris MCP Server Docker image. This may take a few minutes...\n',
    );
    const downloadImage = spawnSync(
      'docker',
      ['image', 'pull', tigrisMcpServerImage],
      { encoding: 'utf-8' },
    );

    if (downloadImage.error) {
      console.error(`Error pulling image: ${downloadImage.error.message}`);
    } else if (downloadImage.stderr) {
      console.error(`stderr: ${downloadImage.stderr}`);
    } else {
      console.log(`stdout: ${downloadImage.stdout}`);
    }

    const mcpFolder = `${os.homedir()}/tigris-mcp-server`;
    if (!fs.existsSync(mcpFolder)) {
      fs.mkdirSync(mcpFolder);
    }

    Object.keys(env).forEach((key) => {
      args.push('-e');
      args.push(key);
    });

    [
      '--network',
      'host',
      '--name',
      `tigris-mcp-server-${application.replace(/\s+/g, '-').toLowerCase()}`,
      '-i',
      '--rm',
      '--mount',
      `type=bind,src=${mcpFolder},dst=${mcpFolder}`,
      'quay.io/tigrisdata/tigris-mcp-server:latest',
    ].forEach((arg) => {
      args.push(arg);
    });
  }

  const config: MCP_SERVER_CONFIG = {
    'tigris-mcp-server': {
      command,
      args,
      env,
    },
  };

  // Determine the file path based on mode
  const filePath =
    application === supportedApplications[0]
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
  console.log(`Configuration saved to ${filePath} for ${application}`);
}
