/**
 * Docs-side composition of the component catalogue.
 *
 * Everything is auto-discovered via import.meta.glob — no hardcoded lists:
 *
 *   src/components/<slug>/meta.ts          → component identity, group, description, externalDocs
 *   src/components/<slug>/<slug>.demos.tsx → runnable demos, demoMeta, accessibility, tokens
 *
 * Adding a new component requires zero edits here. Drop a folder with
 * `meta.ts` and optionally a `*.demos.tsx` and both are picked up at
 * the next build.
 */

import type { ComponentDemo, ComponentGroup, ComponentMeta, DemoInput, ExternalDoc } from '@brika/clay';

export type { ComponentGroup } from '@brika/clay';

// ─── Component meta (name, displayName, group, description, externalDocs) ────

interface MetaModule {
  readonly meta: ComponentMeta;
}

const metaModules = import.meta.glob<MetaModule>(
  '../../../src/components/*/meta.ts',
  { eager: true }
);

const CLAY_COMPONENTS: readonly ComponentMeta[] = Object.values(metaModules)
  .map((m) => m.meta)
  .sort((a, b) => a.name.localeCompare(b.name));

// ─── Demo modules (functions + demoMeta + accessibility + tokens) ─────────────

interface DemosModule {
  readonly demoMeta?: readonly DemoInput[];
  readonly accessibility?: readonly string[];
  readonly tokens?: readonly string[];
  readonly [exportName: string]: unknown;
}

const demosModules = import.meta.glob<DemosModule>(
  '../../../src/components/*/*.demos.tsx',
  { eager: true }
);

// Raw source text for code-snippet auto-extraction.
const demoSources = import.meta.glob<string>(
  '../../../src/components/*/*.demos.tsx',
  { eager: true, query: '?raw', import: 'default' }
);

function slugFromPath(path: string): string {
  return /\/components\/([a-z0-9-]+)\/[^/]+\.demos\.tsx$/.exec(path)?.[1] ?? '';
}

const DEMOS_BY_SLUG = new Map<string, DemosModule>(
  Object.entries(demosModules).map(([path, mod]) => [slugFromPath(path), mod])
);

const SOURCES_BY_SLUG = new Map<string, string>(
  Object.entries(demoSources).map(([path, src]) => [slugFromPath(path), src])
);

// ─── Source code extraction ────────────────────────────────────────────────────

/** Strip the common leading whitespace from every non-empty line (like Python's textwrap.dedent). */
function dedent(code: string): string {
  const lines = code.split('\n');
  const indent = lines
    .filter((l) => l.trim().length > 0)
    .reduce((min, l) => {
      const spaces = l.match(/^(\s*)/)?.[1].length ?? 0;
      return Math.min(min, spaces);
    }, Infinity);
  if (indent === Infinity || indent === 0) return code;
  return lines.map((l) => l.slice(indent)).join('\n');
}

/** Extract the JSX from the return statement of a named function in source text. */
function extractDemoCode(source: string, fnName: string): string {
  const fnIdx = source.indexOf(`function ${fnName}`);
  if (fnIdx === -1) return '';
  const braceIdx = source.indexOf('{', fnIdx);
  if (braceIdx === -1) return '';
  // Extract function body with balanced-brace walking
  let depth = 1;
  let i = braceIdx + 1;
  while (i < source.length && depth > 0) {
    if (source[i] === '{') depth++;
    else if (source[i] === '}') depth--;
    i++;
  }
  const body = source.slice(braceIdx + 1, i - 1).trim();
  // Find the last `return (` and extract the balanced parentheses content
  const lastReturnParen = body.lastIndexOf('return (');
  if (lastReturnParen !== -1) {
    let d = 0, j = lastReturnParen + 7, start = -1;
    while (j < body.length) {
      if (body[j] === '(') { if (d === 0) start = j + 1; d++; }
      else if (body[j] === ')') { d--; if (d === 0) return dedent(body.slice(start, j)); }
      j++;
    }
  }
  // Fallback: single-expression return
  const lastReturn = body.lastIndexOf('return ');
  if (lastReturn !== -1) {
    return dedent(body.slice(lastReturn + 7).replace(/;\s*$/, ''));
  }
  return dedent(body);
}

/** Resolve a DemoInput to a full ComponentDemo, auto-filling code from source if absent. */
function resolveDemo(input: DemoInput, source: string): ComponentDemo {
  return {
    name: input.name,
    title: input.title,
    description: input.description,
    code: input.code ?? extractDemoCode(source, input.name),
  };
}

// ─── Public types ─────────────────────────────────────────────────────────────

export type { ComponentDemo, ExternalDoc };

export interface ComponentDocs {
  readonly demos: readonly ComponentDemo[];
  readonly accessibility?: readonly string[];
  readonly tokens?: readonly string[];
  readonly externalDocs?: readonly ExternalDoc[];
}

export interface ComponentEntry extends ComponentMeta, ComponentDocs {
  readonly slug: string;
  readonly name: string;
  readonly externalDocs: readonly ExternalDoc[];
}

// ─── Composed entries ─────────────────────────────────────────────────────────

const ENTRIES: readonly ComponentEntry[] = CLAY_COMPONENTS.map((meta) => {
  const mod = DEMOS_BY_SLUG.get(meta.name);
  const source = SOURCES_BY_SLUG.get(meta.name) ?? '';
  return {
    slug: meta.name,
    name: meta.displayName,
    displayName: meta.displayName,
    description: meta.description,
    group: meta.group,
    demos: (mod?.demoMeta ?? []).map((d) => resolveDemo(d, source)),
    accessibility: mod?.accessibility,
    tokens: mod?.tokens,
    externalDocs: meta.externalDocs ?? [],
  };
});

export const COMPONENTS: readonly ComponentEntry[] = ENTRIES;

export const COMPONENTS_BY_SLUG: Readonly<Record<string, ComponentEntry>> = Object.fromEntries(
  COMPONENTS.map((c) => [c.slug, c])
);

export const COMPONENT_GROUPS: readonly ComponentGroup[] = [
  'Primitives',
  'Forms',
  'Overlays',
  'Navigation',
  'Feedback',
  'Layout',
  'Data',
];

export function componentsInGroup(group: ComponentGroup): readonly ComponentEntry[] {
  return COMPONENTS.filter((c) => c.group === group);
}

export function adjacentComponents(slug: string): {
  readonly previous: ComponentEntry | null;
  readonly next: ComponentEntry | null;
} {
  const index = COMPONENTS.findIndex((c) => c.slug === slug);
  if (index === -1) {
    return { previous: null, next: null };
  }
  return {
    previous: index > 0 ? (COMPONENTS[index - 1] ?? null) : null,
    next: index < COMPONENTS.length - 1 ? (COMPONENTS[index + 1] ?? null) : null,
  };
}
