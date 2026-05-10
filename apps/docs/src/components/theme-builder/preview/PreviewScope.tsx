/**
 * Wrap a subtree with a draft `ThemeConfig`. The draft tokens are set
 * as inline CSS variables on the wrapper, so descendants inherit them
 * and the docs chrome around the wrapper stays untouched.
 *
 * Portaled overlays (Select, Tooltip, Dialog, Toast, …) escape to
 * `document.body` and would normally inherit the docs theme. We tag
 * the ones whose trigger lives inside the wrapper — Radix wires
 * trigger→portal via `aria-controls` / `aria-describedby`, so the
 * portal's `id` resolves back to its trigger uniquely. Editor-side
 * portals (Tooltip on info icons, etc.) never match this ownership
 * check, so they keep the docs theme and don't get the draft bled
 * into them.
 */

import { themeToCssVars, type ThemeConfig, type ThemeMode } from '@brika/clay/themes';
import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
} from 'react';

interface PreviewScopeProps {
  readonly theme: ThemeConfig;
  readonly mode: ThemeMode;
  readonly className?: string;
  readonly style?: CSSProperties;
  readonly children: ReactNode;
}

const PORTAL_SELECTOR =
  '[data-slot$="-content"], [data-slot$="-overlay"], [data-sonner-toaster]';

/**
 * The Sonner toaster is body-level but has no `aria-controls` link
 * back to a trigger, so `ownedBy` can't reach it. The builder owns
 * this page's only Toaster (mounted by `ThemeBuilder`), so any toaster
 * we see is the one we mounted — tag it unconditionally. Toasts fired
 * from anywhere on the page (preview demos, export dialog, slim bar)
 * therefore render with the draft theme; that's the closest match to
 * "preview-shaped surface" we can deliver without splitting the
 * Sonner state across two toasters.
 */
const ALWAYS_TAG_SELECTOR = '[data-sonner-toaster]';

export function PreviewScope({ theme, mode, className, style, children }: PreviewScopeProps) {
  const vars = useMemo(() => themeToCssVars(theme, mode), [theme, mode]);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const paint = (el: HTMLElement) => {
      // Pin transitions off while swapping vars so the portal doesn't
      // ease from the docs-theme color it briefly inherited at mount
      // to the draft value (Clay's `.menu` / `.tooltip` shorthands set
      // a 300ms `transition-duration` with the default `all`
      // property, which animates background-color too).
      el.style.setProperty('transition', 'none', 'important');
      for (const [name, value] of Object.entries(vars)) {
        if (name.startsWith('--') && typeof value === 'string') {
          el.style.setProperty(name, value);
        }
      }
      el.dataset.mode = mode;
      // Restore transitions on the next frame so subsequent state
      // changes (hover, open/close) animate normally.
      requestAnimationFrame(() => el.style.removeProperty('transition'));
    };

    const consider = (el: HTMLElement) => {
      const owns =
        el.matches(ALWAYS_TAG_SELECTOR) ||
        (el.matches(PORTAL_SELECTOR) && ownedBy(el, root));
      if (owns) paint(el);
    };

    document.body.querySelectorAll<HTMLElement>(PORTAL_SELECTOR).forEach(consider);
    document.body.querySelectorAll<HTMLElement>(ALWAYS_TAG_SELECTOR).forEach(consider);

    const obs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          consider(node);
          node.querySelectorAll<HTMLElement>(PORTAL_SELECTOR).forEach(consider);
          node.querySelectorAll<HTMLElement>(ALWAYS_TAG_SELECTOR).forEach(consider);
        }
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
    return () => obs.disconnect();
  }, [vars, mode]);

  return (
    <div ref={rootRef} data-mode={mode} className={className} style={{ ...vars, ...style }}>
      {children}
    </div>
  );
}

function ownedBy(portal: HTMLElement, root: HTMLElement): boolean {
  const id = portal.id;
  if (!id) return false;
  const escaped = CSS.escape(id);
  const trigger = document.querySelector(
    `[aria-controls~="${escaped}"], [aria-describedby~="${escaped}"]`
  );
  return trigger !== null && root.contains(trigger);
}
