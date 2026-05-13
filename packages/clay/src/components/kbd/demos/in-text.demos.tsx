import { Kbd } from '@brika/clay/components/kbd';

/** Kbd flows inline with body copy thanks to `align-middle` and `inline-flex`. */
export default function KbdInTextDemo() {
  return (
    <p className="text-sm">
      Press <Kbd>⌘</Kbd>
      <Kbd>K</Kbd> to open the command palette.
    </p>
  );
}
