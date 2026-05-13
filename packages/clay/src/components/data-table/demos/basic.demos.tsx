'use client';

import { DataTable } from '@brika/clay/components/data-table';
import { basicColumns, paymentRows } from '../data-table.demo-data';

/** Compact invoice table, no sorting or pagination, status badges + right-aligned currency cells. */
export default function DataTableBasicDemo() {
  return <DataTable columns={basicColumns} data={paymentRows} enableSorting={false} pageSize={0} />;
}
