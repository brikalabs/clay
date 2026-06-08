import * as React from 'react';

import { cn } from '../../primitives/cn';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select';
import { useCodeBlockContext } from './code-block-internals';

interface CodeBlockSelectProps {
  readonly className?: string;
  /** Placeholder shown before a file is chosen. */
  readonly placeholder?: string;
  readonly 'aria-label'?: string;
  /** `CodeBlockSelectItem`s, one per file. */
  readonly children: React.ReactNode;
}

/**
 * A header dropdown for switching files — an alternative to `CodeBlockTabs`
 * that scales better when there are many files. Bound to the parent
 * `CodeBlock`'s active value; pair each item with a `CodeBlockPanel`.
 */
export function CodeBlockSelect({
  className,
  placeholder = 'Select a file',
  children,
  ...props
}: CodeBlockSelectProps) {
  const { activeValue, setActiveValue } = useCodeBlockContext('CodeBlockSelect');
  return (
    <Select value={activeValue ?? undefined} onValueChange={setActiveValue}>
      <SelectTrigger
        size="sm"
        data-slot="code-block-select"
        aria-label={props['aria-label'] ?? 'Select a file'}
        className={cn(
          'h-7 w-auto gap-2 border-transparent bg-transparent font-mono text-xs shadow-none hover:bg-code-block-header-bg',
          className
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </Select>
  );
}

interface CodeBlockSelectItemProps extends React.ComponentProps<typeof SelectItem> {
  /** Optional leading glyph (e.g. a file-type icon) shown before the label. */
  icon?: React.ReactNode;
}

export function CodeBlockSelectItem({
  icon,
  className,
  children,
  ...props
}: Readonly<CodeBlockSelectItemProps>) {
  return (
    <SelectItem className={cn('font-mono text-xs', className)} {...props}>
      <span className="flex items-center gap-2">
        {icon}
        {children}
      </span>
    </SelectItem>
  );
}
