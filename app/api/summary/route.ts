import { guard } from '@/lib/guard';
import { callLLM } from '@/lib/llm';
import { SUMMARY_PROMPT } from '@/lib/prompts';
import { extractJson, normalizeSummary } from '@/lib/summary';

export async function POST(req: Request) {
  const checked = await guard(req);
  if ('response' in checked) return checked.response;

  const transcript = checked.messages
    .map((m) => `${m.role === 'user' ? 'Patient' : 'Assistant'}: ${m.content}`)
    .join('\n');

  try {
    const upstream = await callLLM(
      [{ role: 'system', content: SUMMARY_PROMPT }, { role: 'user', content: `Transcript:\n${transcript}` }],
      { stream: false, json: true },
    );
    if (!upstream.ok) return Response.json({ error: 'The AI service is unavailable. Try again shortly.' }, { status: 502 });
    const data = await upstream.json();
    const summary = normalizeSummary(extractJson(data.choices?.[0]?.message?.content ?? ''));
    return Response.json({ summary });
  } catch {
    return Response.json({ error: 'Could not build the summary. Try again.' }, { status: 502 });
  }
}
