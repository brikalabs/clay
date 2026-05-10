/**
 * Top-level React island for /theme-builder.
 *
 * Layout:
 *   ┌────────────────────────────────────────────────────────────────┐
 *   │ SlimBar  (one row: name · 8 swatches · edits · start · ⋯)      │
 *   ├──────────────────────────────┬─────────────────────────────────┤
 *   │ EditorPanel                  │ PreviewPanel                    │
 *   └──────────────────────────────┴─────────────────────────────────┘
 *
 * Theme is scoped via PreviewPanel's <ThemeScope> — no global apply.
 */

import { Toaster } from '@brika/clay/components/toast';
import { useEffect, useState } from 'react';
import { EditorPanel } from './EditorPanel';
import { PreviewPanel } from './PreviewPanel';
import { SlimBar } from './SlimBar';
import { useDraftTheme } from './hooks/useDraftTheme';
import { ensureDocsChromeUnscoped } from './state/persist';

export type EditorTab = 'basic' | 'component';

export function ThemeBuilder() {
  const draft = useDraftTheme();

  // The builder's preview is intentionally scoped — the docs chrome
  // around it (header, sidebar, this editor's inputs) should NOT
  // follow the draft. Any leftover `clay-theme=__custom__` from a
  // prior session would make the picker re-apply the draft globally,
  // which is exactly the leak the user reported.
  useEffect(() => {
    ensureDocsChromeUnscoped();
  }, []);

  const [tab, setTab] = useState<EditorTab>(() => readTabParam());
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    () => readComponentParam()
  );

  // Reflect tab + selectedComponent in the URL so the builder is shareable.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (tab === 'basic') url.searchParams.delete('tab');
    else url.searchParams.set('tab', tab);
    if (selectedComponent) url.searchParams.set('component', selectedComponent);
    else url.searchParams.delete('component');
    const next = `${url.pathname}${url.search}${url.hash}`;
    if (next !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
      window.history.replaceState({}, '', next);
    }
  }, [tab, selectedComponent]);

  return (
    <div className="not-prose flex flex-col gap-4">
      <SlimBar
        draft={draft.draft}
        identity={draft.identity}
        setValue={draft.setValue}
        resetValue={draft.resetValue}
        setIdentity={draft.setIdentity}
        replaceAll={draft.replaceAll}
        clearAll={draft.clearAll}
      />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="xl:sticky xl:top-4 xl:max-h-[calc(100vh-2rem)] xl:overflow-y-auto xl:pr-2">
          <EditorPanel
            tab={tab}
            onTabChange={setTab}
            selectedComponent={selectedComponent}
            onSelectComponent={setSelectedComponent}
            draft={draft.draft}
            setValue={draft.setValue}
            resetValue={draft.resetValue}
            replaceAll={draft.replaceAll}
          />
        </div>
        <PreviewPanel
          draft={draft.draft}
          identity={draft.identity}
          tab={tab}
          selectedComponent={selectedComponent}
        />
      </div>
      <Toaster />
    </div>
  );
}

const VALID_TABS: ReadonlySet<EditorTab> = new Set(['basic', 'component']);

function readTabParam(): EditorTab {
  if (typeof window === 'undefined') return 'basic';
  const value = new URLSearchParams(window.location.search).get('tab');
  return value && (VALID_TABS as Set<string>).has(value) ? (value as EditorTab) : 'basic';
}

function readComponentParam(): string | null {
  if (typeof window === 'undefined') return null;
  const value = new URLSearchParams(window.location.search).get('component');
  if (!value) return null;
  return /^[a-z][a-z0-9-]*$/.test(value) ? value : null;
}
