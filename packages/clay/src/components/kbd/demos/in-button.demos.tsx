import { Button } from '@brika/clay/components/button';
import { Kbd } from '@brika/clay/components/kbd';
import { CornerDownLeftIcon } from 'lucide-react';

/** Kbd is `pointer-events-none`, so a key cap inside a button doesn't swallow clicks. */
export default function KbdInButtonDemo() {
  return (
    <Button variant="outline">
      Accept
      <Kbd>
        <CornerDownLeftIcon />
      </Kbd>
    </Button>
  );
}
