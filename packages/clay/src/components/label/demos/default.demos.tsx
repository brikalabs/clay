import { Input } from '@brika/clay/components/input';
import { Label } from '@brika/clay/components/label';

/** Label paired with an input, clicking the label focuses the field. */
export default function LabelDefaultDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-1.5">
      <Label htmlFor="email-demo">Email address</Label>
      <Input id="email-demo" type="email" placeholder="you@example.com" />
    </div>
  );
}
