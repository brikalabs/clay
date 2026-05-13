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

const paginatedData: Payment[] = Array.from({ length: 25 }, (_, i) => {
  const statuses: Payment['status'][] = ['paid', 'pending', 'failed'];
  const methods: Payment['method'][] = ['credit_card', 'paypal', 'bank_transfer'];
  const handles = [
    'lena',
    'mateo',
    'priya',
    'jonas',
    'aiko',
    'sam',
    'dani',
    'oksana',
    'bea',
    'ravi',
    'noor',
    'yuki',
    'amir',
    'zoe',
    'kai',
  ];
  const domains = [
    'acme.io',
    'northwind.dev',
    'globex.com',
    'hooli.io',
    'initech.jp',
    'umbrella.co',
    'stark.io',
    'tessier.fr',
  ];
  return {
    id: `INV-${String(101 + i).padStart(4, '0')}`,
    status: statuses[i % statuses.length],
    method: methods[(i * 2) % methods.length],
    amount: Math.round((20 + i * 47.3) * 100) / 100,
    email: `${handles[i % handles.length]}@${domains[i % domains.length]}`,
  };
});

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

/** Sorting + pagination together, 25 rows broken into pages of 5. */
export default function DataTablePaginatedDemo() {
  return <DataTable columns={sortableColumns} data={paginatedData} pageSize={5} />;
}
