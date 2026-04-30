import { type ComponentType, createElement } from 'react';

type DemoModule = Readonly<Record<string, ComponentType<Record<string, never>>>>;

// Discover all *.demos.tsx files co-located with their components in the Clay package.
const demoModules = import.meta.glob<DemoModule>(
  '../../../src/components/*/*.demos.tsx',
  { eager: true }
);

const demosBySlug: ReadonlyMap<string, DemoModule> = new Map(
  Object.entries(demoModules).map(([path, mod]) => {
    const slug = /\/components\/([a-z0-9-]+)\/[^/]+\.demos\.tsx$/.exec(path)?.[1] ?? path;
    return [slug, mod];
  })
);

interface DemoRendererProps {
  readonly slug: string;
  readonly demoName: string;
}

/**
 * Render a demo by its component slug and exported function name.
 *
 * Astro can't hydrate a dynamic component variable directly with `client:*`
 * so this island does the lookup at runtime after hydration.
 */
export function DemoRenderer({ slug, demoName }: DemoRendererProps) {
  const mod = demosBySlug.get(slug);
  if (!mod) {
    return (
      <p className="font-mono text-clay-subtle text-xs">No demo file for &quot;{slug}&quot;.</p>
    );
  }
  const Demo = mod[demoName];
  if (!Demo) {
    return (
      <p className="font-mono text-clay-subtle text-xs">
        No exported demo named &quot;{demoName}&quot; in {slug}.demos.tsx.
      </p>
    );
  }
  return createElement(Demo);
}
