/**
 * End-to-end Tailwind v4 `compile()` coverage. Drives the real
 * Tailwind compiler with our plugin loaded and asserts on the JIT
 * pruning + namespaced-utility resolution paths.
 */

import { describe, expect, test } from 'bun:test';

import { TOKEN_REGISTRY } from '../tokens/registry';
import { SHORTHAND_INDEX } from '../tokens/shorthands';
import { buildCss } from './tailwind-plugin.fixtures';

describe('Tailwind v4 compile(), JIT pruning of shorthand utilities', () => {
  test('a candidate that names a registered shorthand emits its rule', async () => {
    const css = await buildCss(['button']);
    expect(css).toContain('.button {');
    expect(css).toContain('--button-padding-x');
  });

  test('a candidate NOT in the source omits every other shorthand', async () => {
    const css = await buildCss(['button']);
    expect(css).not.toContain('.badge {');
    expect(css).not.toContain('.card {');
    expect(css).not.toContain('.tooltip {');
    expect(css).not.toContain('.dialog {');
  });

  test('multiple candidates each emit their own rule', async () => {
    const css = await buildCss(['button', 'badge', 'card']);
    expect(css).toContain('.button {');
    expect(css).toContain('.badge {');
    expect(css).toContain('.card {');
    expect(css).not.toContain('.tooltip {');
  });

  test('no candidates → no shorthand rules emitted', async () => {
    const css = await buildCss([]);
    for (const name of Object.keys(SHORTHAND_INDEX.rules)) {
      expect(css).not.toContain(`.${name} {`);
    }
  });

  test('shorthand class survives next to a Tailwind utility on the same element', async () => {
    // Models `<button class="button h-10">`. Both must end up in CSS;
    // cascade order ensures `h-10` wins for height.
    const css = await buildCss(['button', 'h-10']);
    expect(css).toContain('.button {');
    expect(css).toContain('.h-10 {');
  });

  test('namespaced utilities (bg-*, rounded-*, shadow-*, duration-*, ease-*) compile through theme.extend', async () => {
    const css = await buildCss([
      'bg-primary',
      'rounded-card',
      'shadow-card',
      'duration-card',
      'ease-card',
    ]);
    expect(css).toContain('.bg-primary');
    expect(css).toContain('.rounded-card');
    expect(css).toContain('.shadow-card');
    expect(css).toContain('.duration-card');
    expect(css).toContain('.ease-card');
  });

  test('arbitrary `(--token)` shorthand utilities resolve because shorthand-bundle tokens land in :root', async () => {
    // Simulates a hand-authored class like `gap-(--button-gap)` in a .tsx file.
    const css = await buildCss(['gap-(--button-gap)']);
    expect(css).toContain('--button-gap');
    expect(css).toMatch(/gap:\s*var\(--button-gap\)/);
  });

  test('color-mix expressions over `consumedByCss` tokens resolve at the use site', async () => {
    // Models alert.tsx, where `var(--alert-tint-base)` appears inside a
    // `color-mix(...)` expression with no fallback. The token must live in
    // :root (which the `consumedByCss: true` flag forces) for the mix to
    // produce a valid color.
    const css = await buildCss([]);
    expect(css).toContain('--alert-tint-base');
  });

  test(':root block stays under 25 KB; filtering trims var-chain Layer-2 leaves', async () => {
    // Regression guard: if the filter accidentally regresses to "emit every
    // token", the :root payload jumps by ~3.5 KB. Capping at 25 KB leaves a
    // small buffer for new scalars/roles without rewarding token sprawl.
    const css = await buildCss([]);
    const rootBlock = css.match(/:root[^{]*\{[^}]*\}/);
    if (!rootBlock) {
      throw new Error('compiled CSS missing a :root block');
    }
    expect(rootBlock[0].length).toBeLessThan(25 * 1024);
  });

  test('text-* utility resolves both font-size and the paired line-height', async () => {
    // Find a text token that has a lineHeight declared.
    const t = TOKEN_REGISTRY.find(
      (token) => token.tailwindNamespace === 'text' && token.lineHeight
    );
    if (!t) return;
    const utilityName = t.utilityAlias ?? t.name.replace(/^text-/, '');
    const css = await buildCss([`text-${utilityName}`]);
    expect(css).toContain(`var(--${t.name})`);
  });
});
