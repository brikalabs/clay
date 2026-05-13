import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@brika/clay/components/table';
const members = [
  { name: 'Alicia Reyes', email: 'alicia@brika.io', role: 'Admin', status: 'Active' },
  { name: 'Tom Hargreaves', email: 'tom@brika.io', role: 'Developer', status: 'Active' },
  { name: 'Yuki Tanaka', email: 'yuki@brika.io', role: 'Designer', status: 'Inactive' },
  { name: 'Dmitri Volkov', email: 'dmitri@brika.io', role: 'Developer', status: 'Active' },
];

/** Striped rows using `odd:bg-muted/40` on TableRow, no extra wrapper needed. */
export default function TableStripedDemo() {
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
