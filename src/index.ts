#!/usr/bin/env node

import { main } from './main.js';

const [cmd] = process.argv.slice(2);

if (cmd === 'run') {
  await main();
}
