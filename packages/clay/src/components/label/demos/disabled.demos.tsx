import { Input } from '@brika/clay/components/input';
import { Label } from '@brika/clay/components/label';

/** Label on a disabled field, inherits reduced opacity via the peer-disabled class. */
export default function LabelDisabledDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-1.5">
      <Label htmlFor="api-key-demo" className="peer">API key</Label>
      <Input id="api-key-demo" disabled defaultValue="sk-live-••••••••" />
    </div>
  );
}
