/**
 * Coverage for the `theme: ...` plugin option (build-time bake).
 * Verifies the preset / object / JSON-path entry points and the
 * error-shape contract for unknown presets and malformed files.
 */

import { describe, expect, test } from 'bun:test';

import { flattenTheme } from '../themes/flatten';
import * as PRESETS from '../themes/presets';
import type { ThemeConfig } from '../themes/types';
import { findRule, maybeFindRule, runHandler } from './tailwind-plugin.fixtures';

const BAKED_ROOT = ':root';
const BAKED_DARK = ':is(.dark, [data-mode="dark"]):root';

describe('clayTailwindPlugin theme option', () => {
  test('default invocation emits no extra `:root` or runtime-style dark block', () => {
    const { addBaseCalls } = runHandler();
    expect(maybeFindRule(addBaseCalls, BAKED_ROOT)).toBeUndefined();
    expect(maybeFindRule(addBaseCalls, BAKED_DARK)).toBeUndefined();
  });

  test('preset name layers `flattenTheme(preset)` deltas onto :root after the registry defaults', () => {
    const { addBaseCalls } = runHandler({ theme: 'ocean' });
    const expected = flattenTheme(PRESETS.ocean as ThemeConfig);
    if (Object.keys(expected.rootVars).length === 0) {
      // Defensive guard, ocean always contributes overrides today.
      throw new Error('expected ocean to contribute root-var overrides');
    }
    const baked = findRule(addBaseCalls, BAKED_ROOT);
    for (const [k, v] of Object.entries(expected.rootVars)) {
      expect(baked[k]).toBe(v);
    }
    // Cascade order check: the registry-defaults block must precede the
    // baked overrides in the merged addBase payload so the override wins.
    const merged = Object.assign({}, ...addBaseCalls.map((c) => c.rules));
    const keys = Object.keys(merged);
    const registryIdx = keys.indexOf(':root, [data-theme="clay"]');
    const bakedIdx = keys.indexOf(BAKED_ROOT);
    expect(registryIdx).toBeGreaterThanOrEqual(0);
    expect(bakedIdx).toBeGreaterThan(registryIdx);
  });

  test('preset name with dark deltas emits the runtime-shaped dark selector', () => {
    const { addBaseCalls } = runHandler({ theme: 'ocean' });
    const expected = flattenTheme(PRESETS.ocean as ThemeConfig);
    if (Object.keys(expected.darkVars).length === 0) {
      // Theme has no dark deltas, plugin must NOT emit an empty block.
      expect(maybeFindRule(addBaseCalls, BAKED_DARK)).toBeUndefined();
      return;
    }
    const baked = findRule(addBaseCalls, BAKED_DARK);
    for (const [k, v] of Object.entries(expected.darkVars)) {
      expect(baked[k]).toBe(v);
    }
  });

  test('ThemeConfig object is accepted directly (JS-config flow)', () => {
    const inline: ThemeConfig = {
      name: 'inline-test',
      colors: { light: { primary: 'rebeccapurple' } },
    };
    const { addBaseCalls } = runHandler({ theme: inline });
    const baked = findRule(addBaseCalls, BAKED_ROOT);
    expect(baked['--primary']).toBe('rebeccapurple');
    // flatten emits the `--color-*` alias too, so both forms must land.
    expect(baked['--color-primary']).toBe('rebeccapurple');
  });

  test('JSON file path is loaded and parsed at build time', async () => {
    const { mkdtempSync, writeFileSync } = await import('node:fs');
    const { join } = await import('node:path');
    const { tmpdir } = await import('node:os');
    const dir = mkdtempSync(join(tmpdir(), 'clay-theme-'));
    const file = join(dir, 'my-theme.json');
    const config: ThemeConfig = {
      name: 'file-test',
      colors: { light: { primary: 'tomato' } },
    };
    writeFileSync(file, JSON.stringify(config), 'utf8');
    const { addBaseCalls } = runHandler({ theme: file });
    const baked = findRule(addBaseCalls, BAKED_ROOT);
    expect(baked['--primary']).toBe('tomato');
  });

  test('unknown preset name throws a list of valid names', () => {
    expect(() => runHandler({ theme: 'nope-not-a-preset' })).toThrow(/Known presets/);
  });

  test('unreadable JSON path throws a clear error mentioning the resolved path', () => {
    expect(() => runHandler({ theme: './does-not-exist.json' })).toThrow(
      /failed to read theme file/
    );
  });

  test('malformed JSON file throws a clear "not valid JSON" error', async () => {
    const { mkdtempSync, writeFileSync } = await import('node:fs');
    const { join } = await import('node:path');
    const { tmpdir } = await import('node:os');
    const dir = mkdtempSync(join(tmpdir(), 'clay-theme-bad-'));
    const file = join(dir, 'broken.json');
    writeFileSync(file, '{ this is not json }', 'utf8');
    expect(() => runHandler({ theme: file })).toThrow(/is not valid JSON/);
  });

  test('does not interfere with the matchUtilities passes (utility coverage unchanged)', () => {
    const baseline = runHandler();
    const themed = runHandler({ theme: 'ocean' });
    expect(themed.matchUtilitiesCalls.length).toBe(baseline.matchUtilitiesCalls.length);
  });
});
