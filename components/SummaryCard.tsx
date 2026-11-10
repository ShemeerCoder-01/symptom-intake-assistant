'use client';
import { useState } from 'react';
import { IntakeSummary, summaryToText } from '@/lib/summary';

const shell = 'border-l-4 border-sea bg-white p-5 shadow-sm lg:sticky lg:top-6 lg:self-start';

export default function SummaryCard({ summary, loading }: { summary: IntakeSummary | null; loading: boolean }) {
  const [copied, setCopied] = useState(false);

  if (loading) {
    return (
      <aside className={shell} aria-busy="true">
        <h2 className="font-display text-xl font-bold">Doctor summary</h2>
        <p className="mt-2 text-ink/70">Preparing the summary…</p>
      </aside>
    );
  }
  if (!summary) {
    return (
      <aside className={shell}>
        <h2 className="font-display text-xl font-bold">Doctor summary</h2>
        <p className="mt-2 text-ink/70">
          Answer a few questions, then choose “Create doctor summary”. The structured summary appears here.
        </p>
      </aside>
    );
  }

  const rows: [string, string][] = [
    ['Main complaint', summary.chiefComplaint],
    ['Duration', summary.duration],
    ['Severity', summary.severity],
    ['Other symptoms', summary.associatedSymptoms.join(', ') || 'Not provided'],
    ['Relevant history', summary.history],
    ['Medications', summary.medications],
    ['Allergies', summary.allergies],
  ];

  async function copy() {
    await navigator.clipboard.writeText(summaryToText(summary!));
    setCopied(true);
  }

  return (
    <aside className={shell}>
      <h2 className="font-display text-xl font-bold">Doctor summary</h2>
      {summary.redFlags.length > 0 && (
        <div role="alert" className="mt-3 border-l-4 border-red-700 bg-red-50 p-3 text-sm text-red-900">
          <p className="font-semibold">Needs attention</p>
          <ul className="list-disc pl-5">
            {summary.redFlags.map((f) => <li key={f}>{f}</li>)}
          </ul>
        </div>
      )}
      <dl className="mt-4 space-y-3">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt className="text-sm font-semibold text-sea">{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <button onClick={copy} className="mt-5 rounded-md border border-ink/30 px-3 py-1.5 text-sm font-semibold hover:bg-paper">
        {copied ? 'Copied' : 'Copy summary'}
      </button>
    </aside>
  );
}
