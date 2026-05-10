/**
 * Side-by-side light/dark color row used on the Basic tab. Lays out the
 * token name in the left gutter and a `ColorControl` for each mode.
 */

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@brika/clay/components/tooltip';
import type { ResolvedTokenSpec } from '@brika/clay/tokens';
import { Info } from 'lucide-react';
import { ColorControl } from './controls/ColorControl';
import {
  type Draft,
  effectiveValue,
  isDirty,
  tokenDefault,
  tokenDraftKey,
} from './state/draft';

interface ColorRowProps {
  readonly token: ResolvedTokenSpec;
  readonly draft: Draft;
  readonly onChange: (key: string, value: string) => void;
  readonly onReset: (key: string) => void;
}

export function ColorRow({ token, draft, onChange, onReset }: ColorRowProps) {
  const lightKey = tokenDraftKey(token, 'light');
  const darkKey = tokenDraftKey(token, 'dark');
  if (!lightKey || !darkKey) return null;

  const lightDirty = isDirty(draft, lightKey);
  const darkDirty = isDirty(draft, darkKey);
  const anyDirty = lightDirty || darkDirty;
  return (
    <div className="-mx-2 grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,2fr)] items-start gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-clay-canvas/30">
      <code
        className="flex min-w-0 items-start gap-1.5 break-all py-1.5 font-mono text-[0.6875rem] text-clay-default leading-tight"
        title={token.name}
      >
        {anyDirty && (
          <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald-500" />
        )}
        <span className="min-w-0">{token.name}</span>
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label={`About ${token.name}`}
                className="mt-0.5 shrink-0 text-clay-inactive transition-colors hover:text-clay-strong"
              >
                <Info size={11} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs text-xs leading-snug">
              {token.description}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </code>
      <ColorControl
        label={`${token.name} (light)`}
        value={effectiveValue(draft, token, 'light')}
        defaultValue={tokenDefault(token, 'light')}
        isDirty={lightDirty}
        onChange={(next) => onChange(lightKey, next)}
        onReset={() => onReset(lightKey)}
        compact
      />
      <ColorControl
        label={`${token.name} (dark)`}
        value={effectiveValue(draft, token, 'dark')}
        defaultValue={tokenDefault(token, 'dark')}
        isDirty={darkDirty}
        onChange={(next) => onChange(darkKey, next)}
        onReset={() => onReset(darkKey)}
        compact
      />
    </div>
  );
}
