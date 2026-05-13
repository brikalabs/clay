import { Button } from '@brika/clay/components/button';
import { ButtonGroup } from '@brika/clay/components/button-group';

/** Three related action buttons joined in a shared frame, each click fires once, no selection state. */
export default function ButtonGroupDefaultDemo() {
  return (
    <ButtonGroup>
      <Button variant="outline">Reply</Button>
      <Button variant="outline">Reply all</Button>
      <Button variant="outline">Forward</Button>
    </ButtonGroup>
  );
}
