'use client';

import { Badge } from '@brika/clay/components/badge';
import {
  DataTable,
  DataTableColumnHeader,
} from '@brika/clay/components/data-table';
import type { ColumnDef } from '@tanstack/react-table';
interface Payment {
  id: string;
  status: 'paid' | 'pending' | 'failed';
  method: 'credit_card' | 'paypal' | 'bank_transfer';
  amount: number;
  email: string;
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const statusVariant: Record<
  Payment['status'],
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  paid: 'default',
  pending: 'secondary',
  failed: 'destructive',
};

const methodLabel: Record<Payment['method'], string> = {
  credit_card: 'Credit card',
  paypal: 'PayPal',
  bank_transfer: 'Bank transfer',
};

const sortableData: Payment[] = [
  { id: 'INV-001', status: 'paid', method: 'credit_card', amount: 129, email: 'lena@acme.io' },
  { id: 'INV-002', status: 'pending', method: 'paypal', amount: 42.5, email: 'mateo@northwind.dev' },
  { id: 'INV-003', status: 'failed', method: 'credit_card', amount: 980.75, email: 'priya@globex.com' },
  { id: 'INV-004', status: 'paid', method: 'bank_transfer', amount: 2450, email: 'jonas@hooli.io' },
  { id: 'INV-005', status: 'paid', method: 'paypal', amount: 18.99, email: 'aiko@initech.jp' },
  { id: 'INV-006', status: 'pending', method: 'credit_card', amount: 312.4, email: 'sam@umbrella.co' },
  { id: 'INV-007', status: 'paid', method: 'credit_card', amount: 76.2, email: 'dani@stark.io' },
  { id: 'INV-008', status: 'failed', method: 'bank_transfer', amount: 540, email: 'oksana@tessier.fr' },
  { id: 'INV-009', status: 'paid', method: 'paypal', amount: 219.99, email: 'bea@aperture.dev' },
  { id: 'INV-010', status: 'pending', method: 'bank_transfer', amount: 88, email: 'ravi@blackmesa.org' },
  { id: 'INV-011', status: 'paid', method: 'credit_card', amount: 1499, email: 'noor@cyberdyne.ai' },
  { id: 'INV-012', status: 'failed', method: 'paypal', amount: 12, email: 'yuki@pied-piper.io' },
];

const sortableColumns: ColumnDef<Payment>[] = [
  { accessorKey: 'id', header: 'Invoice', enableSorting: false },
  {
    accessorKey: 'status',
    header: 'Status',
    enableSorting: false,
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={statusVariant[status]} className="capitalize">
          {status}
        </Badge>
      );
    },
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
    cell: ({ row }) => (
      <div className="text-right tabular-nums">{currency.format(row.original.amount)}</div>
    ),
  },
];

/** Sortable headers via `DataTableColumnHeader`, click Email or Amount to toggle asc/desc/clear. */
export default function DataTableSortableDemo() {
  return <DataTable columns={sortableColumns} data={sortableData} pageSize={0} />;
}
