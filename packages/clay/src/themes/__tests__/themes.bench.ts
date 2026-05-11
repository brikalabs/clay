/**
 * Standalone performance benchmark for the theme pipeline.
 *
 * Run with:
 *
 *   bun run bench:themes
 *   # or, directly:
 *   bun packages/clay/src/themes/__tests__/themes.bench.ts
 *
 * Exercises the hot paths used both at build time (Tailwind plugin bake)
 * and at runtime (`applyTheme`, scoped previews via `themeToCssVars`):
 *
 *   - flattenTheme              : per-theme overrides → flat var map
 *   - flattenThemeComplete      : registry defaults + theme overrides
 *   - renderThemeStyleSheet     : final `<style>` text for applyTheme
 *   - themeToCssVars            : per-scope inline CSSProperties bag
 *   - getRegistryDefaults       : cached registry → light/dark defaults
 */

import { themeToCssVars } from '../apply';
import {
  flattenTheme,
  flattenThemeComplete,
  getRegistryDefaults,
  renderThemeStyleSheet,
} from '../flatten';
import * as PRESETS from '../presets';
import type { ThemeConfig } from '../types';

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

const themes = Object.values(PRESETS) as ThemeConfig[];
const themeCount = themes.length;
console.log(`Clay theme pipeline benchmarks`);
console.log(`presets: ${themeCount}`);

section('Per-theme flatten');
console.log(format(bench('flattenTheme (overrides only)', () => {
  for (const theme of themes) flattenTheme(theme);
})));
console.log(format(bench('flattenThemeComplete (registry + overrides)', () => {
  for (const theme of themes) flattenThemeComplete(theme);
})));

section('Style-sheet emission');
console.log(format(bench('renderThemeStyleSheet (applyTheme path)', () => {
  for (const theme of themes) renderThemeStyleSheet(theme);
})));
console.log(format(bench('themeToCssVars (scoped-preview path)', () => {
  for (const theme of themes) themeToCssVars(theme, 'light');
})));

section('Registry default snapshot (cached)');
console.log(format(bench('getRegistryDefaults', () => {
  getRegistryDefaults();
})));

console.log();
