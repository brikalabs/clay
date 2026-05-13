import { Button } from '@brika/clay/components/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@brika/clay/components/table';
import { Pencil, Trash2 } from 'lucide-react';
const members = [
  { name: 'Alicia Reyes', email: 'alicia@brika.io', role: 'Admin', status: 'Active' },
  { name: 'Tom Hargreaves', email: 'tom@brika.io', role: 'Developer', status: 'Active' },
  { name: 'Yuki Tanaka', email: 'yuki@brika.io', role: 'Designer', status: 'Inactive' },
  { name: 'Dmitri Volkov', email: 'dmitri@brika.io', role: 'Developer', status: 'Active' },
];

/** Actions column with Edit and Delete icon buttons per row. */
export default function TableActionDemo() {
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
