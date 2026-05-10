/**
 * Right panel of the builder. Wraps the active scene in `<PreviewScope>`
 * so the draft theme renders ONLY inside the preview — the docs page
 * itself stays on its real preset.
 */

import type { ThemeMode } from '@brika/clay/themes';
import { useMemo, useState } from 'react';
import { ComponentScene } from './preview/ComponentScene';
import { DashboardScene } from './preview/DashboardScene';
import { KitchenSink } from './preview/KitchenSink';
import { MarketingScene } from './preview/MarketingScene';
import { PreviewScope } from './preview/PreviewScope';
import { type Draft, type ThemeIdentity, themeConfigFromDraft } from './state/draft';
import type { EditorTab } from './ThemeBuilder';

interface PreviewPanelProps {
  readonly draft: Draft;
  readonly identity: ThemeIdentity;
  readonly tab: EditorTab;
  readonly selectedComponent: string | null;
}

const SCENES = [
  { id: 'kitchen', label: 'Kitchen sink', render: () => <KitchenSink /> },
  { id: 'dashboard', label: 'Dashboard', render: () => <DashboardScene /> },
  { id: 'marketing', label: 'Marketing', render: () => <MarketingScene /> },
] as const;

type SceneId = (typeof SCENES)[number]['id'];

const SERIF = '"Instrument Serif", "Iowan Old Style", Georgia, "Times New Roman", serif';

export function PreviewPanel({ draft, identity, tab, selectedComponent }: PreviewPanelProps) {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [scene, setScene] = useState<SceneId>('kitchen');

  const themeConfig = useMemo(
    () => themeConfigFromDraft(draft, identity),
    [draft, identity]
  );

  const inComponentMode = tab === 'component';
  const activeScene = SCENES.find((s) => s.id === scene) ?? SCENES[0];
  const subtitle = inComponentMode
    ? selectedComponent ?? 'no component selected'
    : activeScene.label;

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <span
            className="text-clay-strong text-2xl leading-none"
            style={{ fontFamily: SERIF, fontStyle: 'italic', letterSpacing: '-0.012em' }}
          >
            Live preview
          </span>
          <span className="font-mono text-[0.625rem] text-clay-subtle uppercase tracking-[0.12em]">
            {subtitle}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!inComponentMode && (
            <Segmented
              ariaLabel="Preview scene"
              value={scene}
              onChange={setScene}
              options={SCENES.map((s) => ({ id: s.id, label: s.label }))}
            />
          )}
          <Segmented
            ariaLabel="Preview color mode"
            value={mode}
            onChange={setMode}
            options={[
              { id: 'light', label: 'light' },
              { id: 'dark', label: 'dark' },
            ]}
          />
        </div>
      </div>
      <PreviewScope
        theme={themeConfig}
        mode={mode}
        className="relative flex-1 overflow-auto rounded-2xl border border-clay-hairline shadow-xl"
        style={{ background: 'var(--background)', color: 'var(--foreground)' }}
      >
        <div className="p-6 md:p-8">
          {inComponentMode ? (
            <ComponentScene component={selectedComponent} />
          ) : (
            activeScene.render()
          )}
        </div>
      </PreviewScope>
    </div>
  );
}

interface SegmentedProps<T extends string> {
  readonly ariaLabel: string;
  readonly value: T;
  readonly onChange: (next: T) => void;
  readonly options: ReadonlyArray<{ readonly id: T; readonly label: string }>;
}

function Segmented<T extends string>({ ariaLabel, value, onChange, options }: SegmentedProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="inline-flex items-center rounded-full border border-clay-hairline bg-clay-canvas/40 p-0.5 text-[0.6875rem]"
    >
      {options.map((opt) => (
        <button
          key={opt.id}
          role="tab"
          type="button"
          aria-selected={value === opt.id}
          onClick={() => onChange(opt.id)}
          className={
            value === opt.id
              ? 'rounded-full bg-clay-elevated px-3 py-1 font-medium font-mono text-clay-strong uppercase tracking-[0.08em] shadow-sm'
              : 'px-3 py-1 font-mono text-clay-subtle uppercase tracking-[0.08em] hover:text-clay-strong'
          }
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
