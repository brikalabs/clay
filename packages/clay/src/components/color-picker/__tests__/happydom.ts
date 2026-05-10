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
