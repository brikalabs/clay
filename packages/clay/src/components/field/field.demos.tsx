import { Checkbox } from '@brika/clay/components/checkbox';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@brika/clay/components/field';
import { Input } from '@brika/clay/components/input';
import { RadioGroup, RadioGroupItem } from '@brika/clay/components/radio-group';
import { Textarea } from '@brika/clay/components/textarea';
import { defineDemos } from '../../component-registry';

/** Single field with label, control, and helper description. */
export function FieldBasicDemo() {
  return (
    <Field>
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <Input id="email" type="email" placeholder="you@example.com" />
      <FieldDescription>We'll never share your email.</FieldDescription>
    </Field>
  );
}

/** Invalid state pairs `aria-invalid` on the control with `<FieldError>`. */
export function FieldErrorDemo() {
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

/** `FieldGroup` stacks multiple fields with consistent vertical rhythm. */
export function FieldGroupDemo() {
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

/** `FieldSet` + `FieldLegend` group related controls semantically. */
export function FieldSetDemo() {
  return (
    <FieldSet>
      <FieldLegend>Notification frequency</FieldLegend>
      <FieldDescription>Choose how often you'd like updates.</FieldDescription>
      <RadioGroup defaultValue="weekly">
        <Field className="flex-row items-center gap-2">
          <RadioGroupItem id="freq-realtime" value="realtime" />
          <FieldLabel htmlFor="freq-realtime" className="font-normal">
            Real-time
          </FieldLabel>
        </Field>
        <Field className="flex-row items-center gap-2">
          <RadioGroupItem id="freq-daily" value="daily" />
          <FieldLabel htmlFor="freq-daily" className="font-normal">
            Daily digest
          </FieldLabel>
        </Field>
        <Field className="flex-row items-center gap-2">
          <RadioGroupItem id="freq-weekly" value="weekly" />
          <FieldLabel htmlFor="freq-weekly" className="font-normal">
            Weekly summary
          </FieldLabel>
        </Field>
      </RadioGroup>
    </FieldSet>
  );
}

/** Inline checkbox + label pattern using `Field` with row layout. */
export function FieldCheckboxDemo() {
  return (
    <Field className="flex-row items-start gap-2">
      <Checkbox id="terms" />
      <div className="flex flex-col gap-1">
        <FieldLabel htmlFor="terms" className="font-normal">
          Accept terms and conditions
        </FieldLabel>
        <FieldDescription>
          You agree to our Terms of Service and Privacy Policy.
        </FieldDescription>
      </div>
    </Field>
  );
}

export const demoMeta = defineDemos([
  [FieldBasicDemo, 'Basic', { description: 'Single field with label, control, and helper description.' }],
  [FieldErrorDemo, 'Error', { description: 'Invalid state pairs `aria-invalid` on the control with `<FieldError>`.' }],
  [FieldGroupDemo, 'Group', { description: '`FieldGroup` stacks multiple fields with consistent vertical rhythm.' }],
  [FieldSetDemo, 'Set', { description: '`FieldSet` + `FieldLegend` group related controls semantically.' }],
  [FieldCheckboxDemo, 'Checkbox', { description: 'Inline checkbox + label pattern using `Field` with row layout.' }],
]);
