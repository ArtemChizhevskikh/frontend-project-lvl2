#!/usr/bin/env node

import { program } from 'commander';
import genDiff from '../index.js';


program
  .usage('[options] <firstConfig> <secondConfig>')
  .version('0.0.4')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format (treelike|plain|json)', 'treelike')
  .arguments('<path1> <path2>')
  .action((path1, path2) => {
    console.log(genDiff(path1, path2, program.format));
  })
  .parse(process.argv);
