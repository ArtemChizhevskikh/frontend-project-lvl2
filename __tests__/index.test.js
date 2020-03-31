import path from 'path';
import genDiff from '../src/index.js';

test('plain compare', () => {
  const path1 = path.resolve(__dirname, '..', '__fixtures__', 'before.json');
  const path2 = path.resolve(__dirname, '..', '__fixtures__', 'after.json');

  const expected = ['{',
    '  host: hexlet.io',
    '- timeout: 50',
    '+ timeout: 20',
    '- proxy: 123.234.53.22',
    '- follow: false',
    '+ verbose: true',
    '}'];

  expect(genDiff(path1, path2)).toBe(expected.join('\n'));
});
