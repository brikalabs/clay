'use client';

import { ChevronRight, File as FileIcon, Folder, FolderOpen, Loader2 } from 'lucide-react';
import * as React from 'react';

import { cn } from '../../primitives/cn';

interface TreeContextValue {
  readonly expanded: ReadonlySet<string>;
  readonly toggleExpanded: (id: string) => void;
  readonly setExpanded: (id: string, open: boolean) => void;
  readonly selected: ReadonlySet<string>;
  readonly select: (id: string, additive: boolean) => void;
  readonly multiSelect: boolean;
  readonly showIcons: boolean;
  readonly showLines: boolean;
}

const TreeContext = React.createContext<TreeContextValue | null>(null);

function useTree(): TreeContextValue {
  const ctx = React.use(TreeContext);
  if (!ctx) {
    throw new Error('Tree subcomponents must be rendered inside <Tree>.');
  }
  return ctx;
}

/**
 * Small controllable-set helper: uncontrolled by default, but yields to a
 * caller-provided `controlled` value + `onChange` when present.
 */
function useControllableSet(
  controlled: readonly string[] | undefined,
  defaultValue: readonly string[] | undefined,
  onChange: ((ids: string[]) => void) | undefined
): readonly [ReadonlySet<string>, (next: ReadonlySet<string>) => void] {
  const [uncontrolled, setUncontrolled] = React.useState<ReadonlySet<string>>(
    () => new Set(defaultValue ?? [])
  );
  const isControlled = controlled !== undefined;
  const value = isControlled ? new Set(controlled) : uncontrolled;
  const setValue = React.useCallback(
    (next: ReadonlySet<string>) => {
      if (!isControlled) {
        setUncontrolled(next);
      }
      onChange?.([...next]);
    },
    [isControlled, onChange]
  );
  return [value, setValue];
}

interface TreeProps extends Omit<React.ComponentProps<'ul'>, 'onSelect'> {
  /** Folder ids open on first render (uncontrolled). */
  readonly defaultExpandedIds?: readonly string[];
  /** Open folder ids (controlled). Pair with `onExpandedChange`. */
  readonly expandedIds?: readonly string[];
  /** Fires with the next set of open folder ids whenever a folder toggles. */
  readonly onExpandedChange?: (ids: string[]) => void;
  /** Selected node ids on first render (uncontrolled). */
  readonly defaultSelectedIds?: readonly string[];
  /** Selected node ids (controlled). Pair with `onSelectedChange`. */
  readonly selectedIds?: readonly string[];
  /** Fires with the next set of selected node ids whenever selection changes. */
  readonly onSelectedChange?: (ids: string[]) => void;
  /** Allow more than one node to be selected (Cmd/Ctrl-click extends). */
  readonly multiSelect?: boolean;
  /** Render folder/file glyphs beside each label. Defaults to `true`. */
  readonly showIcons?: boolean;
  /** Draw vertical guide lines connecting nested items. Defaults to `false`. */
  readonly showLines?: boolean;
  /**
   * Fires once with a node's id the first time it expands (the open transition).
   * Use it to lazy-load that node's children from an API — mark the node `lazy`
   * so it shows a chevron before its children exist, and toggle its `loading`
   * prop while the request is in flight.
   */
  readonly onExpand?: (id: string) => void;
}

function Tree({
  defaultExpandedIds,
  expandedIds,
  onExpandedChange,
  defaultSelectedIds,
  selectedIds,
  onSelectedChange,
  multiSelect = false,
  showIcons = true,
  showLines = false,
  onExpand,
  className,
  children,
  ...props
}: TreeProps) {
  const [expanded, writeExpanded] = useControllableSet(
    expandedIds,
    defaultExpandedIds,
    onExpandedChange
  );
  const [selected, writeSelected] = useControllableSet(
    selectedIds,
    defaultSelectedIds,
    onSelectedChange
  );

  const setExpanded = React.useCallback(
    (id: string, open: boolean) => {
      // Fire `onExpand` only on a genuine closed → open transition so
      // consumers can lazy-load a node's children exactly once per open.
      if (open && !expanded.has(id)) {
        onExpand?.(id);
      }
      const next = new Set(expanded);
      if (open) {
        next.add(id);
      } else {
        next.delete(id);
      }
      writeExpanded(next);
    },
    [expanded, writeExpanded, onExpand]
  );

  const toggleExpanded = React.useCallback(
    (id: string) => {
      setExpanded(id, !expanded.has(id));
    },
    [expanded, setExpanded]
  );

  const select = React.useCallback(
    (id: string, additive: boolean) => {
      if (multiSelect && additive) {
        const next = new Set(selected);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        writeSelected(next);
        return;
      }
      writeSelected(new Set([id]));
    },
    [multiSelect, selected, writeSelected]
  );

  const ctx = React.useMemo<TreeContextValue>(
    () => ({
      expanded,
      toggleExpanded,
      setExpanded,
      selected,
      select,
      multiSelect,
      showIcons,
      showLines,
    }),
    [expanded, toggleExpanded, setExpanded, selected, select, multiSelect, showIcons, showLines]
  );

  return (
    <TreeContext value={ctx}>
      <ul
        // biome-ignore lint/a11y/useSemanticElements: ARIA tree pattern requires role="tree" on the list.
        role="tree"
        aria-multiselectable={multiSelect || undefined}
        data-slot="tree"
        className={cn('space-y-0.5 text-sm', className)}
        {...props}
      >
        {children}
      </ul>
    </TreeContext>
  );
}

const TREEITEM_SELECTOR = '[role="treeitem"]';

