#!/usr/bin/env node

import { main } from './main.js';

const [cmd] = process.argv.slice(2);

if (cmd === 'run') {
  await main();
} else {
  // TODO: Add init command and help text
  process.exit(1);
}
