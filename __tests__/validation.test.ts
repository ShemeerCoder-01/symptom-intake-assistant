import { MAX_LEN, validateMessages, validateUserInput } from '@/lib/validation';

describe('validateUserInput', () => {
  it('trims valid input', () => {
    expect(validateUserInput('  headache  ')).toEqual({ valid: true, value: 'headache' });
  });
  it('rejects empty input', () => {
    expect(validateUserInput('   ').valid).toBe(false);
  });
  it('rejects input over the limit', () => {
    const r = validateUserInput('a'.repeat(MAX_LEN + 1));
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/under/);
  });
});

describe('validateMessages', () => {
  it('accepts well-formed messages', () => {
    expect(validateMessages([{ role: 'user', content: 'hi' }])).toEqual([{ role: 'user', content: 'hi' }]);
  });
  it.each([
    ['not an array', 'x'],
    ['empty array', []],
    ['bad role', [{ role: 'system', content: 'hi' }]],
    ['empty content', [{ role: 'user', content: ' ' }]],
    ['too many', Array.from({ length: 31 }, () => ({ role: 'user', content: 'a' }))],
  ])('rejects %s', (_n, input) => {
    expect(validateMessages(input)).toBeNull();
  });
});
