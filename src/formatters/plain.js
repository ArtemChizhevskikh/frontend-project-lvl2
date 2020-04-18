import { isObject } from 'lodash';

const processValue = (value) => {
  if (isObject(value)) {
    return '[complex value]';
  }
  return (typeof value === 'string') ? `'${value}'` : value;
};

const makeDataPlain = (data, oldPath = '') => {
  const filtredData = data.filter((node) => node.type !== 'unchanged');
  return filtredData.flatMap((node) => {
    const newPath = [...oldPath, node.key];
    switch (node.type) {
      case 'parent':
        return makeDataPlain(node.children, newPath);
      case 'added':
        return `Property '${newPath.join('.')}' was added with value: ${processValue(node.value)}`;
      case 'deleted':
        return `Property '${newPath.join('.')}' was deleted`;
      case 'changed':
        return `Property '${newPath.join('.')}' was changed from ${processValue(node.oldValue)} to ${processValue(node.newValue)}`;
      default:
        throw new Error(`Unknown message ${node.type}!`);
    }
  });
};

export default (data) => makeDataPlain(data).join('\n');
