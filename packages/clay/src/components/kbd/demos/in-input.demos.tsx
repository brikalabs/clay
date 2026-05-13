import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@brika/clay/components/input-group';
import { Kbd, KbdGroup } from '@brika/clay/components/kbd';
import { SearchIcon } from 'lucide-react';

/** Drop a chord into an `InputGroupAddon` to advertise a search shortcut. */
export default function KbdInInputDemo() {
  return (
    <InputGroup className="w-full max-w-xs">
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput placeholder="Search the docs..." />
      <InputGroupAddon align="inline-end">
        <KbdGroup aria-label="Search shortcut">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </InputGroupAddon>
    </InputGroup>
  );
}
