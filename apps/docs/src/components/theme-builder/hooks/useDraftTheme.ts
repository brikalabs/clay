/**
 * Owns the user-authored theme draft.
 *
 * The theme is SCOPED — it doesn't apply globally. The preview wraps
 * its content in `<ThemeScope>` so the user's tokens render only
 * inside the preview area; the docs page itself stays on Clay's
 * default theme. We persist the draft so ThemePicker can still
 * surface it as a "Custom" entry, but global activation is the
 * picker's job, not the editor's.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  type Draft,
  type ThemeIdentity,
  clearDraft,
  deriveAccentSwatches,
  draftFromThemeConfig,
  resetDraftValue,
  setDraftValue,
  themeConfigFromDraft,
} from '../state/draft';
import { loadCustomTheme, saveDraftTheme } from '../state/persist';

export interface UseDraftThemeResult {
  readonly draft: Draft;
  readonly identity: ThemeIdentity;
  readonly setValue: (key: string, value: string) => void;
  readonly resetValue: (key: string) => void;
  readonly replaceAll: (next: Draft, identity?: Partial<ThemeIdentity>) => void;
  readonly clearAll: () => void;
  readonly setIdentity: (patch: Partial<ThemeIdentity>) => void;
}

const INITIAL_IDENTITY: ThemeIdentity = {
  id: '__custom__',
  name: 'Custom',
  description: 'User-authored theme.',
  accentSwatches: ['#888888', '#888888', '#888888', '#888888'],
};

export function useDraftTheme(): UseDraftThemeResult {
  const [draft, setDraft] = useState<Draft>(() => new Map());
  const [identity, setIdentityState] = useState<ThemeIdentity>(INITIAL_IDENTITY);
  const hydrated = useRef(false);

  // One-shot hydration from localStorage on mount.
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    const stored = loadCustomTheme();
    if (stored) {
      setDraft(draftFromThemeConfig(stored));
      setIdentityState({
        id: stored.id || INITIAL_IDENTITY.id,
        name: stored.name || INITIAL_IDENTITY.name,
        description: stored.description || INITIAL_IDENTITY.description,
        accentSwatches:
          stored.accentSwatches && stored.accentSwatches.length > 0
            ? [...stored.accentSwatches]
            : INITIAL_IDENTITY.accentSwatches,
      });
    }
  }, []);

  // Keep accent swatches synced with the live primary/feedback colors so
  // ThemePicker's swatch strip reflects the user's choices.
  const liveIdentity = useMemo<ThemeIdentity>(
    () => ({ ...identity, accentSwatches: deriveAccentSwatches(draft) }),
    [identity, draft]
  );

  // Persist the draft so cross-page navigation / reload restore work.
  // CRITICAL: this writes to localStorage ONLY — it does NOT activate
  // the custom theme as the docs site's live theme. Otherwise every
  // edit would bleed out into the editor chrome (header, sidebar,
  // inputs) which is exactly what scoped preview is trying to avoid.
  // The user activates their custom theme document-wide explicitly via
  // ThemePicker.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    saveDraftTheme(themeConfigFromDraft(draft, liveIdentity));
  }, [draft, liveIdentity]);

  const setValue = useCallback((key: string, value: string) => {
    setDraft((prev) => setDraftValue(prev, key, value));
  }, []);

  const resetValue = useCallback((key: string) => {
    setDraft((prev) => resetDraftValue(prev, key));
  }, []);

  const replaceAll = useCallback(
    (next: Draft, patch?: Partial<ThemeIdentity>) => {
      setDraft(next);
      if (patch) setIdentityState((prev) => ({ ...prev, ...patch }));
    },
    []
  );

  const clearAll = useCallback(() => {
    setDraft(clearDraft());
  }, []);

  const setIdentity = useCallback((patch: Partial<ThemeIdentity>) => {
    setIdentityState((prev) => ({ ...prev, ...patch }));
  }, []);

  return {
    draft,
    identity: liveIdentity,
    setValue,
    resetValue,
    replaceAll,
    clearAll,
    setIdentity,
  };
}
