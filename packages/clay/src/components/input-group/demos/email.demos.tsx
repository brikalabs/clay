import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@brika/clay/components/input-group';

/** Username field with a fixed company domain suffix. */
export default function InputGroupEmailDemo() {
  return (
    <div className="w-full max-w-sm">
      <InputGroup>
        <InputGroupInput placeholder="Enter your username" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>@company.com</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
