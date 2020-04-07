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

const stringifyValue = (value, depth) => {
  if (isObject(value)) {
    const result = Object.entries(value)
      .map(([k, v]) => `{\n${makeIndent(depth + 1)}${k}: ${v}\n${makeIndent(depth)}}`);
    return result;
  }
  return value;
};

const iter = (data, depth = 1) => {
  const indent = makeIndent(depth);
  return data.flatMap((node) => {
    if (has(node, 'children')) {
      const processedKey = stringifyKey(node.key, indent, node.status);
      return [`${processedKey}: {`, iter(node.children, depth + 1).join('\n'), `${indent}}`];
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

export default (data) => `{\n${(iter(data)).join('\n')}\n}`;
