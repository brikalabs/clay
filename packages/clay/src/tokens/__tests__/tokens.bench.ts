/**
 * Standalone performance benchmark for the token registry layer.
 *
 * Run with:
 *
 *   bun run bench:tokens
 *   # or, directly:
 *   bun packages/clay/src/tokens/__tests__/tokens.bench.ts
 *
 * Exercises:
 *   - inferTokenType        : name-based suffix/prefix/exact scan
 *   - inferTokenTypeFromValue: value-shape fallback (length / color / …)
 *   - defineComponent       : Layer-2 helper that components call at
 *                             module load to register their tokens
 *   - registry lookup map   : `TOKENS_BY_NAME` Map vs. linear scan
 */

import { defineComponent } from '../define';
import {
  inferTokenType,
  inferTokenTypeFromValue,
  inferTokenTypeStrict,
} from '../infer';
import { TOKEN_REGISTRY, TOKENS_BY_NAME } from '../registry';

interface BenchResult {
  readonly label: string;
  readonly opsPerSec: number;
  readonly usPerOp: number;
  readonly samples: number;
}

function bench(label: string, fn: () => void, minDurationMs = 200): BenchResult {
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

const tokenNames = TOKEN_REGISTRY.map((t) => t.name);
const tokenValues = TOKEN_REGISTRY.map((t) => t.defaultLight);
const valueShapes = ['1px', '12px', '1.5rem', '#abcdef', 'oklch(0.7 0.1 250)', 'solid', '200ms', 'cubic-bezier(0.4,0,0.2,1)', '0.5', 'whatever'];

console.log(`Clay token registry benchmarks`);
console.log(`registry: ${TOKEN_REGISTRY.length} tokens`);

section('Type inference');
console.log(format(bench(`inferTokenType (full registry, ${tokenNames.length} names)`, () => {
  for (const name of tokenNames) inferTokenType(name);
})));
console.log(format(bench('inferTokenTypeStrict (registry names)', () => {
  for (const name of tokenNames) inferTokenTypeStrict(name);
})));
console.log(format(bench('inferTokenTypeFromValue (registry default-light values)', () => {
  for (const value of tokenValues) inferTokenTypeFromValue(value);
})));
console.log(format(bench('inferTokenTypeFromValue (mixed shape sample)', () => {
  for (const value of valueShapes) inferTokenTypeFromValue(value);
})));

let lookupSink = 0;

section('Lookup');
console.log(format(bench('TOKENS_BY_NAME[name] (every registered name)', () => {
  for (const name of tokenNames) {
    if (TOKENS_BY_NAME[name]) lookupSink++;
  }
})));
console.log(format(bench('Array.find linear scan (every registered name)', () => {
  for (const name of tokenNames) {
    // Deliberate find-vs-map comparison: `.find` returns the spec to
    // mirror the dictionary path. Switching to `.some` would change
    // the measurement semantics, not just the linter happy.
    // NOSONAR: typescript:S7754
    if (TOKEN_REGISTRY.find((t) => t.name === name)) lookupSink++;
  }
})));
// Prevent the JIT from collapsing the loops away once `lookupSink` is
// unobservable — print after the timed section so reads stay live.
console.log(`  (sink: ${lookupSink} resolved lookups)`);

section('defineComponent');
console.log(format(bench('defineComponent (small spec, 4 slots)', () => {
  defineComponent('bench-c', {
    radius: { default: '0.5rem', description: 'r' },
    padding: { x: '0.5rem', y: '0.25rem' },
    fill: { default: 'oklch(0.7 0.1 250)', description: 'f' },
    label: { default: 'currentColor', description: 'l' },
  });
})));

console.log();
