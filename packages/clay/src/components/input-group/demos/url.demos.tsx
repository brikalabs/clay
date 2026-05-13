import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@brika/clay/components/input-group';

/** URL field with scheme prefix and TLD suffix. */
export default function InputGroupUrlDemo() {
  return (
    <div className="w-full max-w-sm">
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="example" type="text" className="pl-0.5!" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>.com</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
