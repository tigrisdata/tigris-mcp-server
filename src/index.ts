#!/usr/bin/env node

import { init } from './init.js';
import { main } from './main.js';

const [cmd, args] = process.argv.slice(2);

if (cmd === 'run') {
  main().catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  });
} else if (cmd === 'setup') {
  await init(false, args);
} else if (cmd === 'init') {
  await init();
} else {
  // TODO: Add init command and help text
  process.exit(1);
}
