import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@brika/clay/components/card';
/** Plain card with header and body content. */
export default function CardDefaultDemo() {
  return (
    <Card className="w-72">
      <CardHeader>
        <CardTitle>Welcome to Clay</CardTitle>
        <CardDescription>Pressable raw material for every Brika surface.</CardDescription>
      </CardHeader>
      <CardContent>Build UI with tokens that travel between apps.</CardContent>
    </Card>
  );
}
