import { has, isObject } from 'lodash';

const makeIndent = (depth) => '    '.repeat(depth);

const stringifyKey = (key, depth, message) => {
  const indentLength = makeIndent(depth).length;
  switch (message) {
    case 'unchanged':
      return `${makeIndent(depth)}${key}`;
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
  return `${value}`;
};

const iter = (data, depth = 1) => {
  const indent = makeIndent(depth);
  return data.flatMap((node) => {
    if (has(node, 'children')) {
      return [`${indent}${node.key}: {`, iter(node.children, depth + 1).join('\n'), `${indent}}`];
    }
    if (node.status === 'changed') {
      return [`${stringifyKey(node.key, depth, 'deleted')}: ${stringifyValue(node.oldValue, depth)}`,
        `${stringifyKey(node.key, depth, 'added')}: ${stringifyValue(node.newValue, depth)}`];
    }
    return [`${stringifyKey(node.key, depth, node.status)}: ${stringifyValue(node.value, depth)}`];
  });
};

export default (data) => `{\n${(iter(data)).join('\n')}\n}`;
