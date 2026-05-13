import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@brika/clay/components/field';
import { Input } from '@brika/clay/components/input';
import { Textarea } from '@brika/clay/components/textarea';

/** `FieldGroup` stacks multiple fields with consistent vertical rhythm. */
export default function FieldGroupDemo() {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="group-name">Name</FieldLabel>
        <Input id="group-name" placeholder="Ada Lovelace" />
      </Field>
      <Field>
        <FieldLabel htmlFor="group-email">Email</FieldLabel>
        <Input
          id="group-email"
          type="email"
          placeholder="ada@example.com"
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="group-message">Message</FieldLabel>
        <Textarea id="group-message" placeholder="Tell us more..." />
        <FieldDescription>Markdown is supported.</FieldDescription>
      </Field>
    </FieldGroup>
  );
}
