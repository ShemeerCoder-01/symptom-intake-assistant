'use client';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { ChatMessage, MAX_LEN, validateUserInput } from '@/lib/validation';
import type { IntakeSummary } from '@/lib/summary';
import SummaryCard from './SummaryCard';

const GREETING: ChatMessage = {
  role: 'assistant',
  content: "Hi, I'll collect a few details before your consultation. I can't diagnose or give medical advice. What symptom is bothering you most?",
};

async function errorFrom(res: Response): Promise<string> {
  try {
    return (await res.json()).error ?? 'Something went wrong.';
  } catch {
    return 'Something went wrong.';
  }
}

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<IntakeSummary | null>(null);
  const [summarizing, setSummarizing] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const answers = messages.filter((m) => m.role === 'user').length;

  useEffect(() => {
    endRef.current?.scrollIntoView?.({ behavior: 'smooth' });
  }, [messages]);

  async function send(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    const check = validateUserInput(input);
    if (!check.valid) return setError(check.error!);

    setError(null);
    setSummary(null);
    const history: ChatMessage[] = [...messages, { role: 'user', content: check.value }];
    setMessages([...history, { role: 'assistant', content: '' }]);
    setInput('');
    setBusy(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok || !res.body) throw new Error(await errorFrom(res));
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = '';
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        setMessages([...history, { role: 'assistant', content: text }]);
      }
      if (!text) throw new Error('The assistant returned an empty reply. Send your message again.');
    } catch (err) {
      setMessages(history);
      setError(err instanceof Error ? err.message : 'Network error. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  async function makeSummary() {
    setSummarizing(true);
    setError(null);
    try {
      const res = await fetch('/api/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });
      if (!res.ok) throw new Error(await errorFrom(res));
      setSummary((await res.json()).summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not build the summary.');
    } finally {
      setSummarizing(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <section aria-label="Conversation" className="flex h-[70vh] min-h-[480px] flex-col rounded-xl border border-ink/15 bg-white">
        <div role="log" aria-live="polite" className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.map((m, i) => (
            <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
              <p className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2 leading-relaxed ${m.role === 'user' ? 'bg-ink text-white' : 'bg-paper'}`}>
                {m.content || 'Typing…'}
              </p>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        {error && (
          <p role="alert" className="mx-4 mb-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>
        )}
        <form onSubmit={send} className="flex gap-2 border-t border-ink/10 p-3">
          <input
            aria-label="Your message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={busy}
            placeholder="Type your answer"
            className="min-w-0 flex-1 rounded-md border border-ink/25 px-3 py-2 disabled:bg-paper"
          />
          <button type="submit" disabled={busy} className="rounded-md bg-sea px-4 py-2 font-semibold text-white disabled:opacity-50">
            Send
          </button>
        </form>
        <div className="flex items-center justify-between border-t border-ink/10 px-3 py-2 text-sm">
          <span className={input.length > MAX_LEN ? 'text-red-700' : 'text-ink/60'}>{input.length}/{MAX_LEN}</span>
          <button
            onClick={makeSummary}
            disabled={answers < 2 || busy || summarizing}
            className="rounded-md border border-sea px-3 py-1.5 font-semibold text-sea disabled:cursor-not-allowed disabled:opacity-40"
          >
            Create doctor summary
          </button>
        </div>
      </section>
      <SummaryCard summary={summary} loading={summarizing} />
    </div>
  );
}
