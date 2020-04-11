import { has, isObject } from 'lodash';

const makeIndent = (depth) => '    '.repeat(depth);

const stringifyKey = (key, indent, message) => {
  const indentLength = indent.length;
  switch (message) {
    case 'unchanged':
      return `${indent}${key}`;
    case 'deleted':
      return `${'- '.padStart(indentLength)}${key}`;
    case 'added':
      return `${'+ '.padStart(indentLength)}${key}`;
    default:
      throw new Error(`Unknown message ${message}!`);
  }
};

const stringifyObject = (object, depth) => {
  const objectEntries = Object.entries(object);
  return objectEntries
    .map(([key, value]) => `{\n${makeIndent(depth + 1)}${key}: ${value}\n${makeIndent(depth)}}`);
};

const stringifyValue = (value, depth) => {
  if (isObject(value)) {
    return stringifyObject(value, depth);
  }
  return value;
};

const stringifyData = (data, depth = 1) => {
  const indent = makeIndent(depth);
  return data.flatMap((node) => {
    if (has(node, 'children')) {
      const processedKey = stringifyKey(node.key, indent, node.status);
      const processedChildren = stringifyData(node.children, depth + 1).join('\n');
      return [`${processedKey}: {`, processedChildren, `${indent}}`];
    }
    if (node.status === 'changed') {
      const deletedKey = stringifyKey(node.key, indent, 'deleted');
      const addedKey = stringifyKey(node.key, indent, 'added');
      const oldValue = stringifyValue(node.oldValue, depth);
      const newValue = stringifyValue(node.newValue, depth);
      return [`${deletedKey}: ${oldValue}`, `${addedKey}: ${newValue}`];
    }
    const processedKey = stringifyKey(node.key, indent, node.status);
    const processedValue = stringifyValue(node.value, depth);
    return [`${processedKey}: ${processedValue}`];
  });
};

export default (data) => {
  const processedData = stringifyData(data).join('\n');
  return `{\n${processedData}\n}`;
};
