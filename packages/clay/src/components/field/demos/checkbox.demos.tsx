import { Checkbox } from '@brika/clay/components/checkbox';
import {
  Field,
  FieldDescription,
  FieldLabel,
} from '@brika/clay/components/field';
/** Inline checkbox + label pattern using `Field` with row layout. */
export default function FieldCheckboxDemo() {
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
