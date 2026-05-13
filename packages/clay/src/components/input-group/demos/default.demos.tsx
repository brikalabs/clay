import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@brika/clay/components/input-group';

/** Currency field with dollar-sign prefix and currency code suffix. */
export default function InputGroupDefaultDemo() {
  return (
    <div className="w-full max-w-xs">
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>$</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="0.00" type="number" min={0} step={0.01} />
        <InputGroupAddon align="inline-end">
          <InputGroupText>USD</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
