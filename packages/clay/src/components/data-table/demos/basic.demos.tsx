'use client';

import { Badge } from '@brika/clay/components/badge';
import { DataTable } from '@brika/clay/components/data-table';
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

const basicData: Payment[] = [
  { id: 'INV-001', status: 'paid', method: 'credit_card', amount: 129, email: 'lena@acme.io' },
  { id: 'INV-002', status: 'pending', method: 'paypal', amount: 42.5, email: 'mateo@northwind.dev' },
  { id: 'INV-003', status: 'failed', method: 'credit_card', amount: 980.75, email: 'priya@globex.com' },
  { id: 'INV-004', status: 'paid', method: 'bank_transfer', amount: 2450, email: 'jonas@hooli.io' },
  { id: 'INV-005', status: 'paid', method: 'paypal', amount: 18.99, email: 'aiko@initech.jp' },
  { id: 'INV-006', status: 'pending', method: 'credit_card', amount: 312.4, email: 'sam@umbrella.co' },
];

const baseColumns: ColumnDef<Payment>[] = [
  { accessorKey: 'id', header: 'Invoice' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={statusVariant[status]} className="capitalize">
          {status}
        </Badge>
      );
    },
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
    cell: ({ row }) => (
      <div className="text-right tabular-nums">{currency.format(row.original.amount)}</div>
    ),
  },
];

/** Compact invoice table, no sorting or pagination, status badges + right-aligned currency cells. */
export default function DataTableBasicDemo() {
  return <DataTable columns={baseColumns} data={basicData} enableSorting={false} pageSize={0} />;
}
