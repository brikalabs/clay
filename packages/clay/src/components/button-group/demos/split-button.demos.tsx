import { Button } from '@brika/clay/components/button';
import { ButtonGroup } from '@brika/clay/components/button-group';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@brika/clay/components/dropdown-menu';
import { ChevronDown } from 'lucide-react';

/** Primary action plus a dropdown chevron for related variants. */
export default function ButtonGroupSplitDemo() {
  return (
    <ButtonGroup>
      <Button>Save changes</Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" aria-label="More save options">
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Save as draft</DropdownMenuItem>
          <DropdownMenuItem>Save and publish</DropdownMenuItem>
          <DropdownMenuItem>Save a copy</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
