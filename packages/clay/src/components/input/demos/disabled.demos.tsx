import { Input } from '@brika/clay/components/input';

/** Disabled input, blocks interaction and reduces opacity. */
export default function InputDisabledDemo() {
  return <Input disabled placeholder="Not editable" className="max-w-xs" />;
}
