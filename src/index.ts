#!/usr/bin/env node

import { init } from './init.js';
import { main } from './main.js';

const [cmd] = process.argv.slice(2);

if (cmd === 'run') {
  await main();
} else if (cmd === 'init') {
  await init();
} else {
  // TODO: Add init command and help text
  process.exit(1);
}
