import { random } from '../index';

test('random generates different values', () => {
  const first = random();
  const second = random();
  expect(first).not.toEqual(second);
  expect(typeof first).toBe('string');
});
