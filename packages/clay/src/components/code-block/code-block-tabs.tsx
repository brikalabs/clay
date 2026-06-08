import * as React from 'react';

import { cn } from '../../primitives/cn';
import { useCodeBlockContext } from './code-block-internals';

/**
 * Tab bar for switching between files in a multi-file code block. Place it
 * inside `CodeBlockHeader`; pair each `CodeBlockTab` with a `CodeBlockPanel`
 * of the same `value`. The parent `CodeBlock` owns the active value via its
 * `value` / `defaultValue` / `onValueChange` props.
 */
export function CodeBlockTabs({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      // biome-ignore lint/a11y/useSemanticElements: the WAI-ARIA tabs pattern requires role="tablist".
      role="tablist"
      aria-label={props['aria-label'] ?? 'Files'}
      data-slot="code-block-tabs"
      className={cn('flex min-w-0 items-center gap-1 overflow-x-auto', className)}
      {...props}
    />
  );
}

interface CodeBlockTabProps extends React.ComponentProps<'button'> {
  /** Identifier matched against the active value and the sibling `CodeBlockPanel`. */
  value: string;
  /** Optional leading glyph (e.g. a file-type icon) shown before the label. */
  icon?: React.ReactNode;
}

export function CodeBlockTab({
  value,
  icon,
  className,
  children,
  onClick,
  onKeyDown,
  ...props
}: Readonly<CodeBlockTabProps>) {
  const { activeValue, setActiveValue } = useCodeBlockContext('CodeBlockTab');
  const active = activeValue === value;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      data-state={active ? 'active' : 'inactive'}
      tabIndex={active ? 0 : -1}
      data-slot="code-block-tab"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          setActiveValue(value);
        }
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft')) {
          return;
        }
        event.preventDefault();
        const tablist = event.currentTarget.closest<HTMLElement>('[role="tablist"]');
        if (!tablist) {
          return;
        }
        const tabs = [...tablist.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
        const index = tabs.indexOf(event.currentTarget);
        const target = tabs[event.key === 'ArrowRight' ? index + 1 : index - 1];
        if (target) {
          target.focus();
          target.click();
        }
      }}
      className={cn(
        "corner-themed flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-xs outline-none transition-colors focus-visible:ring-themed [&_svg:not([class*='size-'])]:size-3.5 [&_svg]:shrink-0",
        active
          ? 'bg-code-block-bg text-code-block-tab-active-label'
          : 'text-code-block-tab-label hover:text-code-block-tab-active-label',
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}

interface CodeBlockPanelProps extends React.ComponentProps<'div'> {
  /** Identifier matched against the active value; renders only when active. */
  value: string;
}

export function CodeBlockPanel({ value, className, ...props }: Readonly<CodeBlockPanelProps>) {
  const { activeValue } = useCodeBlockContext('CodeBlockPanel');
  if (activeValue !== value) {
    return null;
  }
  return (
    <div role="tabpanel" data-slot="code-block-panel" className={cn('min-w-0', className)} {...props} />
  );
}
