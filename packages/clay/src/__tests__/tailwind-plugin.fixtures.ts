/**
 * Shared helpers, fixtures, and the mocked Tailwind plugin context for
 * the tailwind-plugin test split. Extracted so each describe-level
 * suite can live in its own file under 300 lines while sharing the
 * same plumbing.
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { compile } from 'tailwindcss';

import clayTailwindPlugin, {
  __internal,
  type ClayTailwindOptions,
} from '../tailwind';
import type { ResolvedTokenSpec } from '../tokens/types';

export const { buildContributions, scanVarRefs } = __internal;

// Convenience slices over the fused builder for suites that only care
// about one shard of the contribution shape.
export function buildBaseRules(
  registry: readonly ResolvedTokenSpec[],
  shorthandRefs: ReadonlySet<string> = new Set()
) {
  return buildContributions(registry, shorthandRefs).base;
}

export function buildThemeExtend(registry: readonly ResolvedTokenSpec[]) {
  return buildContributions(registry).themeExtend;
}

export function buildRootMembership(
  registry: readonly ResolvedTokenSpec[],
  shorthandRefs: ReadonlySet<string> = new Set()
) {
  return buildContributions(registry, shorthandRefs).rootMembership;
}

// ─── Mock plugin context ─────────────────────────────────────────────

export interface MatchUtilitiesCall {
  readonly utilities: Record<
    string,
    (value: string, modifier?: { modifier: string | null }) => unknown
  >;
  readonly options?: {
    readonly values?: Readonly<Record<string, string>>;
  };
}

export interface AddBaseCall {
  readonly rules: Readonly<Record<string, unknown>>;
}

export function runHandler(options: ClayTailwindOptions = {}): {
  readonly matchUtilitiesCalls: readonly MatchUtilitiesCall[];
  readonly addBaseCalls: readonly AddBaseCall[];
} {
  const matchUtilitiesCalls: MatchUtilitiesCall[] = [];
  const addBaseCalls: AddBaseCall[] = [];
  // The mock blows up if the plugin reaches for a non-JIT-aware API,
  // that's the whole point: addUtilities/addComponents emit
  // unconditionally in v4, and we MUST avoid them for shorthand rules.
  const api: unknown = {
    addBase(rules: Record<string, unknown>) {
      addBaseCalls.push({ rules });
    },
    matchUtilities(
      utilities: MatchUtilitiesCall['utilities'],
      options?: MatchUtilitiesCall['options']
    ) {
      matchUtilitiesCalls.push({ utilities, options });
    },
    addUtilities() {
      throw new Error(
        'addUtilities() is not JIT-aware in Tailwind v4, the plugin must use matchUtilities() instead.'
      );
    },
    addComponents() {
      throw new Error(
        'addComponents() is not JIT-aware in Tailwind v4, the plugin must use matchUtilities() instead.'
      );
    },
  };
  const { handler } = (clayTailwindPlugin as unknown as (
    options: ClayTailwindOptions
  ) => { handler: (api: unknown) => void })(options);
  handler(api);
  return { matchUtilitiesCalls, addBaseCalls };
}

export function findRule(
  addBaseCalls: readonly AddBaseCall[],
  selector: string
): Record<string, string> {
  for (const call of addBaseCalls) {
    if (selector in call.rules) {
      return call.rules[selector] as Record<string, string>;
    }
  }
  throw new Error(`addBase was not called with selector "${selector}"`);
}

export function maybeFindRule(
  addBaseCalls: readonly AddBaseCall[],
  selector: string
): Record<string, string> | undefined {
  for (const call of addBaseCalls) {
    if (selector in call.rules) {
      return call.rules[selector] as Record<string, string>;
    }
  }
  return undefined;
}

export function mkToken(
  spec: Partial<ResolvedTokenSpec> & Pick<ResolvedTokenSpec, 'name'>
): ResolvedTokenSpec {
  return {
    layer: 'component',
    appliesTo: spec.name.split('-')[0],
    category: 'color',
    type: 'color',
    defaultLight: 'red',
    description: 'test',
    ...spec,
  } as ResolvedTokenSpec;
}

// ─── End-to-end Tailwind v4 compile, true JIT pruning ────────────────

export const HERE = dirname(new URL(import.meta.url).pathname);
export const SRC = resolve(HERE, '..');
// Tailwind lives at the workspace root in a hoisted node_modules layout.
// HERE = packages/clay/src/__tests__, so jump up four to reach the root.
export const TAILWIND_DIR = resolve(HERE, '../../../../node_modules/tailwindcss');

async function loadStylesheet(id: string, base: string) {
  if (id === 'tailwindcss') {
    const path = resolve(TAILWIND_DIR, 'index.css');
    return { path, base: dirname(path), content: readFileSync(path, 'utf8') };
  }
  if (id.startsWith('tailwindcss/')) {
    const path = resolve(TAILWIND_DIR, `${id.slice('tailwindcss/'.length)}.css`);
    return { path, base: dirname(path), content: readFileSync(path, 'utf8') };
  }
  if (id.startsWith('./') || id.startsWith('../')) {
    const path = resolve(base, id);
    return { path, base: dirname(path), content: readFileSync(path, 'utf8') };
  }
  throw new Error(`unsupported @import in test: ${id}`);
}

export async function buildCss(candidates: readonly string[]): Promise<string> {
  const input = `
    @import "tailwindcss";
    @plugin "./tailwind";
  `;
  const compiled = await compile(input, {
    base: SRC,
    loadModule: async (id, base, type) => {
      if (type === 'plugin') {
        return { module: clayTailwindPlugin, base };
      }
      throw new Error(`unexpected loadModule call: ${id} (${type})`);
    },
    loadStylesheet,
  });
  return compiled.build(candidates as string[]);
}
