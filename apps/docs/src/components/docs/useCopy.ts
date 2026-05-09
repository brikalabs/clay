import { useState } from 'react';

const COPIED_MS = 1200;

/**
 * Copy-to-clipboard with a transient `copied` flag the caller can flip
 * UI on. The flag auto-resets after {@link COPIED_MS}, no cleanup needed.
 */
export function useCopy() {
  const [copied, setCopied] = useState(false);
  return [
    copied,
    (text: string) => {
      void navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), COPIED_MS);
      });
    },
  ] as const;
}
