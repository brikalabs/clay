import { Checkbox } from '@brika/clay/components/checkbox';
import { Field, FieldDescription, FieldLabel } from '@brika/clay/components/field';
import { Input } from '@brika/clay/components/input';
import { RadioGroup, RadioGroupItem } from '@brika/clay/components/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@brika/clay/components/select';
import { Switch } from '@brika/clay/components/switch';

export function FormPanel() {
  return (
    <section className="rounded-lg border border-clay-hairline bg-card p-4">
      <h3 className="mb-3 font-medium text-sm">Account preferences</h3>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="kitchen-name">Display name</FieldLabel>
          <Input id="kitchen-name" defaultValue="Ada Lovelace" />
          <FieldDescription>Visible to your teammates.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="kitchen-tz">Timezone</FieldLabel>
          <Select defaultValue="utc">
            <SelectTrigger id="kitchen-tz">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="utc">UTC</SelectItem>
              <SelectItem value="cet">CET (UTC+1)</SelectItem>
              <SelectItem value="pst">PST (UTC−8)</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <div className="flex items-center justify-between">
          <FieldLabel htmlFor="kitchen-notify">Notify by email</FieldLabel>
          <Switch id="kitchen-notify" defaultChecked />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="kitchen-tos" defaultChecked />
          <FieldLabel htmlFor="kitchen-tos" className="text-sm">
            I agree to the terms.
          </FieldLabel>
        </div>
      </div>
      <fieldset className="mt-4 flex flex-col gap-2">
        <legend className="font-medium text-sm">Plan</legend>
        <RadioGroup defaultValue="pro" className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <RadioGroupItem value="free" /> Free
          </label>
          <label className="flex items-center gap-2 text-sm">
            <RadioGroupItem value="pro" /> Pro
          </label>
          <label className="flex items-center gap-2 text-sm">
            <RadioGroupItem value="team" /> Team
          </label>
        </RadioGroup>
      </fieldset>
    </section>
  );
}
