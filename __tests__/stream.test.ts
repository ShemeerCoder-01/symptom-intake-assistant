import { parseSseLine } from '@/lib/stream';

describe('parseSseLine', () => {
  it('returns the delta text', () => {
    expect(parseSseLine('data: {"choices":[{"delta":{"content":"Hi"}}]}')).toBe('Hi');
  });
  it.each(['data: [DONE]', '', ': keep-alive', 'data: {broken'])('ignores %p', (line) => {
    expect(parseSseLine(line)).toBe('');
  });
});
