/**
 * Shared synthetic data generator for chart demos. Lives here so the
 * sparkline demos and the axes demos don't ship two copies of the
 * same sin-wave generator.
 */

export const HOUR = 60 * 60 * 1000;
export const DAY = 24 * HOUR;

export function generate(
  points: number,
  intervalMs: number,
  seed: number,
  amplitude: number,
  drift: number
): Array<{ ts: number; value: number }> {
  const now = Date.now();
  return Array.from({ length: points }, (_, index) => ({
    ts: now - (points - 1 - index) * intervalMs,
    value: 30 + Math.sin(index / seed) * amplitude + index * drift,
  }));
}
