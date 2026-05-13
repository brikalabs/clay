import { type ComponentType, createElement } from 'react';

type DemoComponent = ComponentType<Record<string, never>>;

interface DemoModule {
  readonly default?: DemoComponent;
}

// Discover all per-demo `<slug>/demos/<kebab>.demos.tsx` files.
const demoModules = import.meta.glob<DemoModule>(
  '~clay/components/*/demos/*.demos.tsx',
  { eager: true }
);

const DEMO_PATH_RE = /\/components\/([a-z0-9-]+)\/demos\/([a-z0-9-]+)\.demos\.tsx$/;

/**
 * Two-level lookup: `slug → kebab → DemoComponent`. Each per-demo file is keyed
 * by its filename so the renderer can find it given the slug + demo name pair
 * passed from the docs page (`<DemoRenderer slug=… demoName=… />`).
 */
const demosBySlug: ReadonlyMap<string, ReadonlyMap<string, DemoComponent>> = (() => {
  const out = new Map<string, Map<string, DemoComponent>>();
  for (const [path, mod] of Object.entries(demoModules)) {
    const match = DEMO_PATH_RE.exec(path);
    if (!match) continue;
    const [, slug, kebab] = match;
    if (!slug || !kebab || !mod.default) continue;
    const inner = out.get(slug) ?? new Map<string, DemoComponent>();
    inner.set(kebab, mod.default);
    out.set(slug, inner);
  }
  return out;
})();

interface DemoRendererProps {
  readonly slug: string;
  readonly demoName: string;
}

/**
 * Render a demo by its component slug and kebab filename.
 *
 * Astro can't hydrate a dynamic component variable directly with `client:*`,
 * so this island does the lookup at runtime after hydration.
 */
export function DemoRenderer({ slug, demoName }: DemoRendererProps) {
  const inner = demosBySlug.get(slug);
  if (!inner) {
    return (
      <p className="font-mono text-clay-subtle text-xs">No demo file for &quot;{slug}&quot;.</p>
    );
  }
  const Demo = inner.get(demoName);
  if (!Demo) {
    return (
      <p className="font-mono text-clay-subtle text-xs">
        No demo named &quot;{demoName}&quot; under {slug}/demos/.
      </p>
    );
  }
  return createElement(Demo);
}
