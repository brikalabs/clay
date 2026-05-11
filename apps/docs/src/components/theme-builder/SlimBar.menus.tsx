/**
 * Hero-bar menus: `ForkMenu` (preset picker) and `KebabMenu`
 * (overflow). Extracted from `SlimBar.tsx` so the hero stays under
 * 300 lines.
 */

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@brika/clay/components/dropdown-menu';
import { builtInThemes } from '@brika/clay/themes/registry';
import { MoreHorizontal, RotateCcw, Sparkles, Upload } from 'lucide-react';

import {
  type Draft,
  type ThemeIdentity,
  draftFromThemeConfig,
} from './state/draft';

export function ForkMenu({
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
            <span
              aria-hidden
              className="flex h-7 shrink-0 overflow-hidden rounded ring-1 ring-clay-hairline"
            >
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

export function KebabMenu({ onLoad, onReset }: KebabMenuProps) {
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
