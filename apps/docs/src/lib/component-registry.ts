/**
 * Docs-side composition of the component catalogue.
 *
 * Everything is auto-discovered via import.meta.glob, no hardcoded lists:
 *
 *   src/components/<slug>/meta.ts                  → identity, group, description,
 *                                                    externalDocs, accessibility
 *   src/components/<slug>/demos/<kebab>.demos.tsx  → one demo per file. Authors
 *                                                    write only imports + a JSDoc +
 *                                                    `export default function`.
 *
 * Per-demo conventions (zero-boilerplate):
 *   - Filename (kebab-case) → demo title via `titleFromKebab`. `default.demos.tsx`
 *     always sorts first; everything else is alphabetical.
 *   - Leading JSDoc → description shown in the docs page.
 *   - Optional `@title …` JSDoc tag overrides the auto-generated title
 *     for cases like `url` → "URL", `otp` → "OTP".
 */

import type { ComponentDemo, ComponentGroup, ComponentMeta, ExternalDoc } from '@brika/clay';
import { extractDemoMeta, titleFromKebab } from '@brika/clay-docgen';
import type { ComponentType } from 'react';

// ─── Component meta (name, displayName, group, description, externalDocs) ────

interface MetaModule {
  readonly meta: ComponentMeta;
}

const metaModules = import.meta.glob<MetaModule>(
  '~clay/components/*/meta.ts',
  { eager: true }
);

const CLAY_COMPONENTS: readonly ComponentMeta[] = Object.values(metaModules)
  .map((m) => m.meta)
  .sort((a, b) => a.name.localeCompare(b.name));

// ─── Demo modules (default export per file) ──────────────────────────

interface DemosModule {
  readonly default?: ComponentType<Record<string, never>>;
}

const demosModules = import.meta.glob<DemosModule>(
  '~clay/components/*/demos/*.demos.tsx',
  { eager: true }
);

// Raw source text — shown verbatim in the docs code block.
const demoSources = import.meta.glob<string>(
  '~clay/components/*/demos/*.demos.tsx',
  { eager: true, query: '?raw', import: 'default' }
);

const DEMO_PATH_RE = /\/components\/([a-z0-9-]+)\/demos\/([a-z0-9-]+)\.demos\.tsx$/;

interface DemoFile {
  readonly path: string;
  readonly slug: string;
  readonly kebab: string;
  readonly mod: DemosModule;
  readonly source: string;
}

const FILES_BY_SLUG = (() => {
  const out = new Map<string, DemoFile[]>();
  for (const [path, mod] of Object.entries(demosModules)) {
    const match = DEMO_PATH_RE.exec(path);
    if (!match) continue;
    const [, slug, kebab] = match;
    if (!slug || !kebab) continue;
    const files = out.get(slug) ?? [];
    files.push({ path, slug, kebab, mod, source: demoSources[path] ?? '' });
    out.set(slug, files);
  }
  for (const [slug, files] of out) {
    out.set(slug, [...files].sort(compareDemoFiles));
  }
  return out;
})();

/** `default.demos.tsx` always wins; rest is alphabetical by kebab name. */
function compareDemoFiles(a: DemoFile, b: DemoFile): number {
  if (a.kebab === 'default' && b.kebab !== 'default') return -1;
  if (b.kebab === 'default' && a.kebab !== 'default') return 1;
  return a.kebab.localeCompare(b.kebab);
}

function resolveDemo(file: DemoFile): ComponentDemo {
  const meta = extractDemoMeta(file.source);
  return {
    name: file.kebab,
    title: meta.title ?? titleFromKebab(file.kebab),
    description: meta.description,
    code: file.source.trimEnd(),
  };
}

// ─── Public types ────────────────────────────────────────────────

export interface ComponentDocs {
  readonly demos: readonly ComponentDemo[];
  readonly accessibility?: readonly string[];
  readonly externalDocs?: readonly ExternalDoc[];
}

export interface ComponentEntry extends ComponentMeta, ComponentDocs {
  readonly slug: string;
  readonly name: string;
  readonly externalDocs: readonly ExternalDoc[];
  /** True while the component is within the "New" badge window (see below). */
  readonly isNew: boolean;
}

/**
 * How long after a component's `added` date the sidebar keeps showing its
 * "New" badge. The window is evaluated at build time, so the badge appears
 * and disappears on its own as the site is rebuilt, no manual toggling.
 */
const NEW_BADGE_WINDOW_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

function isRecentlyAdded(added: string | undefined): boolean {
  if (!added) {
    return false;
  }
  const addedAt = Date.parse(added);
  if (Number.isNaN(addedAt)) {
    return false;
  }
  const ageDays = (Date.now() - addedAt) / DAY_MS;
  return ageDays >= 0 && ageDays <= NEW_BADGE_WINDOW_DAYS;
}

// ─── Composed entries ─────────────────────────────────────────────

const ENTRIES: readonly ComponentEntry[] = CLAY_COMPONENTS.map((meta) => ({
  slug: meta.name,
  name: meta.displayName,
  displayName: meta.displayName,
  description: meta.description,
  group: meta.group,
  added: meta.added,
  isNew: isRecentlyAdded(meta.added),
  demos: (FILES_BY_SLUG.get(meta.name) ?? []).map(resolveDemo),
  accessibility: meta.accessibility,
  externalDocs: meta.externalDocs ?? [],
}));

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
