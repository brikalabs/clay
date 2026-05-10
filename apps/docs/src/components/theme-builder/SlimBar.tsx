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
 * The 8 brand swatches are click-to-edit colour pickers — no scrolling
 * to a Foundation accordion to tweak `primary`. Less chrome, more
 * direct manipulation.
 */

import { Input } from '@brika/clay/components/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@brika/clay/components/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@brika/clay/components/tooltip';
import { toast } from '@brika/clay/components/toast';
import { builtInThemes } from '@brika/clay/themes/registry';
import { MoreHorizontal, RotateCcw, Share2, Sparkles, Upload } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ColorPicker } from '@brika/clay/components/color-picker';
import { EditsPill } from './EditsPill';
import { ExportDialog } from './ExportDialog';
import { TOKENS_BY_NAME } from '@brika/clay/tokens';
import {
  type Draft,
  type ThemeIdentity,
  draftFromThemeConfig,
  effectiveValue,
  tokenDraftKey,
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
    <header
      className="relative overflow-hidden rounded-2xl border border-clay-hairline bg-clay-elevated/60 backdrop-blur-popover"
    >
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

interface BrandSwatchProps {
  readonly name: string;
  readonly draft: Draft;
  readonly setValue: (key: string, value: string) => void;
  readonly resetValue: (key: string) => void;
}

function BrandSwatch({ name, draft, setValue, resetValue }: BrandSwatchProps) {
  const token = TOKENS_BY_NAME[name];
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const [recent, setRecent] = useState<readonly string[]>([]);

  // Position the popover below the trigger, viewport-fixed via portal.
  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    if (!trigger) return;
    const reposition = () => {
      const rect = trigger.getBoundingClientRect();
      const W = popoverRef.current?.offsetWidth ?? 320;
      const H = popoverRef.current?.offsetHeight ?? 480;
      let top = rect.bottom + 8;
      if (top + H > window.innerHeight - 12) top = Math.max(12, rect.top - H - 8);
      let left = rect.left;
      if (left + W > window.innerWidth - 12) left = Math.max(12, window.innerWidth - W - 12);
      setCoords({ top, left });
    };
    reposition();
    const raf = requestAnimationFrame(reposition);
    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, true);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', reposition);
      window.removeEventListener('scroll', reposition, true);
    };
  }, [open]);

  // Click-outside dismiss.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (popoverRef.current?.contains(t) || triggerRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!token) return null;
  const lightKey = tokenDraftKey(token, 'light');
  if (!lightKey) return null;
  const value = effectiveValue(draft, token, 'light');

  return (
    <>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setOpen((p) => !p)}
              aria-label={`Edit ${name}`}
              className="aspect-square size-7 shrink-0 rounded-md border border-clay-hairline shadow-sm ring-0 transition-all hover:scale-110 hover:ring-2 hover:ring-clay-strong/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay-strong/40"
              style={{ background: value }}
            />
          </TooltipTrigger>
          <TooltipContent side="bottom" className="font-mono text-[0.625rem]">
            {name} · {value}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={popoverRef}
            className="fixed z-50"
            style={
              coords
                ? { top: coords.top, left: coords.left }
                : { top: -9999, left: -9999, visibility: 'hidden' }
            }
          >
            <ColorPicker
              value={value}
              onChange={(next) => setValue(lightKey, next)}
              onClose={() => setOpen(false)}
              recentColors={recent}
              onAddRecent={(hex) =>
                setRecent((p) => [hex, ...p.filter((c) => c !== hex)].slice(0, 10))
              }
            />
          </div>,
          document.body
        )}
    </>
  );
}

function ForkMenu({
  replaceAll,
}: {
  readonly replaceAll: (next: Draft, identity?: Partial<ThemeIdentity>) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-clay-hairline bg-clay-elevated px-3 font-medium text-clay-strong text-xs hover:border-clay-strong hover:bg-clay-control"
        >
          <Sparkles className="size-3 text-clay-subtle" />
          Start from
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-[60vh] w-72 overflow-y-auto">
        <DropdownMenuLabel>Fork a Clay preset</DropdownMenuLabel>
        {builtInThemes.map((preset) => (
          <DropdownMenuItem
            key={preset.id}
            onClick={() =>
              replaceAll(draftFromThemeConfig(preset), {
                id: '__custom__',
                name: `${preset.name} fork`,
                description: preset.description,
                accentSwatches: [...preset.accentSwatches],
              })
            }
            className="flex items-start gap-3 py-2"
          >
            <span aria-hidden className="flex h-7 shrink-0 overflow-hidden rounded ring-1 ring-clay-hairline">
              {preset.accentSwatches.slice(0, 4).map((c) => (
                <span key={`${preset.id}-${c}`} className="block w-2" style={{ background: c }} />
              ))}
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="font-medium text-clay-strong text-xs">{preset.name}</span>
              <span className="line-clamp-2 font-mono text-[0.6875rem] text-clay-subtle italic leading-snug">
                {preset.description}
              </span>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface KebabMenuProps {
  readonly onLoad: () => void;
  readonly onReset: () => void;
}

function KebabMenu({ onLoad, onReset }: KebabMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="More actions"
          className="inline-flex size-8 items-center justify-center rounded-full border border-clay-hairline bg-clay-elevated text-clay-subtle hover:border-clay-strong hover:text-clay-strong"
        >
          <MoreHorizontal size={14} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={onLoad}>
          <Upload size={12} />
          Load JSON…
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onReset} className="text-destructive focus:text-destructive">
          <RotateCcw size={12} />
          Reset all
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function readSwatch(draft: Draft, name: string): string {
  const token = TOKENS_BY_NAME[name];
  if (!token) return '#888';
  return effectiveValue(draft, token, 'light');
}
