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
 * Tracks nesting depth so each row can indent its content and draw guide
 * lines at the correct horizontal positions without relying on nested margin
 * wrappers.
 */
const DepthContext = React.createContext<number>(0);

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

interface TreeProps extends Omit<React.ComponentProps<'div'>, 'onSelect'> {
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
   * Use it to lazy-load that node's children from an API: mark the node `lazy`
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
}: Readonly<TreeProps>) {
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
      <div
        // biome-ignore lint/a11y/useSemanticElements: ARIA tree pattern requires role="tree".
        role="tree"
        aria-multiselectable={multiSelect || undefined}
        data-slot="tree"
        className={cn('space-y-0.5 text-sm', className)}
        {...props}
      >
        {children}
      </div>
    </TreeContext>
  );
}

const TREEITEM_SELECTOR = '[role="treeitem"]';
const ROW_SELECTOR = '[data-slot="tree-item-row"]';

function rowsOf(el: HTMLElement): HTMLElement[] {
  const root = el.closest<HTMLElement>('[role="tree"]');
  if (!root) {
    return [];
  }
  return [...root.querySelectorAll<HTMLElement>(TREEITEM_SELECTOR)];
}

function focusRelative(el: HTMLElement, delta: number) {
  const rows = rowsOf(el);
  if (rows.length === 0) {
    return;
  }
  const index = rows.indexOf(el);
  // Wrap around: ArrowDown past the last row focuses the first, and vice versa.
  rows[(index + delta + rows.length) % rows.length]?.focus();
}

// Type-ahead: typing jumps to the next node whose label starts with the buffer,
// which clears after a short pause; repeating one key cycles items starting with it.
// ponytail: one shared buffer module-wide, fine since two trees are never typed
// into at the same instant; scope per-tree only if that ever happens.
let typeahead = '';
let typeaheadTimer: ReturnType<typeof setTimeout> | undefined;

function rowLabel(el: HTMLElement): string {
  return el.querySelector(ROW_SELECTOR)?.textContent?.trim().toLowerCase() ?? '';
}

function handleTypeahead(el: HTMLElement, char: string) {
  clearTimeout(typeaheadTimer);
  typeahead += char.toLowerCase();
  typeaheadTimer = setTimeout(() => {
    typeahead = '';
  }, 500);
  // A run of the same key cycles by that single letter instead of narrowing.
  const query = [...typeahead].every((c) => c === typeahead[0]) ? typeahead.slice(0, 1) : typeahead;
  const rows = rowsOf(el);
  const start = Math.max(0, rows.indexOf(el));
  for (let i = 1; i <= rows.length; i += 1) {
    const row = rows[(start + i) % rows.length];
    if (row && rowLabel(row).startsWith(query)) {
      row.focus();
      return;
    }
  }
}

interface TreeKeyHandlers {
  readonly nodeId: string;
  readonly isBranch: boolean;
  readonly open: boolean;
  readonly setExpanded: (id: string, open: boolean) => void;
  readonly activate: (additive: boolean) => void;
}

/**
 * Keyboard model for a single tree node. Extracted from `TreeItem` so the
 * component stays under Sonar's cognitive-complexity budget.
 */
type TreeKeyHandler = (event: React.KeyboardEvent<HTMLDivElement>, opts: TreeKeyHandlers) => void;

function handleArrowRight(event: React.KeyboardEvent<HTMLDivElement>, opts: TreeKeyHandlers) {
  if (!opts.isBranch) {
    return;
  }
  if (opts.open) {
    focusRelative(event.currentTarget, 1);
  } else {
    opts.setExpanded(opts.nodeId, true);
  }
}

function handleArrowLeft(event: React.KeyboardEvent<HTMLDivElement>, opts: TreeKeyHandlers) {
  if (opts.isBranch && opts.open) {
    opts.setExpanded(opts.nodeId, false);
    return;
  }
  event.currentTarget.parentElement?.closest<HTMLElement>(TREEITEM_SELECTOR)?.focus();
}

