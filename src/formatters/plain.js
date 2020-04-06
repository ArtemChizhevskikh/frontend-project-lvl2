import { has, isObject } from 'lodash';


const processValue = (value) => {
  if (isObject(value)) {
    return '[complex value]';
  }
  return (typeof value === 'string') ? `'${value}'` : value;
};

const stringifyNode = (node, path, message) => {
  switch (message) {
    case 'added':
      return `Property '${path.join('.')}' was added with value: ${processValue(node.value)}`;
    case 'deleted':
      return `Property '${path.join('.')}' was deleted`;
    case 'changed':
      return `Property '${path.join('.')}' was changed from ${processValue(node.oldValue)} to ${processValue(node.newValue)}`;
    default:
      throw new Error(`Unknown message ${message}!`);
  }
};

const iter = (data, currentPath = '') => data.reduce((acc, node) => {
  const newCurrentPath = [...currentPath, node.key];
  if (has(node, 'children')) {
    return [...acc, ...iter(node.children, newCurrentPath)];
  }
  if (node.status === 'unchanged') {
    return acc;
  }
  return [...acc, stringifyNode(node, newCurrentPath, node.status)];
}, []);

export default (data) => iter(data).sort().join('\n');
