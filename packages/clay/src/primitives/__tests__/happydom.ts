/**
 * Per-test-file happy-dom registration for primitive tests that touch
 * the DOM (e.g. `useIsMobile`). Mirrors the color-picker setup.
 */

import { GlobalRegistrator } from '@happy-dom/global-registrator';

if (typeof globalThis.document === 'undefined') {
  GlobalRegistrator.register();
}

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
