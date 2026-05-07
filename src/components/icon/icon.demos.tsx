import { Icon } from '@brika/clay/components/icon';
import { Bell, Star, User } from 'lucide-react';
import { defineDemos } from '../_registry';

/** Decorative icon, no `aria-label`, so screen readers skip it entirely. */
export function IconDefaultDemo() {
  return <Icon as={Bell} />;
}

/** Three semantic tones mapped to `--icon`, `--icon-muted`, and `--icon-primary`. */
export function IconTonesDemo() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="flex items-center gap-2">
        <Icon as={Bell} tone="default" />
        <span className="text-sm">Default</span>
      </div>
      <div className="flex items-center gap-2">
        <Icon as={Bell} tone="muted" />
        <span className="text-sm text-muted-foreground">Muted</span>
      </div>
      <div className="flex items-center gap-2">
        <Icon as={Bell} tone="primary" />
        <span className="text-sm text-primary">Primary</span>
      </div>
    </div>
  );
}

/** Four size presets mapping to Tailwind `size-*` utilities. */
export function IconSizesDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Icon as={Bell} size="xs" aria-label="Extra small notification" />
      <Icon as={Bell} size="sm" aria-label="Small notification" />
      <Icon as={Bell} size="default" aria-label="Default notification" />
      <Icon as={Bell} size="lg" aria-label="Large notification" />
    </div>
  );
}

/** `aria-label` makes the icon meaningful, screen readers announce the label text. */
export function IconAccessibleDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Icon as={Bell} aria-label="Notifications" tone="primary" />
      <Icon as={Star} aria-label="Starred items" tone="muted" />
      <Icon as={User} aria-label="User profile" />
    </div>
  );
}

export const demoMeta = defineDemos([
  [IconDefaultDemo, 'Default', { description: `Decorative icon, no \`aria-label\`, so screen readers skip it entirely.` }],
  [IconTonesDemo, 'Tones', { description: `Three semantic tones mapped to \`--icon\`, \`--icon-muted\`, and \`--icon-primary\`.` }],
  [IconSizesDemo, 'Sizes', { description: `Four size presets mapping to Tailwind \`size-*\` utilities.` }],
  [IconAccessibleDemo, 'Accessible', { description: `\`aria-label\` makes the icon meaningful, screen readers announce the label text.` }],
]);
export const accessibility: readonly string[] = [
  `Decorative by default, \`aria-hidden="true"\` is set when no \`aria-label\` is provided.`,
  `Pass \`aria-label\` to make the icon carry standalone meaning (e.g. status indicator).`,
  `Do not use an icon alone as a button label, always pair with \`aria-label\` on the button.`,
];
