'use client';

import { DataTable } from '@brika/clay/components/data-table';
import { type Payment, sortableColumns } from '../data-table.demo-data';

const STATUSES: Payment['status'][] = ['paid', 'pending', 'failed'];
const METHODS: Payment['method'][] = ['credit_card', 'paypal', 'bank_transfer'];
const HANDLES = ['lena', 'mateo', 'priya', 'jonas', 'aiko', 'sam', 'dani', 'oksana', 'bea', 'ravi', 'noor', 'yuki', 'amir', 'zoe', 'kai'];
const DOMAINS = ['acme.io', 'northwind.dev', 'globex.com', 'hooli.io', 'initech.jp', 'umbrella.co', 'stark.io', 'tessier.fr'];

const paginatedData: Payment[] = Array.from({ length: 25 }, (_, i) => ({
  id: `INV-${String(101 + i).padStart(4, '0')}`,
  status: STATUSES[i % STATUSES.length],
  method: METHODS[(i * 2) % METHODS.length],
  amount: Math.round((20 + i * 47.3) * 100) / 100,
  email: `${HANDLES[i % HANDLES.length]}@${DOMAINS[i % DOMAINS.length]}`,
}));

/** Sorting + pagination together, 25 rows broken into pages of 5. */
export default function DataTablePaginatedDemo() {
  return <DataTable columns={sortableColumns} data={paginatedData} pageSize={5} />;
}
