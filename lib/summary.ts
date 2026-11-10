export interface IntakeSummary {
  chiefComplaint: string;
  duration: string;
  severity: string;
  associatedSymptoms: string[];
  history: string;
  medications: string;
  allergies: string;
  redFlags: string[];
}

const NOT_PROVIDED = 'Not provided';
const str = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : NOT_PROVIDED);
const list = (v: unknown) =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && x.trim() !== '').map((x) => x.trim()) : [];

export function normalizeSummary(raw: unknown): IntakeSummary {
  const o = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>;
  return {
    chiefComplaint: str(o.chiefComplaint),
    duration: str(o.duration),
    severity: str(o.severity),
    associatedSymptoms: list(o.associatedSymptoms),
    history: str(o.history),
    medications: str(o.medications),
    allergies: str(o.allergies),
    redFlags: list(o.redFlags),
  };
}

/** Pulls the first JSON object out of a model reply, even if wrapped in code fences. */
export function extractJson(text: string): unknown {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON found in model reply');
  return JSON.parse(match[0]);
}

export function summaryToText(s: IntakeSummary): string {
  return [
    `Main complaint: ${s.chiefComplaint}`,
    `Duration: ${s.duration}`,
    `Severity: ${s.severity}`,
    `Other symptoms: ${s.associatedSymptoms.join(', ') || NOT_PROVIDED}`,
    `Relevant history: ${s.history}`,
    `Medications: ${s.medications}`,
    `Allergies: ${s.allergies}`,
    `Needs attention: ${s.redFlags.join('; ') || 'None reported'}`,
  ].join('\n');
}
