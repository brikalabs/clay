import { Icon } from '@brika/clay/components/icon';
import { Bell, Star, User } from 'lucide-react';

/** `aria-label` makes the icon meaningful, screen readers announce the label text. */
export default function IconAccessibleDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Icon as={Bell} aria-label="Notifications" tone="primary" />
      <Icon as={Star} aria-label="Starred items" tone="muted" />
      <Icon as={User} aria-label="User profile" />
    </div>
  );
}
