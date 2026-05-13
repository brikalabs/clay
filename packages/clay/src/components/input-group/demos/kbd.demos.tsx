import { Kbd } from '@brika/clay/components/kbd';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@brika/clay/components/input-group';
import { Search } from 'lucide-react';

/** Search input with a trailing ⌘K keyboard shortcut hint. */
export default function InputGroupKbdDemo() {
  return (
    <div className="w-full max-w-sm">
      <InputGroup>
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon>
          <Search className="size-4" />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <Kbd>⌘K</Kbd>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
