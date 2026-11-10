export type Role = 'user' | 'assistant';
export interface ChatMessage { role: Role; content: string }

export const MAX_LEN = 500;
export const MAX_MESSAGES = 30;

export function validateUserInput(raw: string): { valid: boolean; value: string; error?: string } {
  const value = raw.trim();
  if (!value) return { valid: false, value, error: 'Type a message before sending.' };
  if (value.length > MAX_LEN) {
    return { valid: false, value, error: `Keep messages under ${MAX_LEN} characters (now ${value.length}).` };
  }
  return { valid: true, value };
}

export function validateMessages(input: unknown): ChatMessage[] | null {
  if (!Array.isArray(input) || input.length === 0 || input.length > MAX_MESSAGES) return null;
  const out: ChatMessage[] = [];
  for (const m of input) {
    if (!m || typeof m !== 'object') return null;
    const { role, content } = m as Record<string, unknown>;
    if (role !== 'user' && role !== 'assistant') return null;
    if (typeof content !== 'string' || !content.trim() || content.length > 2000) return null;
    out.push({ role, content: content.trim() });
  }
  return out;
}
