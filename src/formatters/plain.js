import { isObject } from 'lodash';

const stringifyNode = (node, path, message) => {
  const processValue = (value) => {
    if (isObject(value)) {
      return '[complex value]';
    }
    return (typeof value === 'string') ? `'${value}'` : value;
  };

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

const makeDataPlain = (data, currentPath = '') => data.reduce((acc, node) => {
  const newCurrentPath = [...currentPath, node.key];
  if (node.type === 'parent') {
    return [...acc, ...makeDataPlain(node.children, newCurrentPath)];
  }
  if (node.type === 'unchanged') {
    return acc;
  }
  return [...acc, stringifyNode(node, newCurrentPath, node.type)];
}, []);

export default (data) => makeDataPlain(data).join('\n');
