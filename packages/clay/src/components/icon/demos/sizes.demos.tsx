import { Icon } from '@brika/clay/components/icon';
import { Bell } from 'lucide-react';

/** Four size presets mapping to Tailwind `size-*` utilities. */
export default function IconSizesDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Icon as={Bell} size="xs" aria-label="Extra small notification" />
      <Icon as={Bell} size="sm" aria-label="Small notification" />
      <Icon as={Bell} size="default" aria-label="Default notification" />
      <Icon as={Bell} size="lg" aria-label="Large notification" />
    </div>
  );
}
