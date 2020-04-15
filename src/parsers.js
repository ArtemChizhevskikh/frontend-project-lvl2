import yaml from 'js-yaml';
import ini from 'ini';
import { isObject, mapValues } from 'lodash';

const processValue = (value) => {
  if (isObject(value)) {
    const newValue = mapValues(value, processValue);
    return newValue;
  }
  if (Number.isNaN(parseInt(value, 10))) {
    return value;
  }
  return parseInt(value, 10);
};

const iniParse = (data) => {
  const config = ini.parse(data);
  return mapValues(config, processValue);
};

const parsers = {
  json: JSON.parse,
  yml: yaml.safeLoad,
  ini: iniParse,
};

export default (data, dataType) => {
  const parse = parsers[dataType];
  return parse(data);
};
