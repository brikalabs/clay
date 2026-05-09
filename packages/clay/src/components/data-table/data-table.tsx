/**
 * DataTable, a thin opinionated wrapper that pairs TanStack Table v8
 * with Clay's `Table` primitives.
 *
 * What you get:
 *   - Sortable headers (toggle asc / desc / clear, with a chevron indicator)
 *   - Optional row selection (driven by the column you pass via `columns`)
 *   - Pagination with a configurable page size
 *   - `flexRender` for both header and cell content, so anything TanStack
 *     supports (string, fn, accessor, custom cell components) just works.
 *
 * Anything more bespoke (custom toolbar, faceted filters, server-side
 * pagination, column visibility menu) is intentionally left to the
 * caller, compose it around `<DataTable>` rather than baking it in.
 *
 * Usage:
 *   const columns: ColumnDef<Person>[] = [
 *     { accessorKey: 'name', header: ({ column }) => (
 *         <DataTableColumnHeader column={column}>Name</DataTableColumnHeader>
 *       ) },
 *     { accessorKey: 'email', header: 'Email' },
 *   ];
 *
 *   <DataTable columns={columns} data={people} pageSize={20} />
 */

import {
  type Column,
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type Row,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide-react';
import * as React from 'react';

import { cn } from '../../primitives/cn';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../table/table';

type AriaSort = 'ascending' | 'descending' | 'none' | undefined;

function resolveAriaSort(sortable: boolean, sortDir: false | 'asc' | 'desc'): AriaSort {
  if (!sortable) return undefined;
  if (sortDir === 'asc') return 'ascending';
  if (sortDir === 'desc') return 'descending';
  return 'none';
}

function pickSortIcon(sortDir: false | 'asc' | 'desc') {
  if (sortDir === 'asc') return ChevronUp;
  if (sortDir === 'desc') return ChevronDown;
  return ChevronsUpDown;
}

export interface DataTableProps<TData, TValue = unknown> {
  /** TanStack column definitions. Use `accessorKey`, `accessorFn`, or `id`. */
  columns: ColumnDef<TData, TValue>[];
  /** Source rows. Reference identity is used for memoisation, keep it stable. */
  data: TData[];
  /** Page size for built-in pagination. Defaults to 10. Pass 0 to disable pagination. */
  pageSize?: number;
  /** Toggle sorting model + sort UI on column headers. Defaults to true. */
  enableSorting?: boolean;
  /** Wire up row selection state. Add a checkbox column yourself in `columns`. */
  enableRowSelection?: boolean;
  /** Fired when a body row is clicked (excludes header rows). */
  onRowClick?: (row: Row<TData>) => void;
  /** Optional empty-state message rendered when `data` resolves to zero rows. */
  emptyMessage?: React.ReactNode;
  /** Forwarded to the underlying `<Table>`. */
  className?: string;
}

function DataTable<TData, TValue = unknown>({
  columns,
  data,
  pageSize = 10,
  enableSorting = true,
  enableRowSelection = false,
  onRowClick,
  emptyMessage = 'No results.',
  className,
}: Readonly<DataTableProps<TData, TValue>>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    state: {
      ...(enableSorting ? { sorting } : {}),
      ...(enableRowSelection ? { rowSelection } : {}),
    },
    enableSorting,
    enableRowSelection,
    onSortingChange: enableSorting ? setSorting : undefined,
    onRowSelectionChange: enableRowSelection ? setRowSelection : undefined,
    getCoreRowModel: getCoreRowModel(),
    ...(enableSorting ? { getSortedRowModel: getSortedRowModel() } : {}),
    ...(pageSize > 0
      ? {
          getPaginationRowModel: getPaginationRowModel(),
          initialState: { pagination: { pageSize } },
        }
      : {}),
  });

  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;
  const columnCount = table.getAllLeafColumns().length;

  return (
    <Table data-slot="data-table" className={className}>
      <TableHeader>
        {headerGroups.map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const sortDir = header.column.getIsSorted();
              const sortable = enableSorting && header.column.getCanSort();
              const ariaSort = resolveAriaSort(sortable, sortDir);
              const headerContent = header.isPlaceholder
                ? null
                : flexRender(header.column.columnDef.header, header.getContext());
              return (
                <TableHead key={header.id} colSpan={header.colSpan} aria-sort={ariaSort}>
                  {headerContent}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {rows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columnCount} className="h-24 text-center text-muted-foreground">
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          rows.map((row) => {
            const selected = row.getIsSelected();
            return (
              <TableRow
                key={row.id}
                data-state={selected ? 'selected' : undefined}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  selected && 'bg-data-table-selected-row-bg',
                  onRowClick && 'cursor-pointer'
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}

export interface DataTableColumnHeaderProps<TData, TValue>
  extends React.ComponentProps<'button'> {
  /** The TanStack `Column` instance, given to you by the `header` render prop. */
  column: Column<TData, TValue>;
  /** Header label content. */
  children: React.ReactNode;
}

/**
 * Sortable column header. Renders the label + a chevron whose state
 * mirrors `column.getIsSorted()`:
 *   - `'asc'`  -> `ChevronUp`
 *   - `'desc'` -> `ChevronDown`
 *   - `false`  -> `ChevronsUpDown` (idle / unsorted)
 *
 * Falls back to a plain span if the column isn't sortable so callers
 * can use it unconditionally.
 */
function DataTableColumnHeader<TData, TValue>({
  column,
  children,
  className,
  ...props
}: Readonly<DataTableColumnHeaderProps<TData, TValue>>) {
  if (!column.getCanSort()) {
    return <span className={cn('font-medium', className)}>{children}</span>;
  }

  const sorted = column.getIsSorted();
  const Icon = pickSortIcon(sorted);

  return (
    <button
      type="button"
      data-slot="data-table-column-header"
      onClick={column.getToggleSortingHandler()}
      className={cn(
        '-ml-2 inline-flex h-8 items-center gap-1.5 rounded-md px-2 font-medium text-sm hover:bg-table-row-hover-bg/50 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2',
        className
      )}
      {...props}
    >
      <span>{children}</span>
      <Icon
        aria-hidden="true"
        className={cn(
          'size-3.5 text-data-table-sort-indicator-color',
          sorted === false && 'opacity-60'
        )}
      />
    </button>
  );
}

export { DataTable, DataTableColumnHeader };
