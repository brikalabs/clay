import { Button } from '@brika/clay/components/button';
import { ButtonGroup } from '@brika/clay/components/button-group';
import { ClipboardPaste, Copy, Scissors } from 'lucide-react';

/** Icon-only action buttons for a compact toolbar, every button needs an `aria-label`. */
export default function ButtonGroupIconsDemo() {
  return (
    <ButtonGroup>
      <Button variant="outline" size="icon" aria-label="Cut">
        <Scissors />
      </Button>
      <Button variant="outline" size="icon" aria-label="Copy">
        <Copy />
      </Button>
      <Button variant="outline" size="icon" aria-label="Paste">
        <ClipboardPaste />
      </Button>
    </ButtonGroup>
  );
}
