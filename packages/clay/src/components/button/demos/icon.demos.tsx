import { Button } from '@brika/clay/components/button';
import { Settings } from 'lucide-react';

/** Icon-only button, `aria-label` is required for screen readers. */
export default function ButtonIconDemo() {
  return (
    <Button size="icon" aria-label="Open settings">
      <Settings />
    </Button>
  );
}
