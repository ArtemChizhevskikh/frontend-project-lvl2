import path from 'path';
import fs from 'fs';
import genDiff from '../src/index.js';


const extensions = [['.json'], ['.yml'], ['.ini']];
const getFullPath = (file, extension = '') => path.resolve(__dirname, 'fixtures', `${file}${extension}`);

test.each(extensions)('compare %s files', (extension) => {
  const path1 = getFullPath('before', extension);
  const path2 = getFullPath('after', extension);
  const expected = fs.readFileSync(getFullPath('expected'), 'utf-8');

  expect(genDiff(path1, path2, 'string')).toBe(expected);
});

test.each(extensions)('plain format', (extension) => {
  const path1 = getFullPath('before', extension);
  const path2 = getFullPath('after', extension);
  const expected = fs.readFileSync(getFullPath('expectedPlain'), 'utf-8');

  expect(genDiff(path1, path2, 'plain')).toBe(expected);
});
