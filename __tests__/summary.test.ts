import { extractJson, normalizeSummary, summaryToText } from '@/lib/summary';

it('fills missing fields with defaults', () => {
  const s = normalizeSummary({ chiefComplaint: 'Headache', associatedSymptoms: ['nausea', 5, ''] });
  expect(s.chiefComplaint).toBe('Headache');
  expect(s.duration).toBe('Not provided');
  expect(s.associatedSymptoms).toEqual(['nausea']);
  expect(s.redFlags).toEqual([]);
});

it('survives garbage input', () => {
  expect(normalizeSummary(null).allergies).toBe('Not provided');
});

it('extracts JSON wrapped in code fences', () => {
  expect(extractJson('```json\n{"a":1}\n```')).toEqual({ a: 1 });
});

it('throws when there is no JSON', () => {
  expect(() => extractJson('sorry')).toThrow();
});

it('formats the summary as text', () => {
  expect(summaryToText(normalizeSummary({ chiefComplaint: 'Cough' }))).toContain('Main complaint: Cough');
});
