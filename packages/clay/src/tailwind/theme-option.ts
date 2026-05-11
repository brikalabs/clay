/**
 * Resolves the `theme` option passed to the Clay Tailwind plugin.
 * Strings are either a JSON-file path or a bundled-preset name;
 * objects pass through unchanged.
 */

import { readFileSync } from 'node:fs';
import { isAbsolute, resolve as resolvePath } from 'node:path';

import * as PRESETS from '../themes/presets';
import type { ThemeConfig } from '../themes/types';

/**
 * `option` is treated as a JSON-file path when it ends in `.json` or
 * starts with a path-ish prefix; everything else is interpreted as a
 * bundled-preset name. The two namespaces don't overlap (preset names
 * match `[a-z]+`), so a single string lets the CSS-first `@plugin`
 * options syntax express both authoring modes.
 */
function looksLikePath(option: string): boolean {
  return (
    option.endsWith('.json') ||
    option.startsWith('./') ||
    option.startsWith('../') ||
    isAbsolute(option)
  );
}

function loadThemeFromFile(filePath: string): ThemeConfig {
  const absolute = isAbsolute(filePath) ? filePath : resolvePath(process.cwd(), filePath);
  let contents: string;
  try {
    contents = readFileSync(absolute, 'utf8');
  } catch (cause) {
    throw new Error(
      `@brika/clay: failed to read theme file "${filePath}" (resolved to "${absolute}"): ${(cause as Error).message}`
    );
  }
  try {
    return JSON.parse(contents) as ThemeConfig;
  } catch (cause) {
    throw new Error(
      `@brika/clay: theme file "${absolute}" is not valid JSON: ${(cause as Error).message}`
    );
  }
}

/**
 * Resolve the `theme` option to a `ThemeConfig`. Strings are
 * interpreted as a JSON-file path or a bundled-preset name (via
 * `looksLikePath`); objects pass through unchanged. Throws on an
 * unknown preset name or an unreadable / malformed JSON file so
 * misconfiguration fails fast at build time.
 */
export function resolveThemeOption(
  option: string | ThemeConfig | undefined
): ThemeConfig | undefined {
  if (!option) return undefined;
  if (typeof option !== 'string') return option;
  if (looksLikePath(option)) {
    return loadThemeFromFile(option);
  }
  const presets = PRESETS as unknown as Readonly<Record<string, ThemeConfig>>;
  const preset = presets[option];
  if (!preset) {
    const known = Object.keys(presets).sort((a, b) => a.localeCompare(b)).join(', ');
    throw new Error(
      `@brika/clay: unknown theme preset "${option}". Known presets: ${known}. Pass a path ending in ".json" (or starting with "./", "../", or "/") to load your own theme file.`
    );
  }
  return preset;
}
