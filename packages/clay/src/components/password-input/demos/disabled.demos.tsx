import { PasswordInput } from '@brika/clay/components/password-input';

/** Disabled password input, preserves layout, all interactions blocked. */
export default function PasswordInputDisabledDemo() {
  return (
    <div className="w-full max-w-xs">
      <PasswordInput disabled defaultValue="disabled-value" />
    </div>
  );
}
