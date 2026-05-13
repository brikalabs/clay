import {
  Field,
  FieldDescription,
  FieldLabel,
} from '@brika/clay/components/field';
import { Input } from '@brika/clay/components/input';

/** Single field with label, control, and helper description. */
export default function FieldBasicDemo() {
  return (
    <Field>
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <Input id="email" type="email" placeholder="you@example.com" />
      <FieldDescription>We'll never share your email.</FieldDescription>
    </Field>
  );
}
