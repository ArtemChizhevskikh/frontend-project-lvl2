import makePlain from './plain.js';
import stringify from './stringify.js';

const formatters = {
  treelike: stringify,
  plain: makePlain,
  json: JSON.stringify,
};

export default (data, format) => {
  const formatter = formatters[format];
  return formatter(data);
};
