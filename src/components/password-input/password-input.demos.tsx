import { Label } from '@brika/clay/components/label';
import { PasswordInput } from '@brika/clay/components/password-input';
import { defineDemos } from '../_registry';

/** Password field with lock icon and eye toggle to reveal characters. */
export function PasswordInputDefaultDemo() {
  return (
    <div className="w-full max-w-xs">
      <PasswordInput placeholder="Enter your password" />
    </div>
  );
}

/** Invalid state surfaced via aria-invalid, shows destructive ring and border. */
export function PasswordInputInvalidDemo() {
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

/** Disabled password input, preserves layout, all interactions blocked. */
export function PasswordInputDisabledDemo() {
  return (
    <div className="w-full max-w-xs">
      <PasswordInput disabled defaultValue="disabled-value" />
    </div>
  );
}

/** Full sign-in form context, password input paired with an email input and submit button. */
export function PasswordInputFormDemo() {
  return (
    <form className="w-full max-w-xs space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-1.5">
        <Label htmlFor="pw-email">Email</Label>
        <input
          id="pw-email"
          type="email"
          placeholder="you@example.com"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="pw-form">Password</Label>
        <PasswordInput id="pw-form" placeholder="Enter your password" />
      </div>
    </form>
  );
}

export const demoMeta = defineDemos([
  [PasswordInputDefaultDemo, 'Default', { description: `Password field with lock icon and eye toggle to reveal characters.` }],
  [PasswordInputInvalidDemo, 'Invalid', { description: `Invalid state surfaced via aria-invalid, shows destructive ring and border.` }],
  [PasswordInputDisabledDemo, 'Disabled', { description: `Disabled password input, preserves layout, all interactions blocked.` }],
  [PasswordInputFormDemo, 'Form', { description: `Full sign-in form context, password input paired with an email input and submit button.` }],
]);
export const accessibility: readonly string[] = [
  `The reveal toggle carries \`aria-label\` that updates between "Show password" and "Hide password".`,
  `The underlying input switches between \`type="password"\` and \`type="text"\`, AT announces the mode change.`,
  `\`aria-invalid="true"\` triggers the destructive ring; pair with a visible error message.`,
  `Autocomplete attributes (\`autocomplete="current-password"\`) improve password-manager integration.`,
];
