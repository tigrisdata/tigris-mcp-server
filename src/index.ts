#!/usr/bin/env node

import { debug } from './debug.js';
import { init } from './init.js';
import { main } from './main.js';

const [cmd, tool, args] = process.argv.slice(2);

if (cmd === 'run') {
  await main();
} else if (cmd === 'init') {
  await init();
} else if (cmd === 'debug') {
  await debug(tool, args);
} else {
  // TODO: Add init command and help text
  process.exit(1);
}
