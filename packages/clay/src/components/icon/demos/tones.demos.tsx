import { Icon } from '@brika/clay/components/icon';
import { Bell } from 'lucide-react';

/** Three semantic tones mapped to `--icon`, `--icon-muted`, and `--icon-primary`. */
export default function IconTonesDemo() {
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
