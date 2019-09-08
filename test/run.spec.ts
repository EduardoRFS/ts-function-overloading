import { evaluate } from '../src';

test('evaluate function', () => {
  const { value } = evaluate("() => 'tuturu'");
  expect(value).toBeInstanceOf(Function);
  expect(value()).toBe('TUTURU');
});
