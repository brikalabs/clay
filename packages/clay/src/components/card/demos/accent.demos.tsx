import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@brika/clay/components/card';
/** Six accent variants mapped to the theme data-* palette. */
export default function CardAccentDemo() {
  const accents = ['blue', 'emerald', 'orange', 'violet', 'purple', 'amber'] as const;
  return (
    <div className="flex flex-wrap gap-3">
      {accents.map((accent) => (
        <Card key={accent} accent={accent} className="w-36">
          <CardHeader>
            <CardTitle className="capitalize text-sm">{accent}</CardTitle>
            <CardDescription className="text-xs">data-{accents.indexOf(accent) + 1}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
