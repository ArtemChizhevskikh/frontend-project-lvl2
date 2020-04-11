import yaml from 'js-yaml';
import ini from 'ini';
import { isObject, mapValues } from 'lodash';

const parsers = {
  json: JSON.parse,
  yml: yaml.safeLoad,
  ini: ini.parse,
};

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

export default (data, dataType) => {
  const parser = parsers[dataType];
  const config = parser(data);
  const processedConfig = (dataType === 'ini') ? mapValues(config, processValue) : config;
  return processedConfig;
};
