import { ChatMessage, validateMessages } from './validation';
import { rateLimited } from './rateLimit';

const fail = (error: string, status: number) => ({ response: Response.json({ error }, { status }) });

export async function guard(req: Request): Promise<{ messages: ChatMessage[] } | { response: Response }> {
  if (!process.env.LLM_API_KEY) return fail('Server is missing LLM_API_KEY. See the README.', 500);
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
  if (rateLimited(ip)) return fail('Too many requests. Wait a minute and try again.', 429);
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail('Request body must be JSON.', 400);
  }
  const messages = validateMessages((body as { messages?: unknown })?.messages);
  return messages ? { messages } : fail('Invalid message format.', 400);
}
