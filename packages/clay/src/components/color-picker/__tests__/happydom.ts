/**
 * Per-test-file happy-dom registration. Imported at the top of
 * component test files so `bun test` picks up a working DOM without
 * a project-wide preload (which would impose happy-dom on every
 * package test, including the pure-data ones that don't need it).
 */

import { GlobalRegistrator } from '@happy-dom/global-registrator';

if (typeof globalThis.document === 'undefined') {
  GlobalRegistrator.register();
}

// React 19 gates `act()` on this flag. Without it, every `act` call
// logs "The current testing environment is not configured to support
// act(...)" and short-circuits, so click / setInput / pointer events
// never flush state and the test's assertions race the React commit.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
