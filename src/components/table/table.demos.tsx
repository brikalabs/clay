import { Badge } from '@brika/clay/components/badge';
import { Button } from '@brika/clay/components/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@brika/clay/components/table';
import { Pencil, Trash2 } from 'lucide-react';
import { defineDemos } from '../_registry';

const members = [
  { name: 'Alicia Reyes', email: 'alicia@brika.io', role: 'Admin', status: 'Active' },
  { name: 'Tom Hargreaves', email: 'tom@brika.io', role: 'Developer', status: 'Active' },
  { name: 'Yuki Tanaka', email: 'yuki@brika.io', role: 'Designer', status: 'Inactive' },
  { name: 'Dmitri Volkov', email: 'dmitri@brika.io', role: 'Developer', status: 'Active' },
];

/** Full workspace members table with name, email, role, and status columns. */
export function TableDefaultDemo() {
  return (
    <Table>
      <TableCaption>Workspace members</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((m) => (
          <TableRow key={m.email}>
            <TableCell className="font-medium">{m.name}</TableCell>
            <TableCell className="text-muted-foreground">{m.email}</TableCell>
            <TableCell>{m.role}</TableCell>
            <TableCell>
              <Badge variant={m.status === 'Active' ? 'default' : 'outline'}>{m.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/** Striped rows using `odd:bg-muted/40` on TableRow, no extra wrapper needed. */
export function TableStripedDemo() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((m) => (
          <TableRow key={m.email} className="odd:bg-muted/40 hover:bg-muted/60">
            <TableCell className="font-medium">{m.name}</TableCell>
            <TableCell className="text-muted-foreground">{m.email}</TableCell>
            <TableCell>{m.role}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/** Actions column with Edit and Delete icon buttons per row. */
export function TableActionDemo() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="w-20 text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((m) => (
          <TableRow key={m.email}>
            <TableCell className="font-medium">{m.name}</TableCell>
            <TableCell>{m.role}</TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1">
                <Button size="icon-sm" variant="ghost" aria-label={`Edit ${m.name}`}>
                  <Pencil className="size-3.5" />
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  aria-label={`Delete ${m.name}`}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const invoices = [
  { id: 'INV-001', date: '2024-11-01', amount: '$1,200.00' },
  { id: 'INV-002', date: '2024-11-15', amount: '$450.00' },
  { id: 'INV-003', date: '2024-12-01', amount: '$820.00' },
];

/** Dense table using `text-xs` and reduced cell padding, useful for data-heavy views. */
export function TableCompactDemo() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="h-8 text-xs">Invoice</TableHead>
          <TableHead className="h-8 text-xs">Date</TableHead>
          <TableHead className="h-8 text-right text-xs">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((inv) => (
          <TableRow key={inv.id}>
            <TableCell className="py-1 font-mono text-xs">{inv.id}</TableCell>
            <TableCell className="py-1 text-xs text-muted-foreground">{inv.date}</TableCell>
            <TableCell className="py-1 text-right text-xs font-medium">{inv.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2} className="text-xs">
            Total
          </TableCell>
          <TableCell className="text-right text-xs">$2,470.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

export const demoMeta = defineDemos([
  [TableDefaultDemo, 'Default', { description: `Full workspace members table with name, email, role, and status columns.` }],
  [TableStripedDemo, 'Striped', { description: `Striped rows using \`odd:bg-muted/40\` on TableRow, no extra wrapper needed.` }],
  [TableActionDemo, 'Action', { description: `Actions column with Edit and Delete icon buttons per row.` }],
  [TableCompactDemo, 'Compact', { description: `Dense table using \`text-xs\` and reduced cell padding, useful for data-heavy views.` }],
]);
export const accessibility: readonly string[] = [
  `Use \`<TableCaption>\` to describe the table, it becomes the accessible name via \`aria-labelledby\`.`,
  `Sortable column headers should carry \`aria-sort="ascending"\` or \`"descending"\`.`,
  `Action buttons in cells require \`aria-label\` that includes the row context (e.g. "Edit Alicia Reyes").`,
  `The table responds to standard AT table-navigation keys (e.g. Ctrl+Alt+arrows in screen readers).`,
];
