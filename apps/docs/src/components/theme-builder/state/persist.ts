/**
 * localStorage glue for the theme builder. The builder persists the
 * draft theme so reloads / cross-page navigation restore work, but it
 * intentionally does NOT activate the draft as the docs site's live
 * theme — preview is scoped to the right-hand panel only. Activation
 * (taking the custom theme docs-wide) is the user's job, via
 * `ThemePicker`.
 *
 * Three keys are involved across the docs site (the builder owns
 * write access only to `clay-custom-theme`, the others belong to
 * `ThemePicker`):
 *
 *   `clay-theme`         active theme id; `__custom__` means "use
 *                        whatever JSON is in clay-custom-theme"
 *   `clay-custom-theme`  full ThemeConfig JSON for the user's draft
 *   `clay-theme-prev`    preset id active before the user entered
 *                        custom mode; used to revert
 */

import type { ThemeConfig } from '@brika/clay/themes';

const ACTIVE_THEME_KEY = 'clay-theme';
const CUSTOM_THEME_KEY = 'clay-custom-theme';
const PREVIOUS_THEME_KEY = 'clay-theme-prev';
const THEME_EVENT = 'clay:theme-change';
const CUSTOM_SENTINEL = '__custom__';

function ls(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function loadCustomTheme(): ThemeConfig | null {
  const storage = ls();
  if (!storage) return null;
  const raw = storage.getItem(CUSTOM_THEME_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === 'object') return parsed as ThemeConfig;
  } catch {
    // corrupt JSON; treat as missing
  }
  return null;
}

/**
 * Persist the draft. Writes only the JSON payload — does NOT touch
 * the active-theme pointer or fire the global theme event, so editing
 * never bleeds out of the scoped preview into the docs chrome.
 */
export function saveDraftTheme(theme: ThemeConfig): void {
  ls()?.setItem(CUSTOM_THEME_KEY, JSON.stringify(theme));
}

/**
 * If the active theme is `__custom__` (a leftover from before the
 * builder switched to scoped-only persistence, or from an earlier
 * explicit activation), revert to the preset that was active before.
 * The draft JSON is preserved. ThemePicker is notified via
 * `clay:theme-change` so the `<style id="clay-theme">` tag re-paints.
 */
export function ensureDocsChromeUnscoped(): void {
  const storage = ls();
  if (!storage || storage.getItem(ACTIVE_THEME_KEY) !== CUSTOM_SENTINEL) return;
  const previous = storage.getItem(PREVIOUS_THEME_KEY) ?? 'clay';
  storage.setItem(ACTIVE_THEME_KEY, previous);
  storage.removeItem(PREVIOUS_THEME_KEY);
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: previous }));
}
