import toPlainText from './plain.js';
import stringify from './stringify.js';

const formatters = {
  string: stringify,
  plain: toPlainText,
};

export default (format) => formatters[format];
