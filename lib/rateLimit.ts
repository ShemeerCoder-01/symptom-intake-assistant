// Best-effort limiter (in memory, per server instance). Protects your free API quota from casual abuse.
const hits = new Map<string, number[]>();

export function rateLimited(key: string, limit = 20, windowMs = 60_000, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > limit;
}
