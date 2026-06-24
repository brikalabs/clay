'use client';

import { useModifier } from '@brika/clay';
import { Kbd, KbdGroup } from '@brika/clay/components/kbd';

/**
 * @title Platform modifier
 * `useModifier` resolves the shortcut key on the client (Command on Apple devices, Control elsewhere) so the hint is right on any OS.
 */
export default function KbdPlatformDemo() {
  const { symbol } = useModifier();
  return (
    <KbdGroup aria-label={`${symbol} K`}>
      <Kbd>{symbol}</Kbd>
      <Kbd>K</Kbd>
    </KbdGroup>
  );
}
