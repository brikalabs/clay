import { Input } from '@brika/clay/components/input';
import { Label } from '@brika/clay/components/label';

/** Required field, add an asterisk inside a span to signal mandatory status. */
export default function LabelRequiredDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-1.5">
      <Label htmlFor="username-demo">
        Username <span className="text-destructive" aria-hidden="true">*</span>
      </Label>
      <Input id="username-demo" placeholder="brika_user" required />
    </div>
  );
}
