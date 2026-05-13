import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@brika/clay/components/input-group';
import { Search, X } from 'lucide-react';

/** Search field with a leading icon and a trailing clear button. */
export default function InputGroupSearchDemo() {
  return (
    <div className="w-full max-w-xs">
      <InputGroup>
        <InputGroupAddon>
          <Search className="size-4" />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search components…" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton variant="ghost" size="icon-xs" aria-label="Clear search">
            <X className="size-3.5" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
