/**
 * Standalone performance benchmark for the `cn` primitive.
 *
 * Run with:
 *
 *   bun run bench:cn
 *   # or, directly:
 *   bun packages/clay/src/primitives/__tests__/cn.bench.ts
 *
 * `cn` runs on every Clay component render and on every Tailwind
 * conflict the consumer creates, so the cost matters in render-heavy
 * trees. The bench targets four shapes representative of real
 * component bodies:
 *
 *   - tiny       : 2 string literals (the typical render-prop case)
 *   - mixed      : strings + objects + arrays (variants + class merge)
 *   - conflict   : Tailwind-conflict resolution (last-wins)
 *   - large      : 20+ classes (chart / data-table-style components)
 */

import { cn } from '../cn';

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
    const batch = 1000;
    for (let i = 0; i < batch; i++) fn();
    samples += batch;
    elapsed = performance.now() - start;
  }
  const usPerOp = (elapsed * 1000) / samples;
  const opsPerSec = (samples * 1000) / elapsed;
  return { label, usPerOp, opsPerSec, samples };
}

function format(result: BenchResult): string {
  const us = result.usPerOp.toFixed(3).padStart(8);
  const ops = Math.round(result.opsPerSec).toLocaleString().padStart(11);
  return `  ${result.label.padEnd(46)} ${us} µs/op  ${ops} ops/sec`;
}

console.log('Clay cn() primitive benchmarks');

let sink = '';
console.log(format(bench('cn (2 strings, "tiny")', () => {
  sink = cn('px-2 py-1', 'rounded-sm');
})));

console.log(format(bench('cn (strings + object + array, "mixed")', () => {
  sink = cn(
    'base',
    ['flex', 'items-center'],
    { 'text-red-500': true, 'opacity-50': false },
    'gap-2'
  );
})));

console.log(format(bench('cn (Tailwind conflict, "conflict")', () => {
  sink = cn('px-2 py-1 text-sm', 'px-4 py-2 text-base');
})));

console.log(format(bench('cn (20 classes, "large")', () => {
  sink = cn(
    'flex',
    'items-center',
    'gap-2',
    'rounded-md',
    'border',
    'border-input',
    'bg-background',
    'px-3',
    'py-1',
    'text-sm',
    'shadow-sm',
    'transition-colors',
    'placeholder:text-muted',
    'focus-visible:outline-none',
    'focus-visible:ring-1',
    'disabled:cursor-not-allowed',
    'disabled:opacity-50',
    'aria-invalid:ring-destructive/20',
    'aria-invalid:border-destructive',
    'data-[state=open]:bg-accent'
  );
})));

// Anchor the sink so the JIT can't elide the work.
console.log(`  (sink length: ${sink.length})`);
console.log();
