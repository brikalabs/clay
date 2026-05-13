import { Badge } from '@brika/clay/components/badge';
import {
  Table,
  TableBody,
  TableCaption,
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

/** Full workspace members table with name, email, role, and status columns. */
export default function TableDefaultDemo() {
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
