import { useEffect, useState } from 'react';

/** The platform's primary keyboard-shortcut modifier. */
export interface Modifier {
  /** True on Apple platforms (macOS, iPadOS, iOS). */
  readonly isMac: boolean;
  /** Compact glyph: `⌘` on Apple platforms, `Ctrl` elsewhere. */
  readonly symbol: string;
  /** Spelled-out name: `Command` on Apple platforms, `Control` elsewhere. */
  readonly label: string;
}

const CONTROL: Modifier = { isMac: false, symbol: 'Ctrl', label: 'Control' };
const COMMAND: Modifier = { isMac: true, symbol: '⌘', label: 'Command' };

/**
 * The platform's primary shortcut modifier, for rendering platform-correct
 * shortcut hints (`<Kbd>{useModifier().symbol}</Kbd>`). Starts on the Control
 * variant on the server and first paint, then flips to Command on Apple
 * platforms once mounted so SSR output stays stable.
 */
export function useModifier(): Modifier {
  const [modifier, setModifier] = useState<Modifier>(CONTROL);

  useEffect(() => {
    if (/mac|iphone|ipad|ipod/i.test(navigator.userAgent)) {
      setModifier(COMMAND);
    }
  }, []);

  return modifier;
}
