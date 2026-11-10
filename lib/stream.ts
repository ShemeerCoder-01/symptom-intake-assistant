/** Extracts the text delta from one line of an OpenAI-style server-sent-events stream. */
export function parseSseLine(line: string): string {
  const t = line.trim();
  if (!t.startsWith('data:')) return '';
  const data = t.slice(5).trim();
  if (!data || data === '[DONE]') return '';
  try {
    return JSON.parse(data).choices?.[0]?.delta?.content ?? '';
  } catch {
    return '';
  }
}

/** Turns the provider's SSE stream into a plain text stream for the browser. */
export function toTextStream(body: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = '';
  return body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          const text = parseSseLine(line);
          if (text) controller.enqueue(encoder.encode(text));
        }
      },
    }),
  );
}
