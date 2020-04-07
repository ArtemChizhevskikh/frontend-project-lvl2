import fs from 'fs';
import path from 'path';
import process from 'process';
import { has, isObject, mapValues } from 'lodash';
import getRenderer from './formatters/index.js';
import getParser from './parsers.js';

const readFile = (pathToFile) => {
  const fullPath = path.resolve(process.cwd(), `${pathToFile}`);
  const fileData = fs.readFileSync(fullPath, 'utf-8');
  return fileData;
};

const processValue = (value) => {
  if (isObject(value)) {
    const newValue = mapValues(value, processValue);
    return newValue;
  }
  if (Number.isNaN(parseInt(value, 10))) {
    return value;
  }
  return parseInt(value, 10);
};

const iterDiffAst = (node1, node2) => {
  const keys = Object.keys({ ...node1, ...node2 }).sort();
  return keys.flatMap((key) => {
    if (!has(node1, key)) {
      return { key, value: processValue(node2[key]), status: 'added' };
    }
    if (!has(node2, key)) {
      return { key, value: processValue(node1[key]), status: 'deleted' };
    }
    if (isObject(node1[key]) && isObject(node2[key])) {
      return { key, children: iterDiffAst(node1[key], node2[key]), status: 'unchanged' };
    }
    return (node1[key] === node2[key]) ? { key, value: processValue(node1[key]), status: 'unchanged' }
      : {
        key, oldValue: processValue(node1[key]), newValue: processValue(node2[key]), status: 'changed',
      };
  });
};

const genDiff = (path1, path2, format) => {
  const data1 = readFile(path1);
  const data2 = readFile(path2);
  const config1 = getParser(path1)(data1);
  const config2 = getParser(path2)(data2);
  const diff = iterDiffAst(config1, config2);
  return getRenderer(format)(diff);
};

export default genDiff;
