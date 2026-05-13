import { Button } from '@brika/clay/components/button';
import { ButtonGroup } from '@brika/clay/components/button-group';
import { Input } from '@brika/clay/components/input';
import { Copy } from 'lucide-react';

/** Input + trailing button, classic copy-URL pattern. */
export default function ButtonGroupWithInputDemo() {
  return (
    <ButtonGroup className="w-full max-w-sm">
      <Input readOnly value="https://clay.brika.dev/share/abc123" />
      <Button variant="outline" size="icon" aria-label="Copy URL">
        <Copy />
      </Button>
    </ButtonGroup>
  );
}
