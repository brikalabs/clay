import {
  Field,
  FieldError,
  FieldLabel,
} from '@brika/clay/components/field';
import { Input } from '@brika/clay/components/input';

/** Invalid state pairs `aria-invalid` on the control with `<FieldError>`. */
export default function FieldErrorDemo() {
  return (
    <Field>
      <FieldLabel htmlFor="email-error">Email</FieldLabel>
      <Input
        id="email-error"
        type="email"
        aria-invalid="true"
        placeholder="you@example.com"
      />
      <FieldError>Email is required.</FieldError>
    </Field>
  );
}
