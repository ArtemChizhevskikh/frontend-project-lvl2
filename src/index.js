import fs from 'fs';
import path from 'path';
import process from 'process';
import _ from 'lodash';
import render from './formatters/index.js';
import parse from './parsers.js';

const readFile = (pathToFile) => {
  const fullPath = path.resolve(process.cwd(), `${pathToFile}`);
  const fileData = fs.readFileSync(fullPath, 'utf-8');
  return fileData;
};

const getDataType = (pathToFile) => {
  const extension = path.extname(pathToFile);
  const dataType = extension.slice(1);
  return dataType;
};

const buildDiffAst = (node1, node2) => {
  const keys = _.union(_.keys(node1), _.keys(node2)).sort();
  return keys.flatMap((key) => {
    if (!_.has(node1, key)) {
      const value = node2[key];
      return { key, value, type: 'added' };
    }
    if (!_.has(node2, key)) {
      const value = node1[key];
      return { key, value, type: 'deleted' };
    }
    if (_.isObject(node1[key]) && _.isObject(node2[key])) {
      return { key, children: buildDiffAst(node1[key], node2[key]), type: 'parent' };
    }
    const oldValue = node1[key];
    const newValue = node2[key];
    if (oldValue === newValue) {
      return { key, value: oldValue, type: 'unchanged' };
    }
    return {
      key, oldValue, newValue, type: 'changed',
    };
  });
};

const genDiff = (path1, path2, format) => {
  const data1 = readFile(path1);
  const data2 = readFile(path2);
  const config1 = parse(data1, getDataType(path1));
  const config2 = parse(data2, getDataType(path2));
  const diff = buildDiffAst(config1, config2);
  return render(diff, format);
};

export default genDiff;
