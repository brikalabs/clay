import { Button } from '@brika/clay/components/button';
import { ButtonGroup } from '@brika/clay/components/button-group';

/** Filled default variant inside a group, good for primary action clusters. */
export default function ButtonGroupFilledDemo() {
  return (
    <ButtonGroup>
      <Button>Edit</Button>
      <Button>Preview</Button>
      <Button>Share</Button>
    </ButtonGroup>
  );
}
