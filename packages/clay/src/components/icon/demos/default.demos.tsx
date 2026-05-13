import { Icon } from '@brika/clay/components/icon';
import { Bell } from 'lucide-react';

/** Decorative icon, no `aria-label`, so screen readers skip it entirely. */
export default function IconDefaultDemo() {
  return <Icon as={Bell} />;
}
