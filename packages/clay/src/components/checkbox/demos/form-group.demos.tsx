'use client';

import { Checkbox } from '@brika/clay/components/checkbox';
import { Label } from '@brika/clay/components/label';
import { useState } from 'react';

/** A realistic notification preferences group with independent checkboxes and labels. */
export default function CheckboxFormGroupDemo() {
  const [prefs, setPrefs] = useState({ email: true, sms: false, push: true });

  const toggle = (key: keyof typeof prefs) =>
    setPrefs((p) => ({ ...p, [key]: !p[key] }));

  return (
    <fieldset className="space-y-3">
      <legend className="mb-3 text-sm font-medium">Notification preferences</legend>
      <div className="flex items-center gap-2">
        <Checkbox id="pref-email" checked={prefs.email} onCheckedChange={() => toggle('email')} />
        <Label htmlFor="pref-email">Email notifications</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="pref-sms" checked={prefs.sms} onCheckedChange={() => toggle('sms')} />
        <Label htmlFor="pref-sms">SMS alerts</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="pref-push" checked={prefs.push} onCheckedChange={() => toggle('push')} />
        <Label htmlFor="pref-push">Push notifications</Label>
      </div>
    </fieldset>
  );
}
