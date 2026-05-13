import { Button } from '@brika/clay/components/button';
import { ButtonGroup } from '@brika/clay/components/button-group';

/** Vertical orientation stacks buttons top-to-bottom with shared dividers. */
export default function ButtonGroupVerticalDemo() {
  return (
    <ButtonGroup orientation="vertical">
      <Button variant="outline">New file</Button>
      <Button variant="outline">Open folder</Button>
      <Button variant="outline">Recent</Button>
    </ButtonGroup>
  );
}
