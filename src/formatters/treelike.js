import { isObject } from 'lodash';

const makeIndent = (depth) => '    '.repeat(depth);

const stringifyValue = (value, depth) => {
  if (!isObject(value)) {
    return value;
  }
  const valueEntries = Object.entries(value);
  return valueEntries
    .map(([key, val]) => `{\n${makeIndent(depth + 1)}${key}: ${val}\n${makeIndent(depth)}}`);
};

const stringifyData = (data, depth = 1) => data.map((node) => {
  const indent = makeIndent(depth);
  const deletedKey = `${'- '.padStart(indent.length)}${node.key}`;
  const addedKey = `${'+ '.padStart(indent.length)}${node.key}`;
  switch (node.type) {
    case 'parent':
      return `${indent}${node.key}: {\n${stringifyData(node.children, depth + 1).join('\n')}\n${indent}}`;
    case 'unchanged':
      return `${indent}${node.key}: ${stringifyValue(node.value, depth)}`;
    case 'changed':
      return `${deletedKey}: ${stringifyValue(node.oldValue, depth)}\n${addedKey}: ${stringifyValue(node.newValue, depth)}`;
    case 'deleted':
      return `${deletedKey}: ${stringifyValue(node.value, depth)}`;
    case 'added':
      return `${addedKey}: ${stringifyValue(node.value, depth)}`;
    default:
      throw new Error(`Unknown message ${node.type}!`);
  }
});

export default (data) => {
  const processedData = stringifyData(data).join('\n');
  return `{\n${processedData}\n}`;
};
