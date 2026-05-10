/**
 * Left panel of the builder. Two tabs:
 *   - Foundation: brand & feedback colors, scalars, border, motion, focus
 *   - Components: pick a component and tune its slot tokens
 */

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@brika/clay/components/tabs';
import type { ResolvedTokenSpec } from '@brika/clay/tokens';
import { CategoryAccordion } from './CategoryAccordion';
import { ColorRow } from './ColorRow';
import { ComponentTab } from './ComponentTab';
import { TokenControl } from './TokenControl';
import type { EditorTab } from './ThemeBuilder';
import type { Draft } from './state/draft';
import { BASIC_GROUPS } from './state/tiers';

interface EditorPanelProps {
  readonly tab: EditorTab;
  readonly onTabChange: (next: EditorTab) => void;
  readonly selectedComponent: string | null;
  readonly onSelectComponent: (next: string) => void;
  readonly draft: Draft;
  readonly setValue: (key: string, value: string) => void;
  readonly resetValue: (key: string) => void;
}

export function EditorPanel({
  tab,
  onTabChange,
  selectedComponent,
  onSelectComponent,
  draft,
  setValue,
  resetValue,
}: EditorPanelProps) {
  return (
    <Tabs value={tab} onValueChange={(v) => onTabChange(v as EditorTab)}>
      <TabsList className="w-full">
        <TabsTrigger value="basic" className="flex-1">
          Foundation
        </TabsTrigger>
        <TabsTrigger value="component" className="flex-1">
          Components
        </TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="mt-3 flex flex-col gap-2">
        {BASIC_GROUPS.map((group, i) => (
          <BasicGroup
            key={group.id}
            groupId={group.id}
            label={group.label}
            hint={group.hint}
            tokens={group.tokens}
            defaultOpen={i === 0}
            draft={draft}
            setValue={setValue}
            resetValue={resetValue}
          />
        ))}
      </TabsContent>

      <TabsContent value="component" className="mt-3">
        <ComponentTab
          selected={selectedComponent}
          onSelect={onSelectComponent}
          draft={draft}
          setValue={setValue}
          resetValue={resetValue}
        />
      </TabsContent>
    </Tabs>
  );
}

interface BasicGroupProps {
  readonly groupId: string;
  readonly label: string;
  readonly hint?: string;
  readonly tokens: readonly ResolvedTokenSpec[];
  readonly defaultOpen?: boolean;
  readonly draft: Draft;
  readonly setValue: (key: string, value: string) => void;
  readonly resetValue: (key: string) => void;
}

function BasicGroup({
  groupId,
  label,
  hint,
  tokens,
  defaultOpen,
  draft,
  setValue,
  resetValue,
}: BasicGroupProps) {
  const isColors = tokens.every((t) => t.category === 'color');
  return (
    <CategoryAccordion
      id={groupId}
      label={label}
      hint={hint}
      count={tokens.length}
      defaultOpen={defaultOpen}
    >
      {isColors ? (
        <div className="flex flex-col">
          <div className="grid grid-cols-[1fr_minmax(0,2fr)_minmax(0,2fr)] gap-2 border-clay-hairline border-b pb-1 font-mono text-[0.625rem] text-clay-inactive uppercase tracking-[0.08em]">
            <span>Token</span>
            <span>Light</span>
            <span>Dark</span>
          </div>
          {tokens.map((token) => (
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
          {tokens.map((token) =>
            token.category === 'color' ? (
              <ColorRow
                key={token.name}
                token={token}
                draft={draft}
                onChange={setValue}
                onReset={resetValue}
              />
            ) : (
              <TokenControl
                key={token.name}
                token={token}
                mode="light"
                draft={draft}
                onChange={setValue}
                onReset={resetValue}
              />
            )
          )}
        </div>
      )}
    </CategoryAccordion>
  );
}
