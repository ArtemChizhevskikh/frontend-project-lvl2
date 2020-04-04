import fs from 'fs';
import path from 'path';
import process from 'process';
import { has, isObject, flatten } from 'lodash';
import getParser from './parsers.js';

const parseFile = (pathToFile) => {
  const fullPath = path.resolve(process.cwd(), `${pathToFile}`);
  const parser = getParser(pathToFile);
  return parser(fs.readFileSync(fullPath, 'utf-8'));
};

const makeIndent = (depth) => '    '.repeat(depth);

const processKey = (node, depth) => {
  const indentLength = makeIndent(depth).length;
  switch (node.status) {
    case 'unchanged':
      return `${makeIndent(depth)}${node.name}`;
    case 'removed':
      return `${'- '.padStart(indentLength)}${node.name}`;
    case 'added':
      return `${'+ '.padStart(indentLength)}${node.name}`;
    default:
      throw new Error(`Unknown statue ${node.status}!`);
  }
};

const processValue = (value, depth) => {
  if (isObject(value)) {
    const result = Object.entries(value)
      .map(([k, v]) => `{\n${makeIndent(depth + 1)}${k}: ${v}\n${makeIndent(depth)}}`);
    return flatten(result);
  }
  return `${value}`;
};

const stringify = (object, depth) => {
  const indent = '    '.repeat(depth);
  return object.reduce((acc, node) => {
    if (has(node, 'children')) {
      return [...acc, `${indent}${node.name}: {`, flatten(stringify(node.children, depth + 1)).join('\n'), `${indent}}`];
    }
    return [...acc, `${processKey(node, depth)}: ${processValue(node.value, depth)}`];
  }, []);
};

const iterAst = (node1, node2) => {
  const keys = Object.keys({ ...node1, ...node2 }).sort();
  return keys.map((key) => {
    if (has(node1, key)) {
      if (has(node2, key)) {
        if (isObject(node1[key]) && isObject(node2[key])) {
          return { name: key, children: flatten(iterAst(node1[key], node2[key])), status: 'unchanged' };
        }
        return (node1[key] === node2[key]) ? { name: key, value: node1[key], status: 'unchanged' }
          : [{ name: key, value: node1[key], status: 'removed' }, { name: key, value: node2[key], status: 'added' }];
      }
      return { name: key, value: node1[key], status: 'removed' };
    }
    return { name: key, value: node2[key], status: 'added' };
  });
};


const genDiff = (path1, path2) => {
  const node1 = parseFile(path1);
  const node2 = parseFile(path2);
  return iterAst(node1, node2);
};

const render = (path1, path2) => {
  const result = flatten(genDiff(path1, path2));
  return `{\n${(stringify(result, 1)).join('\n')}\n}`;
};

export default render;
