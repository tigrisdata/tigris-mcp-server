/* eslint-disable no-console */
import { spawnSync } from 'child_process';
import fs from 'fs';
import inquirer from 'inquirer';
import os from 'os';
import path from 'path';
import {
  MCP_SERVER_CONFIG_FILE,
  MCP_SERVER_REMOTE_CONFIG,
  MCP_SERVER_STDIO_CONFIG,
} from './utils/types.js';

const applicationKeyValues = {
  cursor: 'Cursor',
  vscode: 'VS Code',
  'vscode-insiders': 'VS Code Insiders',
};

const applicationConfigMap = {
  'Claude Code': {
    filePath: path.join(os.homedir(), '.claude.json'),
    configKey: 'mcpServers',
  },
  'Claude for Desktop': {
    filePath: path.join(
      os.homedir(),
      'Library',
      'Application Support',
      'Claude',
      'claude_desktop_config.json',
    ),
    configKey: 'mcpServers',
  },
  Cursor: {
    filePath: path.join(os.homedir(), '.cursor', 'mcp.json'),
    configKey: 'mcpServers',
  },
  'VS Code': {
    filePath: path.join(
      os.homedir(),
      'Library',
      'Application Support',
      'Code',
      'User',
      'mcp.json',
    ),
    configKey: 'servers',
  },
  'VS Code Insiders': {
    filePath: path.join(
      os.homedir(),
      'Library',
      'Application Support',
      'Code - Insiders',
      'User',
      'mcp.json',
    ),
    configKey: 'servers',
  },
};

const supportedModes = ['npx', 'docker'];
const tigrisMcpServerImage = 'quay.io/tigrisdata/tigris-mcp-server:latest';
const supportedTransports = ['remote', 'stdio'];

export async function init(
  askForTransport: boolean = true,
  application: string | undefined = undefined,
) {
  let selectedApplication = '';
  if (application) {
    selectedApplication =
      applicationKeyValues[application as keyof typeof applicationKeyValues];
  }

  if (!selectedApplication) {
    const { application } = await inquirer.prompt([
      {
        type: 'list',
        name: 'application',
        message: 'Select Application:',
        choices: Object.keys(applicationConfigMap),
      },
    ]);
    selectedApplication = application;
  }
  let transport = 'remote';
  let config: MCP_SERVER_STDIO_CONFIG | MCP_SERVER_REMOTE_CONFIG = {};

  if (askForTransport) {
    const { selectedTransport } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedTransport',
        message: 'Select Transport:',
        choices: supportedTransports,
      },
    ]);

    transport = selectedTransport;
  }

  if (transport === 'stdio') {
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

    let command: string | null = null;
    let args: string[] | null = null;
    
    if (mode === 'npx') {
        command = 'npx';
        args = ['-y', '@tigrisdata/tigris-mcp-server', 'run'];
    } else if (mode === 'npx') {
        command = 'docker';
        args = ['run'];
    } else {
        throw new Error(`Unsupported execution mode ${mode}, wanted one of ${supportedModes}`);
    }

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
          message: 'Enter Tigris Access Key Id:',
        },
      ]);
      const { awsSecretAccessKey } = await inquirer.prompt([
        {
          type: 'input',
          name: 'awsSecretAccessKey',
          message: 'Enter Tigris Secret Access Key:',
        },
      ]);
      env.AWS_ACCESS_KEY_ID = awsAccessKeyId;
      env.AWS_SECRET_ACCESS_KEY = awsSecretAccessKey;
    }

    const { awsEndpointUrl } = await inquirer.prompt([
      {
        type: 'input',
        name: 'awsEndpointUrl',
        message: 'Enter Tigris Endpoint:',
        default: 'https://t3.storage.dev',
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
        '-i',
        '--rm',
        '--mount',
        `type=bind,src=${mcpFolder},dst=${mcpFolder}`,
        'quay.io/tigrisdata/tigris-mcp-server:latest',
      ].forEach((arg) => {
        args.push(arg);
      });
    }

    config = {
      'tigris-mcp-server': {
        command,
        args,
        env,
      },
    };
  } else {
    config = {
      tigris: {
        type: 'http',
        url: 'https://mcp.storage.dev/mcp',
      },
    };
  }

  if (selectedApplication === 'Claude for Desktop' && transport === 'remote') {
    console.log(
      'You can add the Tigris MCP Server to Claude for Desktop by using Connectors, please refer to the following link: https://mcp.storage.dev/mcp',
    );
    return;
  }

  const { filePath, configKey } =
    applicationConfigMap[
      selectedApplication as keyof typeof applicationConfigMap
    ];

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
    [configKey]: { ...existingConfig[configKey], ...config },
  };

  fs.writeFileSync(filePath, JSON.stringify(newConfig, null, 2));
  console.log(`Configuration saved to ${filePath} for ${selectedApplication}`);
}
