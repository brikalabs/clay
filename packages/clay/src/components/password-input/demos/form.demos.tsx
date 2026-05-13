import { Label } from '@brika/clay/components/label';
import { PasswordInput } from '@brika/clay/components/password-input';

/** Full sign-in form context, password input paired with an email input and submit button. */
export default function PasswordInputFormDemo() {
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
