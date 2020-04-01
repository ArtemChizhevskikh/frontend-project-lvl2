import path from 'path';
import genDiff from '../src/index.js';

const extensions = [['json'], ['yml'], ['ini']];
const expected = ['{',
  '    host: hexlet.io',
  '  - timeout: 50',
  '  + timeout: 20',
  '  - proxy: 123.234.53.22',
  '  - follow: false',
  '  + verbose: true',
  '}'];

test.each(extensions)('plain %s compare', (extension) => {
  const path1 = path.resolve(__dirname, 'fixtures', `before.${extension}`);
  const path2 = path.resolve(__dirname, 'fixtures', `after.${extension}`);

  expect(genDiff(path1, path2)).toBe(expected.join('\n'));
});
