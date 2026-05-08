/**
 * Apply `publishConfig` field overrides at pack-time and restore after.
 *
 * `npm publish` only honors `publishConfig.{access,tag,registry}` — not
 * field overrides like `main`/`exports`/`types`. Without this script
 * the published manifest would still point at `./src/...` (handy for
 * in-monorepo dev) instead of the dist files actually in the tarball,
 * making every export entry unresolvable for consumers.
 *
 * Works with `npm publish`, `npm pack`, `bun publish`, and `bun pm pack`
 * via the standard `prepack`/`postpack` lifecycle hooks.
 */
import { copyFileSync, existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';

const PKG = 'package.json';
const BAK = 'package.json.bak';
const mode = process.argv[2];

if (mode === 'pre') {
  // Recover from a previous interrupted run before overwriting.
  if (existsSync(BAK)) {
    copyFileSync(BAK, PKG);
    unlinkSync(BAK);
  }
  copyFileSync(PKG, BAK);
  const pkg = JSON.parse(readFileSync(PKG, 'utf-8'));
  const { publishConfig, ...rest } = pkg;
  if (publishConfig && typeof publishConfig === 'object') {
    Object.assign(rest, publishConfig);
  }
  writeFileSync(PKG, `${JSON.stringify(rest, null, 2)}\n`);
} else if (mode === 'post') {
  if (existsSync(BAK)) {
    copyFileSync(BAK, PKG);
    unlinkSync(BAK);
  }
} else {
  console.error(`prepack.ts: expected 'pre' or 'post', got ${mode ?? '(none)'}`);
  process.exit(1);
}
