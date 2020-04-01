import yaml from 'js-yaml';
import path from 'path';
import ini from 'ini';

const parsers = {
  '.json': JSON.parse,
  '.yml': yaml.safeLoad,
  '.ini': ini.parse,
};

export default (pathToFile) => {
  const format = path.extname(pathToFile);
  return parsers[format];
};
