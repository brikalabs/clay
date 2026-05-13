import { PasswordInput } from '@brika/clay/components/password-input';

/** Password field with lock icon and eye toggle to reveal characters. */
export default function PasswordInputDefaultDemo() {
  return (
    <div className="w-full max-w-xs">
      <PasswordInput placeholder="Enter your password" />
    </div>
  );
}
