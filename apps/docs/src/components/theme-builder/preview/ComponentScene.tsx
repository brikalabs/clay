/**
 * Focused preview that renders only the selected component's demos.
 * Activated when the user is in the "By component" tab so the preview
 * reflects what they're tuning, not the whole kitchen sink.
 *
 * Reuses the same `*.demos.tsx` modules the docs site renders on
 * `/components/<slug>` via `DemoRenderer`.
 */

import { COMPONENTS_BY_SLUG } from '~/lib/component-registry';
import { DemoRenderer } from '~/components/DemoRenderer';

interface ComponentSceneProps {
  readonly component: string | null;
}

const SERIF = '"Instrument Serif", "Iowan Old Style", Georgia, "Times New Roman", serif';

export function ComponentScene({ component }: ComponentSceneProps) {
  if (!component) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <p
          className="text-2xl text-foreground"
          style={{ fontFamily: SERIF, fontStyle: 'italic' }}
        >
          Pick a component
        </p>
        <p className="text-muted-foreground text-sm">
          Or click any element under Inspect mode to focus here.
        </p>
      </div>
    );
  }

  const entry = COMPONENTS_BY_SLUG[component];
  if (!entry) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <p className="text-card-foreground text-sm">
          No demos registered for <code className="font-mono">{component}</code>.
        </p>
      </div>
    );
  }

  if (entry.demos.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <h3
          className="font-semibold text-2xl text-foreground"
          style={{ fontFamily: SERIF, fontStyle: 'italic' }}
        >
          {entry.name}
        </h3>
        <p className="mt-2 text-muted-foreground text-sm">{entry.description}</p>
        <p className="mt-3 font-mono text-muted-foreground text-xs italic">
          No demos defined yet — token edits still apply across the docs site.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-baseline gap-3">
        <h3
          className="text-3xl text-foreground"
          style={{ fontFamily: SERIF, fontStyle: 'italic', letterSpacing: '-0.012em' }}
        >
          {entry.name}
        </h3>
        <span className="font-mono text-muted-foreground text-xs uppercase tracking-[0.12em]">
          {entry.demos.length} {entry.demos.length === 1 ? 'demo' : 'demos'}
        </span>
      </header>
      <p className="-mt-3 max-w-prose text-muted-foreground text-sm">{entry.description}</p>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {entry.demos.map((demo) => (
          <article
            key={demo.name}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5"
          >
            <header className="flex flex-col gap-1">
              <h4 className="font-medium text-card-foreground text-sm">{demo.title}</h4>
              {demo.description && (
                <p className="text-muted-foreground text-xs leading-snug">{demo.description}</p>
              )}
            </header>
            <div className="flex min-h-[120px] flex-1 items-center justify-center rounded-lg border border-border/50 bg-background/40 p-4">
              <DemoRenderer slug={component} demoName={demo.name} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
