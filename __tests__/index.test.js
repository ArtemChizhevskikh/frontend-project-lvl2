import path from 'path';
import fs from 'fs';
import genDiff from '../src/index.js';


const extensions = [['.json'], ['.yml'], ['.ini']];
const getFullPath = (file, extension = '') => path.resolve(__dirname, 'fixtures',
  `${file}${extension}`);

test.each(extensions)('plain %s compare', (extension) => {
  const path1 = getFullPath('before', extension);
  const path2 = getFullPath('after', extension);
  const expected = fs.readFileSync(getFullPath('expected'), 'utf-8');

  expect(genDiff(path1, path2)).toBe(expected);
});