// One small handler per key keeps each function (and the dispatcher) well
// under Sonar's cognitive-complexity budget (no nested switch).
const TREE_KEY_HANDLERS: Readonly<Record<string, TreeKeyHandler>> = {
  ArrowDown: (event) => focusRelative(event.currentTarget, 1),
  ArrowUp: (event) => focusRelative(event.currentTarget, -1),
  Home: (event) => rowsOf(event.currentTarget)[0]?.focus(),
  End: (event) => rowsOf(event.currentTarget).at(-1)?.focus(),
  ArrowRight: handleArrowRight,
  ArrowLeft: handleArrowLeft,
  Enter: (event, opts) => opts.activate(event.metaKey || event.ctrlKey),
  ' ': (event, opts) => opts.activate(event.metaKey || event.ctrlKey),
};

function handleTreeItemKeyDown(event: React.KeyboardEvent<HTMLDivElement>, opts: TreeKeyHandlers) {
  // Ignore key events that bubbled up from a nested row.
  if (event.target !== event.currentTarget) {
    return;
  }
  const handler = TREE_KEY_HANDLERS[event.key];
  if (handler) {
    event.preventDefault();
    handler(event, opts);
    return;
  }
  // Type-ahead: a printable single character jumps to the next matching label.
  if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
    event.preventDefault();
    handleTypeahead(event.currentTarget, event.key);
  }
}

interface TreeItemProps extends Omit<React.ComponentProps<'div'>, 'id' | 'onSelect'> {
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

function handleTreeItemClick(
  event: React.MouseEvent<HTMLDivElement>,
  activate: (additive: boolean) => void
) {
  // Only act on clicks within this node's own row, not ones bubbling up from a
  // nested treeitem.
  const target = event.target;
  if (
    target instanceof Element &&
    target.closest(ROW_SELECTOR)?.parentElement === event.currentTarget
  ) {
    event.currentTarget.focus();
    activate(event.metaKey || event.ctrlKey);
  }
}

/**
 * Vertical guide lines drawn as absolutely-positioned hairlines at each
 * ancestor depth level. Because every row is full-width and stacked, lines
 * at the same x position across consecutive rows visually merge into a
 * single continuous vertical guide (no SVG or DOM spanning required).
 */
function GuideLines({ depth }: Readonly<{ depth: number }>) {
  return (
    <>
      {Array.from({ length: depth }, (_, k) => (
        <span
          key={k}
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-px bg-tree-guide"
          // Each guide sits at the right side of the indent band for ancestor k,
          // aligned with the chevron column of that ancestor row above.
          style={{ left: `calc(var(--tree-indent) * ${k + 1} + var(--tree-padding-x) - 1px)` }}
        />
      ))}
    </>
  );
}

/** The clickable row: chevron / glyph / label. Presentational only. */
function TreeRow({
  isBranch,
  open,
  isSelected,
  disabled,
  showIcons,
  showLines,
  depth,
  icon,
  label,
}: Readonly<{
  isBranch: boolean;
  open: boolean;
  isSelected: boolean;
  disabled: boolean;
  showIcons: boolean;
  showLines: boolean;
  depth: number;
  icon: React.ReactNode;
  label: React.ReactNode;
}>) {
  const FolderIcon = open ? FolderOpen : Folder;
  return (
    <div
      data-slot="tree-item-row"
      className={cn(
        // Full-width row, no rounding; selection highlight spans edge to edge.
        'tree relative flex select-none items-center py-[var(--tree-padding-y)] transition-colors',
        '[&_svg]:size-4 [&_svg]:shrink-0',
        disabled ? 'pointer-events-none opacity-50' : 'cursor-pointer',
        isSelected
          ? 'bg-tree-selected text-tree-selected-label'
          : 'text-tree-label hover:bg-tree-item-hover'
      )}
      // Content indents by depth via padding; the row itself stays full-width so
      // the selection background and accent bar reach the tree's left edge.
      style={{
        paddingInlineStart: `calc(var(--tree-indent) * ${depth} + var(--tree-padding-x))`,
        paddingInlineEnd: `var(--tree-padding-x)`,
      }}
    >
      {/* Accent bar: 3 px wide, square, flush at the tree's left edge regardless of depth. */}
      {isSelected && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[3px] bg-tree-selected-accent"
        />
      )}
      {/* Guide lines per ancestor depth level; same x across rows creates continuous verticals. */}
      {showLines && depth > 0 && <GuideLines depth={depth} />}
      {isBranch ? (
        <ChevronRight
          className={cn('shrink-0 text-tree-icon transition-transform', open && 'rotate-90')}
          aria-hidden
        />
      ) : (
        <span className="size-4 shrink-0" aria-hidden />
      )}
      {showIcons
        ? (icon ?? (isBranch
            ? (
              <FolderIcon
                className={cn(
                  'shrink-0',
                  isSelected ? 'text-tree-selected-label' : 'text-tree-folder-icon'
                )}
                aria-hidden
              />
            )
            : <FileIcon className="shrink-0 text-tree-icon" aria-hidden />))
        : null}
      <span
        className={cn(
          'truncate',
          isBranch && 'font-semibold',
          // Unselected file labels are muted; folder labels stay bold via font-semibold.
          !isSelected && !isBranch && 'text-tree-icon'
        )}
      >
        {label}
      </span>
    </div>
  );
}

