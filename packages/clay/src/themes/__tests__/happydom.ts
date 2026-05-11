/**
 * Per-test-file happy-dom registration for theme component tests
 * (`ThemeScope.tsx`). Mirrors the color-picker setup so React 19's
 * `act()` plumbing fires correctly and DOM-touching assertions work.
 */

import { GlobalRegistrator } from '@happy-dom/global-registrator';

if (typeof globalThis.document === 'undefined') {
  GlobalRegistrator.register();
}

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
