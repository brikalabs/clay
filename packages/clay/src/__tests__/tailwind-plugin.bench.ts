/**
 * Standalone performance benchmark for the Tailwind plugin builders.
 *
 * Run with:
 *
 *   bun run bench
 *   # or, directly:
 *   bun src/__tests__/tailwind-plugin.bench.ts
 *
 * This file is NOT a regular test, it's executed as a script. The `*.bench.ts`
 * suffix stops `bun test` from picking it up (we exclude that pattern in
 * `bunfig.toml`'s test config). Performance regression GUARDS live in
 * `tailwind-plugin.test.ts` as `expect(...).toBeLessThan(...)` assertions
 * so they break CI on regression; this file is for human-readable
 * exploration.
 */

import clayTailwindPlugin, { __internal } from '../tailwind';
import { TOKEN_REGISTRY } from '../tokens/registry';
import { SHORTHAND_INDEX, buildShorthandIndex } from '../tokens/shorthands';

const { buildContributions, scanVarRefs } = __internal;

interface BenchResult {
  readonly label: string;
  readonly opsPerSec: number;
  readonly usPerOp: number;
  readonly samples: number;
}

/**
 * Adaptive benchmark, runs `fn` for at least `minDurationMs` so noise
 * averages out on fast operations. Returns ops/sec + µs/op.
 */
function bench(label: string, fn: () => void, minDurationMs = 200): BenchResult {
  // Warm up V8 so first-iter compile cost doesn't skew the result.
  for (let i = 0; i < 100; i++) fn();

  let samples = 0;
  const start = performance.now();
  let elapsed = 0;
  while (elapsed < minDurationMs) {
    const batch = 100;
    for (let i = 0; i < batch; i++) fn();
    samples += batch;
    elapsed = performance.now() - start;
  }
  const usPerOp = (elapsed * 1000) / samples;
  const opsPerSec = (samples * 1000) / elapsed;
  return { label, usPerOp, opsPerSec, samples };
}

function format(result: BenchResult): string {
  const us = result.usPerOp.toFixed(2).padStart(8);
  const ops = Math.round(result.opsPerSec).toLocaleString().padStart(11);
  return `  ${result.label.padEnd(46)} ${us} µs/op  ${ops} ops/sec`;
}

function section(title: string): void {
  console.log(`\n── ${title} ${'─'.repeat(Math.max(0, 60 - title.length))}`);
}

const REF_REGEX = /var\(--([a-z][a-z0-9-]*)/g;
const cascadeSamples = TOKEN_REGISTRY.flatMap((t) =>
  t.defaultDark ? [t.defaultLight, t.defaultDark] : [t.defaultLight]
);

console.log(`Clay Tailwind plugin benchmarks`);
console.log(`registry: ${TOKEN_REGISTRY.length} tokens, ${cascadeSamples.length} default expressions`);

section('Single registry walk');
console.log(format(bench('buildContributions (fused, full pipeline)',
  () => buildContributions(TOKEN_REGISTRY, SHORTHAND_INDEX.tokenRefs))));
console.log(format(bench('buildShorthandIndex',
  () => buildShorthandIndex(TOKEN_REGISTRY))));

section('Cascade scanner (var(--name) refs)');
console.log(format(bench('regex matchAll over 627 defaults', () => {
  for (const s of cascadeSamples) {
    for (const _ of s.matchAll(REF_REGEX)) {
      /* drain */
    }
  }
})));
console.log(format(bench('scanVarRefs (indexOf walker)', () => {
  for (const s of cascadeSamples) {
    scanVarRefs(s, () => {});
  }
})));

section('Plugin handler invocation');
console.log(format(bench('plugin.handler(api)', () => {
  let _: unknown;
  const api = {
    addBase: (rules: Record<string, unknown>) => {
      _ = rules;
    },
    matchUtilities: (utils: Record<string, unknown>) => {
      _ = utils;
    },
  };
  // `plugin.withOptions` returns an options-function: invoke with no
  // overrides to get back the `{ handler, config }` pair, then run the
  // handler against the mock API.
  const { handler } = (clayTailwindPlugin as unknown as (
    options?: Record<string, unknown>
  ) => { handler: (api: unknown) => void })();
  handler(api);
  void _;
})));

console.log();