/** The nested children container, or a loading spinner while they fetch. */
function TreeItemGroup({
  isBranch,
  open,
  loading,
  hasChildren,
  children,
}: Readonly<{
  isBranch: boolean;
  open: boolean;
  loading: boolean;
  hasChildren: boolean;
  children: React.ReactNode;
}>) {
  // Rendered inside the parent's <DepthContext value={depth + 1}>, so this is
  // already the children's depth: indent the loading row to that same level.
  const depth = React.use(DepthContext);
  if (!isBranch || !open) {
    return null;
  }
  // A <fieldset> carries an implicit role="group", which is exactly the ARIA tree
  // pattern for a node's children, without a literal interactive role.
  return (
    <fieldset className="m-0 min-w-0 space-y-0.5 border-0 p-0">
      {loading && !hasChildren ? (
        <div
          className="tree flex select-none items-center py-[var(--tree-padding-y)] text-tree-icon"
          style={{
            paddingInlineStart: `calc(var(--tree-indent) * ${depth} + var(--tree-padding-x))`,
          }}
        >
          <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
          <span className="truncate text-sm">Loading…</span>
        </div>
      ) : (
        children
      )}
    </fieldset>
  );
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
}: Readonly<TreeItemProps>) {
  const { expanded, toggleExpanded, setExpanded, selected, select, showIcons, showLines } =
    useTree();
  const depth = React.use(DepthContext);

  const hasChildren = React.Children.toArray(children).length > 0;
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

  let dataState: 'open' | 'closed' | undefined;
  if (isBranch) {
    dataState = open ? 'open' : 'closed';
  }

  return (
    <div
      // biome-ignore lint/a11y/useSemanticElements: ARIA tree pattern requires role="treeitem".
      role="treeitem"
      aria-expanded={isBranch ? open : undefined}
      aria-selected={isSelected}
      aria-disabled={disabled || undefined}
      aria-busy={(open && loading) || undefined}
      data-state={dataState}
      data-selected={isSelected || undefined}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(event) =>
        handleTreeItemKeyDown(event, { nodeId, isBranch, open, setExpanded, activate })
      }
      onClick={(event) => handleTreeItemClick(event, activate)}
      className={cn(
        'block outline-none',
        // Keyboard focus: a subtle inset ring on THIS item's own row only. Scoped
        // to the direct-child row so focusing a folder does not ring every nested
        // descendant (a named group would, since they share the name).
        '[&:focus-visible>[data-slot=tree-item-row]]:ring-2 [&:focus-visible>[data-slot=tree-item-row]]:ring-ring [&:focus-visible>[data-slot=tree-item-row]]:ring-offset-2 [&:focus-visible>[data-slot=tree-item-row]]:ring-offset-background',
        // cmdk-style active highlight: a background on the focused row, unselected
        // rows only so it never clobbers the selection color.
        '[&:not([data-selected]):focus-visible>[data-slot=tree-item-row]]:bg-tree-item-hover',
        className
      )}
      {...props}
    >
      <TreeRow
        isBranch={isBranch}
        open={open}
        isSelected={isSelected}
        disabled={disabled}
        showIcons={showIcons}
        showLines={showLines}
        depth={depth}
        icon={icon}
        label={label}
      />
      {/* Children render at depth + 1 so they indent one level further. */}
      <DepthContext value={depth + 1}>
        <TreeItemGroup
          isBranch={isBranch}
          open={open}
          loading={loading}
          hasChildren={hasChildren}
        >
          {children}
        </TreeItemGroup>
      </DepthContext>
    </div>
  );
}

export { Tree, TreeItem };
