import { Button } from '@brika/clay/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@brika/clay/components/card';
import { Input } from '@brika/clay/components/input';
import { Label } from '@brika/clay/components/label';

/** Form card pattern, title, inputs, and a footer action. */
export default function CardFormDemo() {
  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Account details</CardTitle>
        <CardDescription>Update your display name and email address.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="display-name">Display name</Label>
          <Input id="display-name" defaultValue="Jane Doe" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" defaultValue="jane@example.com" />
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save changes</Button>
      </CardFooter>
    </Card>
  );
}
