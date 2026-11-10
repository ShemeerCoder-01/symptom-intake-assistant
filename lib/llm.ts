export interface LLMMessage { role: 'system' | 'user' | 'assistant'; content: string }

export function callLLM(messages: LLMMessage[], opts: { stream: boolean; json?: boolean }) {
  const base = process.env.LLM_BASE_URL ?? 'https://api.groq.com/openai/v1';
  const model = process.env.LLM_MODEL ?? 'openai/gpt-oss-20b';
  return fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.LLM_API_KEY}` },
    body: JSON.stringify({
      model,
      messages,
      stream: opts.stream,
      temperature: opts.json ? 0 : 0.4,
      max_tokens: opts.json ? 1500 : 1000,
      ...(model.includes('gpt-oss') ? { reasoning_effort: 'low' } : {}),
      ...(opts.json ? { response_format: { type: 'json_object' } } : {}),
    }),
  });
}