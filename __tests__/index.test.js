import path from 'path';
import fs from 'fs';
import genDiff from '../src/index.js';


const extensions = [['.json', 'treelike'], ['.yml', 'treelike'], ['.ini', 'treelike'],
  ['.json', 'plain'], ['.yml', 'plain'], ['.ini', 'plain'],
  ['.json', 'json'], ['.yml', 'json'], ['.ini', 'json']];

const getFullPath = (file, extension = '.txt') => path.resolve(__dirname, 'fixtures', `${file}${extension}`);

test.each(extensions)('compare %s files in %s format', (extension, format) => {
  const path1 = getFullPath('before', extension);
  const path2 = getFullPath('after', extension);
  const expected = fs.readFileSync(getFullPath(`${format}Expected`), 'utf-8');

  expect(genDiff(path1, path2, format)).toBe(expected);
});
