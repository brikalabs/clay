/**
 * Compact hero. Single card holding the entire identity + global
 * actions, lit by a soft radial wash of the user's primary color.
 *
 *   ┌─────────────────────────────────────────────────────────────┐
 *   │  THEME DRAFT · 34 EDITS                                     │
 *   │  Custom                            [P A B F S W I D]        │
 *   │  user-authored theme.                                        │
 *   │                            [Start preset ▾]   [⋯]           │
 *   └─────────────────────────────────────────────────────────────┘
 *
 * The 8 brand swatches are click-to-edit colour pickers — no
 * scrolling to a Foundation accordion to tweak `primary`. Less
 * chrome, more direct manipulation. Sub-bits live in companion
 * files (`SlimBar.swatch`, `SlimBar.menus`) so each module stays
 * under 300 lines.
 */

import { Input } from '@brika/clay/components/input';
import { toast } from '@brika/clay/components/toast';
import { TOKENS_BY_NAME } from '@brika/clay/tokens';
import { Share2 } from 'lucide-react';
import { useId, useRef } from 'react';

import { EditsPill } from './EditsPill';
import { ExportDialog } from './ExportDialog';
import { BrandSwatch } from './SlimBar.swatch';
import { ForkMenu, KebabMenu } from './SlimBar.menus';
import {
  type Draft,
  type ThemeIdentity,
  draftFromThemeConfig,
  effectiveValue,
} from './state/draft';
import { parseThemeJson } from './state/io';

const BRAND_NAMES: readonly string[] = [
  'primary',
  'accent',
  'background',
  'foreground',
  'success',
  'warning',
  'info',
  'destructive',
];

interface SlimBarProps {
  readonly draft: Draft;
  readonly identity: ThemeIdentity;
  readonly setValue: (key: string, value: string) => void;
  readonly resetValue: (key: string) => void;
  readonly setIdentity: (patch: Partial<ThemeIdentity>) => void;
  readonly replaceAll: (next: Draft, identity?: Partial<ThemeIdentity>) => void;
  readonly clearAll: () => void;
}

const SERIF =
  '"Instrument Serif", "Iowan Old Style", Georgia, "Times New Roman", serif';

function readSwatch(draft: Draft, name: string): string {
  const token = TOKENS_BY_NAME[name];
  if (!token) return '#888';
  return effectiveValue(draft, token, 'light');
}

export function SlimBar({
  draft,
  identity,
  setValue,
  resetValue,
  setIdentity,
  replaceAll,
  clearAll,
}: SlimBarProps) {
  const nameId = useId();
  const descId = useId();
  const fileInput = useRef<HTMLInputElement | null>(null);

  // Soft wash sourced from the user's brand colors so the hero feels
  // like part of their theme without the dramatic mesh-blur of v1.
  const primary = readSwatch(draft, 'primary');
  const accent = readSwatch(draft, 'accent');

  return (
    <header className="relative overflow-hidden rounded-2xl border border-clay-hairline bg-clay-elevated/60 backdrop-blur-popover">
      <div
        aria-hidden
        className="absolute inset-0 opacity-30 saturate-150 dark:opacity-20"
        style={{
          backgroundImage: `radial-gradient(ellipse 60% 100% at 8% 50%, ${primary} 0%, transparent 60%), radial-gradient(ellipse 50% 100% at 95% 50%, ${accent} 0%, transparent 65%)`,
          filter: 'blur(40px)',
        }}
      />

      <div className="relative flex flex-wrap items-center gap-x-6 gap-y-3 p-4 md:p-5">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="font-medium font-mono text-[0.625rem] text-clay-subtle uppercase tracking-[0.12em]">
            Theme draft
          </span>
          <label htmlFor={nameId} className="sr-only">
            Theme name
          </label>
          <Input
            id={nameId}
            type="text"
            value={identity.name}
            onChange={(e) => setIdentity({ name: e.target.value })}
            placeholder="Theme name"
            className="h-auto border-0 bg-transparent px-0 py-0.5 text-clay-strong shadow-none outline-none focus-visible:ring-0"
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              letterSpacing: '-0.018em',
              fontSize: '2rem',
              lineHeight: '1.1',
            }}
          />
          <label htmlFor={descId} className="sr-only">
            Theme description
          </label>
          <Input
            id={descId}
            type="text"
            value={identity.description}
            onChange={(e) => setIdentity({ description: e.target.value })}
            placeholder="A one-sentence description."
            className="h-auto max-w-prose border-0 bg-transparent px-0 py-0 text-clay-default text-sm shadow-none outline-none focus-visible:ring-0"
          />
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1.5">
            {BRAND_NAMES.map((name) => (
              <BrandSwatch
                key={name}
                name={name}
                draft={draft}
                setValue={setValue}
                resetValue={resetValue}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <EditsPill draft={draft} resetValue={resetValue} clearAll={clearAll} compact />
            <ForkMenu replaceAll={replaceAll} />
            <ExportDialog
              draft={draft}
              identity={identity}
              trigger={
                <button
                  type="button"
                  className="inline-flex h-8 items-center gap-1.5 rounded-full bg-button-filled-container px-3 font-medium text-button-filled-label text-xs hover:bg-button-filled-container/90"
                >
                  <Share2 className="size-3" />
                  Export
                </button>
              }
            />
            <KebabMenu onLoad={() => fileInput.current?.click()} onReset={clearAll} />
          </div>
        </div>
      </div>
      <input
        ref={fileInput}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = '';
          if (!file) return;
          const text = await file.text();
          const result = parseThemeJson(text);
          if (!result.ok) {
            toast.error("Couldn't load theme.", { description: result.error });
            return;
          }
          const t = result.theme;
          replaceAll(draftFromThemeConfig(t), {
            id: t.id,
            name: t.name,
            description: t.description,
            accentSwatches: t.accentSwatches ? [...t.accentSwatches] : undefined,
          });
          toast.success(`Loaded "${t.name}".`);
        }}
      />
    </header>
  );
}
