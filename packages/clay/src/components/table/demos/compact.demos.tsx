import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@brika/clay/components/table';
const invoices = [
  { id: 'INV-001', date: '2024-11-01', amount: '$1,200.00' },
  { id: 'INV-002', date: '2024-11-15', amount: '$450.00' },
  { id: 'INV-003', date: '2024-12-01', amount: '$820.00' },
];

/** Dense table using `text-xs` and reduced cell padding, useful for data-heavy views. */
export default function TableCompactDemo() {
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
