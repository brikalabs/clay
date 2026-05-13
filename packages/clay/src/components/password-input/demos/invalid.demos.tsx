import { Label } from '@brika/clay/components/label';
import { PasswordInput } from '@brika/clay/components/password-input';

/** Invalid state surfaced via aria-invalid, shows destructive ring and border. */
export default function PasswordInputInvalidDemo() {
  return (
    <div className="w-full max-w-xs space-y-1.5">
      <Label htmlFor="pw-invalid">Password</Label>
      <PasswordInput
        id="pw-invalid"
        aria-invalid="true"
        defaultValue="short"
        placeholder="Enter password"
      />
      <p className="text-destructive text-xs">Password must be at least 8 characters.</p>
    </div>
  );
}
