import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@brika/clay/components/card';
/** Interactive card with hover lift, wrap in an anchor for full link behaviour. */
export default function CardInteractiveDemo() {
  return (
    <Card interactive className="w-72 cursor-pointer">
      <CardHeader>
        <CardTitle>Hover me</CardTitle>
        <CardDescription>Interactive cards lift on hover and can wrap any clickable element.</CardDescription>
      </CardHeader>
    </Card>
  );
}
