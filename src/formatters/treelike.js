import { isObject } from 'lodash';

const makeIndent = (depth) => '    '.repeat(depth);

const stringifyNode = (node, depth) => {
  const indent = makeIndent(depth);
  const stringifyObject = (object) => {
    const objectEntries = Object.entries(object);
    return objectEntries
      .map(([key, value]) => `{\n${makeIndent(depth + 1)}${key}: ${value}\n${makeIndent(depth)}}`);
  };

  const stringifyValue = (value) => {
    if (isObject(value)) {
      return stringifyObject(value);
    }
    return value;
  };

  const deletedKey = `${'- '.padStart(indent.length)}${node.key}`;
  const addedKey = `${'+ '.padStart(indent.length)}${node.key}`;

  switch (node.type) {
    case 'unchanged':
      return `${indent}${node.key}: ${stringifyValue(node.value)}`;
    case 'changed':
      return `${deletedKey}: ${stringifyValue(node.oldValue)}\n${addedKey}: ${stringifyValue(node.newValue)}`;
    case 'deleted':
      return `${deletedKey}: ${stringifyValue(node.value)}`;
    case 'added':
      return `${addedKey}: ${stringifyValue(node.value)}`;
    default:
      throw new Error(`Unknown message ${node.type}!`);
  }
};

const stringifyData = (data, depth = 1) => data.map((node) => {
  const indent = makeIndent(depth);
  if (node.type === 'parent') {
    const processedChildren = stringifyData(node.children, depth + 1).join('\n');
    return `${indent}${node.key}: {\n${processedChildren}\n${indent}}`;
  }
  if (node.type === 'changed') {
    return stringifyNode(node, depth);
  }
  return stringifyNode(node, depth);
});

export default (data) => {
  const processedData = stringifyData(data).join('\n');
  return `{\n${processedData}\n}`;
};
