/**
 * Trigger row for editing a single color token: a swatch button that
 * opens the Clay `<ColorPicker>` in a body-portaled popover, plus the
 * free-text Input where users can type any CSS color (oklch, named,
 * var(...) chains the picker can't represent visually).
 *
 * The popover is portaled to `document.body` and viewport-positioned
 * so editor `overflow-y-auto` columns can't clip it.
 */

import {
  ColorPicker,
  ColorPickerSwatch,
} from '@brika/clay/components/color-picker';
import { Input } from '@brika/clay/components/input';
import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { TokenControlBaseProps } from './types';

interface ColorControlProps extends TokenControlBaseProps {
  /** Compact variant used inside two-column color rows. */
  readonly compact?: boolean;
}

const RECENT_KEY = 'clay-builder-recent-colors';
const RECENT_MAX = 12;

function readRecent(): readonly string[] {
  if (globalThis.window === undefined) return [];
  try {
    const raw = globalThis.localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) return parsed.filter((s): s is string => typeof s === 'string');
  } catch {
    // ignore
  }
  return [];
}

function writeRecent(colors: readonly string[]): void {
  if (globalThis.window === undefined) return;
  try {
    globalThis.localStorage.setItem(RECENT_KEY, JSON.stringify(colors));
  } catch {
    // ignore
  }
}

export function ColorControl({
  label,
  value,
  defaultValue,
  isDirty,
  onChange,
  onReset,
  compact,
}: ColorControlProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState<readonly string[]>([]);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setRecent(readRecent());
  }, []);

  // Position the popover beneath the trigger, flipping above when the
  // viewport bottom is closer than the popover height.
  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    if (!trigger) return;

    const reposition = () => {
      const rect = trigger.getBoundingClientRect();
      const popoverEl = popoverRef.current;
      const W = popoverEl?.offsetWidth ?? 320;
      const H = popoverEl?.offsetHeight ?? 480;
      const GAP = 8;
      const MARGIN = 12;

      let top = rect.bottom + GAP;
      if (top + H > window.innerHeight - MARGIN) {
        top = Math.max(MARGIN, rect.top - H - GAP);
      }
      let left = rect.left;
      if (left + W > window.innerWidth - MARGIN) {
        left = Math.max(MARGIN, window.innerWidth - W - MARGIN);
      }
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

  // Click-outside / Esc dismiss.
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (popoverRef.current?.contains(t) || triggerRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const addRecent = (next: string) => {
    const v = next.trim();
    if (!v) return;
    setRecent((prev) => {
      const merged = [v, ...prev.filter((c) => c.toLowerCase() !== v.toLowerCase())].slice(
        0,
        RECENT_MAX
      );
      writeRecent(merged);
      return merged;
    });
  };

  return (
    <div className="relative flex flex-col gap-1">
      {!compact && (
        <label htmlFor={id} className="font-mono text-[0.6875rem] text-clay-subtle">
          {label}
        </label>
      )}
      <div className="flex items-center gap-1.5">
        <button
          ref={triggerRef}
          id={id}
          type="button"
          onClick={() => setOpen((p) => !p)}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label={`${label} color picker`}
          className="relative aspect-square size-7 shrink-0 overflow-hidden rounded-control border border-clay-hairline shadow-surface ring-0 transition-all hover:scale-105 hover:ring-2 hover:ring-clay-strong/20 focus-visible:ring-2 focus-visible:ring-clay-strong/40"
        >
          <ColorPickerSwatch value={value} className="size-full rounded-none ring-0" />
        </button>
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={defaultValue}
          aria-label={label}
          title={value}
          className="h-7 px-2 py-0 font-mono text-[0.6875rem]"
        />
        {isDirty && (
          <button
            type="button"
            onClick={onReset}
            aria-label={`Reset ${label}`}
            className="shrink-0 rounded px-1 font-mono text-[0.625rem] text-clay-subtle uppercase tracking-widest hover:text-clay-strong"
          >
            reset
          </button>
        )}
      </div>
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
              onChange={onChange}
              recentColors={recent}
              onAddRecent={addRecent}
              onClose={() => setOpen(false)}
            />
          </div>,
          document.body
        )}
    </div>
  );
}
