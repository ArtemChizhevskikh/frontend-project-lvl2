import makePlain from './plain.js';
import stringify from './treelike.js';

const formatters = {
  treelike: stringify,
  plain: makePlain,
  json: JSON.stringify,
};

export default (data, format) => {
  const render = formatters[format];
  return render(data);
};
