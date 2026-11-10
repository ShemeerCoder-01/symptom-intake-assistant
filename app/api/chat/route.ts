import { guard } from '@/lib/guard';
import { callLLM } from '@/lib/llm';
import { SYSTEM_PROMPT } from '@/lib/prompts';
import { toTextStream } from '@/lib/stream';

export async function POST(req: Request) {
  const checked = await guard(req);
  if ('response' in checked) return checked.response;

  try {
    const upstream = await callLLM([{ role: 'system', content: SYSTEM_PROMPT }, ...checked.messages], { stream: true });
    if (!upstream.ok || !upstream.body) {
      return Response.json({ error: 'The AI service is unavailable. Try again shortly.' }, { status: 502 });
    }
    return new Response(toTextStream(upstream.body), {
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  } catch {
    return Response.json({ error: 'Could not reach the AI service.' }, { status: 502 });
  }
}
