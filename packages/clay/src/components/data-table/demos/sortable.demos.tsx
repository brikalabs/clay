'use client';

import { DataTable } from '@brika/clay/components/data-table';
import { type Payment, paymentRows, sortableColumns } from '../data-table.demo-data';

const extraRows: Payment[] = [
  { id: 'INV-007', status: 'paid', method: 'credit_card', amount: 76.2, email: 'dani@stark.io' },
  { id: 'INV-008', status: 'failed', method: 'bank_transfer', amount: 540, email: 'oksana@tessier.fr' },
  { id: 'INV-009', status: 'paid', method: 'paypal', amount: 219.99, email: 'bea@aperture.dev' },
  { id: 'INV-010', status: 'pending', method: 'bank_transfer', amount: 88, email: 'ravi@blackmesa.org' },
  { id: 'INV-011', status: 'paid', method: 'credit_card', amount: 1499, email: 'noor@cyberdyne.ai' },
  { id: 'INV-012', status: 'failed', method: 'paypal', amount: 12, email: 'yuki@pied-piper.io' },
];

/** Sortable headers via `DataTableColumnHeader`, click Email or Amount to toggle asc/desc/clear. */
export default function DataTableSortableDemo() {
  return <DataTable columns={sortableColumns} data={[...paymentRows, ...extraRows]} pageSize={0} />;
}
