import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@brika/clay/components/field';
import { RadioGroup, RadioGroupItem } from '@brika/clay/components/radio-group';

/** `FieldSet` + `FieldLegend` group related controls semantically. */
export default function FieldSetDemo() {
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