function rowsOf(el: HTMLElement): HTMLElement[] {
  const root = el.closest<HTMLElement>('[role="tree"]');
  if (!root) {
    return [];
  }
  return [...root.querySelectorAll<HTMLElement>(TREEITEM_SELECTOR)];
}

function focusRelative(el: HTMLElement, delta: number) {
  const rows = rowsOf(el);
  const index = rows.indexOf(el);
  const next = rows[index + delta];
  next?.focus();
}

interface TreeItemProps extends Omit<React.ComponentProps<'li'>, 'id' | 'onSelect'> {
  /** Stable identifier used for expansion and selection state. */
  readonly nodeId: string;
  /** Row label. */
  readonly label: React.ReactNode;
  /** Override the default folder/file glyph. */
  readonly icon?: React.ReactNode;
  /** Block expansion and selection for this node. */
  readonly disabled?: boolean;
  /**
   * Treat this node as an expandable folder even before its children exist,
   * so it shows a chevron and can be opened. Pair with the Tree's `onExpand`
   * to fetch children on demand. Defaults to `false`.
   */
  readonly lazy?: boolean;
  /**
   * Show a spinner in place of children while they are being fetched. Has an
   * effect only on a `lazy` (or otherwise childless) open node.
   */
  readonly loading?: boolean;
}

function TreeItem({
  nodeId,
  label,
  icon,
  disabled = false,
  lazy = false,
  loading = false,
  className,
  children,
  ...props
}: TreeItemProps) {
  const { expanded, toggleExpanded, setExpanded, selected, select, showIcons, showLines } =
    useTree();

  const childNodes = React.Children.toArray(children);
  const hasChildren = childNodes.length > 0;
  // A "branch" is anything that can expand: it has children now, or it's a
  // lazy node whose children will be loaded on first open.
  const isBranch = hasChildren || lazy;
  const open = isBranch && expanded.has(nodeId);
  const isSelected = selected.has(nodeId);

  const activate = (additive: boolean) => {
    if (disabled) {
      return;
    }
    select(nodeId, additive);
    if (isBranch) {
      toggleExpanded(nodeId);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLLIElement>) => {
    // Ignore key events that bubbled up from a nested row.
    if (event.target !== event.currentTarget) {
      return;
    }
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        focusRelative(event.currentTarget, 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        focusRelative(event.currentTarget, -1);
        break;
      case 'Home':
        event.preventDefault();
        rowsOf(event.currentTarget)[0]?.focus();
        break;
      case 'End':
        event.preventDefault();
        rowsOf(event.currentTarget).at(-1)?.focus();
        break;
      case 'ArrowRight':
        if (isBranch && !open) {
          event.preventDefault();
          setExpanded(nodeId, true);
        } else if (isBranch && open) {
          event.preventDefault();
          focusRelative(event.currentTarget, 1);
        }
        break;
      case 'ArrowLeft':
        if (isBranch && open) {
          event.preventDefault();
          setExpanded(nodeId, false);
        } else {
          const parent = event.currentTarget.parentElement?.closest<HTMLElement>(TREEITEM_SELECTOR);
          if (parent) {
            event.preventDefault();
            parent.focus();
          }
        }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        activate(event.metaKey || event.ctrlKey);
        break;
      default:
        break;
    }
  };

  const DefaultIcon = isBranch ? (open ? FolderOpen : Folder) : FileIcon;

  return (
    <li
      // biome-ignore lint/a11y/useSemanticElements: ARIA tree pattern requires role="treeitem".
      role="treeitem"
      aria-expanded={isBranch ? open : undefined}
      aria-selected={isSelected}
      aria-disabled={disabled || undefined}
      aria-busy={(open && loading) || undefined}
      data-state={isBranch ? (open ? 'open' : 'closed') : undefined}
      data-selected={isSelected || undefined}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
      className={cn('group/treeitem block outline-none', className)}
      {...props}
    >
      {/** biome-ignore lint/a11y/useKeyWithClickEvents: keyboard handling lives on the treeitem above. */}
      <div
        data-slot="tree-item"
        onClick={(event) => {
          event.currentTarget.closest<HTMLElement>(TREEITEM_SELECTOR)?.focus();
          activate(event.metaKey || event.ctrlKey);
        }}
        className={cn(
          'tree corner-themed flex select-none items-center rounded-tree transition-colors group-focus-visible/treeitem:ring-themed',
          "[&_svg]:size-4 [&_svg]:shrink-0",
          disabled ? 'pointer-events-none opacity-50' : 'cursor-pointer',
          isSelected
            ? 'bg-tree-selected text-tree-selected-label'
            : 'text-tree-label hover:bg-tree-item-hover'
        )}
      >
        {isBranch ? (
          <ChevronRight
            className={cn('shrink-0 text-tree-icon transition-transform', open && 'rotate-90')}
            aria-hidden
          />
        ) : (
          <span className="size-4 shrink-0" aria-hidden />
        )}
        {showIcons ? (
          icon ?? <DefaultIcon className="shrink-0 text-tree-icon" aria-hidden />
        ) : null}
        <span className="truncate">{label}</span>
      </div>
      {isBranch && open ? (
        <ul
          // biome-ignore lint/a11y/useSemanticElements: ARIA tree pattern requires role="group" on nested lists.
          role="group"
          className={cn('mt-0.5 space-y-0.5', showLines && 'border-tree-guide border-s ps-2')}
          style={{ marginInlineStart: 'var(--tree-indent)' }}
        >
          {loading && !hasChildren ? (
            <li role="none" className="tree flex select-none items-center text-tree-icon">
              <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
              <span className="truncate text-sm">Loading…</span>
            </li>
          ) : (
            children
          )}
        </ul>
      ) : null}
    </li>
  );
}

export { Tree, TreeItem };
