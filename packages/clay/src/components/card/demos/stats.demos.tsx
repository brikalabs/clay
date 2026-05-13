import { Badge } from '@brika/clay/components/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@brika/clay/components/card';
/** Stats card showing a key metric with a trend indicator. */
export default function CardStatsDemo() {
  return (
    <Card className="w-64">
      <CardHeader>
        <CardDescription>Active users</CardDescription>
        <div className="flex items-end justify-between gap-2">
          <CardTitle className="text-3xl font-bold">2,847</CardTitle>
          <Badge variant="secondary" className="mb-0.5">+12% this week</Badge>
        </div>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm">
        Up from 2,541 last week
      </CardContent>
    </Card>
  );
}
