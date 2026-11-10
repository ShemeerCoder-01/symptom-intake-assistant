import Chat from '@/components/Chat';

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <header className="mb-8 max-w-2xl">
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">Symptom intake assistant</h1>
        <p className="mt-3 text-lg leading-relaxed">
          Describe what you are feeling. The assistant asks follow-up questions, then prepares a one-page summary for your doctor.
        </p>
        <p className="mt-2 text-sm text-ink/70">
          It does not diagnose or give medical advice. In an emergency, call your local emergency number.
        </p>
      </header>
      <Chat />
    </main>
  );
}
