/**
 * Shared fixtures + cell renderers for `DataTable` demos. Co-located here so
 * the three demo files don't ship three copies of the same Payment shape,
 * currency formatter, status/method dictionaries, and column definitions.
 */

import { Badge } from '@brika/clay/components/badge';
import { DataTableColumnHeader } from '@brika/clay/components/data-table';
import type { ColumnDef } from '@tanstack/react-table';

export interface Payment {
  id: string;
  status: 'paid' | 'pending' | 'failed';
  method: 'credit_card' | 'paypal' | 'bank_transfer';
  amount: number;
  email: string;
}

export const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const statusVariant: Record<
  Payment['status'],
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  paid: 'default',
  pending: 'secondary',
  failed: 'destructive',
};

export const methodLabel: Record<Payment['method'], string> = {
  credit_card: 'Credit card',
  paypal: 'PayPal',
  bank_transfer: 'Bank transfer',
};

/** First six invoices, used by every demo. The sortable demo extends with more rows. */
export const paymentRows: Payment[] = [
  { id: 'INV-001', status: 'paid', method: 'credit_card', amount: 129, email: 'lena@acme.io' },
  { id: 'INV-002', status: 'pending', method: 'paypal', amount: 42.5, email: 'mateo@northwind.dev' },
  { id: 'INV-003', status: 'failed', method: 'credit_card', amount: 980.75, email: 'priya@globex.com' },
  { id: 'INV-004', status: 'paid', method: 'bank_transfer', amount: 2450, email: 'jonas@hooli.io' },
  { id: 'INV-005', status: 'paid', method: 'paypal', amount: 18.99, email: 'aiko@initech.jp' },
  { id: 'INV-006', status: 'pending', method: 'credit_card', amount: 312.4, email: 'sam@umbrella.co' },
];

/** Status pill — shared by every demo's `status` column. */
export function StatusCell({ status }: { readonly status: Payment['status'] }) {
  return (
    <Badge variant={statusVariant[status]} className="capitalize">
      {status}
    </Badge>
  );
}

/** Right-aligned currency cell — shared by every demo's `amount` column. */
export function AmountCell({ value }: { readonly value: number }) {
  return <div className="text-right tabular-nums">{currency.format(value)}</div>;
}

/** Plain text headers, no sort affordance. */
export const basicColumns: ColumnDef<Payment>[] = [
  { accessorKey: 'id', header: 'Invoice' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusCell status={row.original.status} />,
  },
  { accessorKey: 'email', header: 'Email' },
  {
    accessorKey: 'method',
    header: 'Method',
    cell: ({ row }) => methodLabel[row.original.method],
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => <AmountCell value={row.original.amount} />,
  },
];

/** Email + Amount are sortable via `DataTableColumnHeader`; ID/status/method are not. */
export const sortableColumns: ColumnDef<Payment>[] = [
  { accessorKey: 'id', header: 'Invoice', enableSorting: false },
  {
    accessorKey: 'status',
    header: 'Status',
    enableSorting: false,
    cell: ({ row }) => <StatusCell status={row.original.status} />,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column}>Email</DataTableColumnHeader>
    ),
  },
  {
    accessorKey: 'method',
    header: 'Method',
    enableSorting: false,
    cell: ({ row }) => methodLabel[row.original.method],
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <div className="flex justify-end">
        <DataTableColumnHeader column={column}>Amount</DataTableColumnHeader>
      </div>
    ),
    cell: ({ row }) => <AmountCell value={row.original.amount} />,
  },
];
