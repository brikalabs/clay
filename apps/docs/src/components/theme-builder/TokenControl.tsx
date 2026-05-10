/**
 * Dispatcher: maps a `ResolvedTokenSpec.type` to the right control widget.
 * The editor never instantiates control components directly, it always
 * goes through this so future tweaks (e.g., a fancy oklch picker) land in
 * one place.
 */

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@brika/clay/components/tooltip';
import type { ResolvedTokenSpec } from '@brika/clay/tokens';
import type { ThemeMode } from '@brika/clay/themes';
import { Info } from 'lucide-react';
import { ColorControl } from './controls/ColorControl';
import { DurationControl } from './controls/DurationControl';
import { LengthControl } from './controls/LengthControl';
import { OpacityControl } from './controls/OpacityControl';
import { SelectControl } from './controls/SelectControl';
import { ShadowControl } from './controls/ShadowControl';
import { TextControl } from './controls/TextControl';
import { TokenVisual } from './controls/TokenVisual';
import { effectiveValue, isDirty, tokenDefault, tokenDraftKey } from './state/draft';
import type { Draft } from './state/draft';

interface TokenControlProps {
  readonly token: ResolvedTokenSpec;
  readonly mode: ThemeMode;
  readonly draft: Draft;
  readonly onChange: (key: string, value: string) => void;
  readonly onReset: (key: string) => void;
  /** Suppress the field label (Basic-tab color rows render their own header). */
  readonly bare?: boolean;
}

const LENGTH_TYPES: ReadonlySet<string> = new Set([
  'size',
  'radius',
  'border-width',
  'font-size',
  'letter-spacing',
  'blur',
  'line-height',
]);

const SELECT_TYPES: ReadonlySet<string> = new Set([
  'easing',
  'font-family',
  'border-style',
  'text-transform',
  'corner-shape',
  'font-weight',
]);

export function TokenControl({ token, mode, draft, onChange, onReset, bare }: TokenControlProps) {
  const key = tokenDraftKey(token, mode);
  if (!key) return null;
  const value = effectiveValue(draft, token, mode);
  const defaultValue = tokenDefault(token, mode);
  const dirty = isDirty(draft, key);
  const baseProps = {
    label: bare ? '' : token.name,
    value,
    defaultValue,
    isDirty: dirty,
    onChange: (next: string) => onChange(key, next),
    onReset: () => onReset(key),
  };

  if (token.type === 'color') {
    return <ColorControl {...baseProps} compact={bare} />;
  }

  let body: React.ReactNode;
  if (LENGTH_TYPES.has(token.type)) {
    body = <LengthControl {...baseProps} tokenType={token.type} />;
  } else if (token.type === 'duration') {
    body = <DurationControl {...baseProps} />;
  } else if (SELECT_TYPES.has(token.type)) {
    body = <SelectControl {...baseProps} tokenType={token.type} />;
  } else if (token.type === 'opacity') {
    body = <OpacityControl {...baseProps} />;
  } else if (token.type === 'shadow') {
    body = <ShadowControl {...baseProps} />;
  } else {
    body = <TextControl {...baseProps} />;
  }

  return (
    <div className="-mx-2 flex items-end gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-clay-canvas/30">
      <div className="flex-1">{body}</div>
      <div className="flex h-7 items-center pb-1">
        <TokenVisual token={token} value={value} />
      </div>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label={`About ${token.name}`}
              className="mb-2 shrink-0 text-clay-inactive transition-colors hover:text-clay-strong"
            >
              <Info size={11} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-xs text-xs leading-snug">
            {token.description}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {dirty && (
        <span
          aria-hidden
          className="mb-2 size-1.5 shrink-0 rounded-full bg-emerald-500"
          title="Edited"
        />
      )}
    </div>
  );
}
