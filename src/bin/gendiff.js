#!/usr/bin/env node

import { program } from 'commander';
import genDiff from '../index.js';

program
  .usage('[options] <firstConfig> <secondConfig>')
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format')
  .arguments('<path1> <path2> [env]')
  .action((path1, path2) => {
    console.log(genDiff(path1, path2));
  })
  .parse(process.argv);
