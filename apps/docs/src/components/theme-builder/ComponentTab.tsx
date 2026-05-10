/**
 * "Components" tab body. Two views:
 *
 *  - Empty / browsing: a grouped grid of every component (ComponentGrid).
 *  - Focused: the selected component's grouped tokens, plus a "Switch
 *    component" link to return to the grid.
 */

import { ChevronLeft } from 'lucide-react';
import { useMemo } from 'react';
import { CategoryAccordion } from './CategoryAccordion';
import { ColorRow } from './ColorRow';
import { ComponentGrid } from './ComponentGrid';
import { TokenControl } from './TokenControl';
import type { Draft } from './state/draft';
import { groupComponentTokens, tokensFor } from './state/component-tokens';
import { COMPONENTS_BY_SLUG } from '~/lib/component-registry';

interface ComponentTabProps {
  readonly selected: string | null;
  readonly onSelect: (next: string) => void;
  readonly draft: Draft;
  readonly setValue: (key: string, value: string) => void;
  readonly resetValue: (key: string) => void;
}

const SERIF = '"Instrument Serif", "Iowan Old Style", Georgia, "Times New Roman", serif';

export function ComponentTab({
  selected,
  onSelect,
  draft,
  setValue,
  resetValue,
}: ComponentTabProps) {
  if (!selected) {
    return <ComponentGrid onSelect={onSelect} />;
  }
  return (
    <FocusedComponentView
      selected={selected}
      onBack={() => onSelect('')}
      draft={draft}
      setValue={setValue}
      resetValue={resetValue}
    />
  );
}

interface FocusedProps {
  readonly selected: string;
  readonly onBack: () => void;
  readonly draft: Draft;
  readonly setValue: (key: string, value: string) => void;
  readonly resetValue: (key: string) => void;
}

function FocusedComponentView({
  selected,
  onBack,
  draft,
  setValue,
  resetValue,
}: FocusedProps) {
  const tokens = useMemo(() => tokensFor(selected), [selected]);
  const groups = useMemo(() => groupComponentTokens(tokens), [tokens]);
  const meta = COMPONENTS_BY_SLUG[selected];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 rounded-xl border border-clay-hairline bg-clay-elevated/50 p-3 backdrop-blur-popover">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[0.625rem] text-clay-subtle uppercase tracking-[0.08em] hover:bg-clay-canvas/40 hover:text-clay-strong"
          >
            <ChevronLeft size={11} />
            All components
          </button>
          {meta && (
            <span className="font-mono text-[0.625rem] text-clay-subtle italic">
              {meta.group}
            </span>
          )}
        </div>
        <div className="flex items-baseline justify-between gap-3 px-1">
          <span
            className="text-clay-strong text-3xl"
            style={{ fontFamily: SERIF, fontStyle: 'italic', letterSpacing: '-0.012em' }}
          >
            {meta?.name ?? selected}
          </span>
          <span className="font-mono text-[0.625rem] text-clay-subtle tabular-nums">
            {tokens.length} {tokens.length === 1 ? 'token' : 'tokens'}
          </span>
        </div>
        {meta && (
          <p
            className="line-clamp-2 px-1 text-clay-subtle text-xs leading-snug"
            title={meta.description}
          >
            {meta.description}
          </p>
        )}
      </div>

      {groups.length === 0 && (
        <div className="rounded-xl border border-clay-hairline border-dashed bg-clay-canvas/20 px-4 py-8 text-center">
          <p className="text-clay-default text-sm">
            <span className="font-medium">{meta?.name ?? selected}</span> doesn't expose
            Layer-2 tokens yet. Try Foundation tab.
          </p>
        </div>
      )}

      {groups.map((group, i) => (
        <CategoryAccordion
          key={group.id}
          id={group.id}
          label={group.label}
          count={group.tokens.length}
          defaultOpen={i === 0}
        >
          {group.tokens[0].category === 'color' ? (
            <div className="flex flex-col">
              <div className="grid grid-cols-[1fr_minmax(0,2fr)_minmax(0,2fr)] gap-2 border-clay-hairline border-b pb-1 font-mono text-[0.625rem] text-clay-inactive uppercase tracking-[0.08em]">
                <span>Token</span>
                <span>Light</span>
                <span>Dark</span>
              </div>
              {group.tokens.map((token) => (
                <ColorRow
                  key={token.name}
                  token={token}
                  draft={draft}
                  onChange={setValue}
                  onReset={resetValue}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {group.tokens.map((token) => (
                <TokenControl
                  key={token.name}
                  token={token}
                  mode="light"
                  draft={draft}
                  onChange={setValue}
                  onReset={resetValue}
                />
              ))}
            </div>
          )}
        </CategoryAccordion>
      ))}
    </div>
  );
}
