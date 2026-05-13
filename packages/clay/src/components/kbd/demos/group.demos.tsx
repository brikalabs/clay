import { Kbd, KbdGroup } from '@brika/clay/components/kbd';

/** `KbdGroup` aligns a chord and exposes it as a single ARIA group. */
export default function KbdGroupDemo() {
  return (
    <KbdGroup aria-label="Open command palette">
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </KbdGroup>
  );
}
