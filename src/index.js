import fs from 'fs';
import path from 'path';
import process from 'process';
import _ from 'lodash';
import getParser from './parsers.js';

const parseFile = (pathToFile) => {
  const fullPath = path.resolve(process.cwd(), `${pathToFile}`);
  const parser = getParser(pathToFile);
  return parser(fs.readFileSync(fullPath, 'utf-8'));
};

const genDiff = (path1, path2) => {
  const file1 = parseFile(path1);
  const file2 = parseFile(path2);
  const keys = Object.keys({ ...file1, ...file2 });
  const result = keys.reduce((acc, key) => {
    if (_.has(file1, key)) {
      if (_.has(file2, key)) {
        return (file1[key] === file2[key]) ? `${acc},    ${key}: ${file1[key]}`
          : `${acc},  - ${key}: ${file1[key]},  + ${key}: ${file2[key]}`;
      }
      return `${acc},  - ${key}: ${file1[key]}`;
    }
    return `${acc},  + ${key}: ${file2[key]}`;
  }, '');
  return `{${result},}`.split(',').join('\n');
};

export default genDiff;
