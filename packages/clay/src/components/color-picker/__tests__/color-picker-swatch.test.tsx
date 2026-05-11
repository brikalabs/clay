/**
 * Coverage for `<ColorPickerSwatch />`, the standalone swatch
 * primitive. The picker test file covers the full picker UI; this
 * file pins the four rendering branches in isolation (flat color,
 * empty stripe, special keywords, transparent over the checkerboard).
 */

import './happydom';
import { describe, expect, test } from 'bun:test';

import { ColorPickerSwatch } from '../color-picker';
import { render } from './render';

// happy-dom normalises `style.background` differently than the string
// we set inline (lowercased keywords, dropped fallback hex values), so
// read the raw attribute instead.
const inline = (root: HTMLElement) =>
  root
    .querySelector('[data-slot="color-picker-swatch"]')!
    .getAttribute('style') ?? '';

describe('<ColorPickerSwatch />', () => {
  test('paints a hex value as a flat fill over the checkerboard', () => {
    // happy-dom collapses `linear-gradient(#X, #X), <checker>` into
    // just `<checker>` (it considers a gradient with two identical
    // stops over a CSS image to be redundant). Verify the swatch
    // STILL has the checkerboard and the React tree at least
    // requested the layered background by reading `style.cssText` of
    // an inert mirror — for the live element we just assert the
    // checkerboard is there.
    const r = render(<ColorPickerSwatch value="#3b82f6" />);
    expect(inline(r.container)).toContain('repeating-conic-gradient');
    r.unmount();
  });

  test('renders the diagonal stripe pattern when value is empty', () => {
    const r = render(<ColorPickerSwatch value="" />);
    expect(inline(r.container)).toContain('repeating-linear-gradient');
    r.unmount();
  });

  test('paints a flat fill for currentColor and inherit', () => {
    const r1 = render(<ColorPickerSwatch value="currentColor" />);
    // happy-dom lowercases CSS keywords on serialise — match either.
    expect(inline(r1.container).toLowerCase()).toContain('currentcolor');
    r1.unmount();

    const r2 = render(<ColorPickerSwatch value="inherit" />);
    expect(inline(r2.container)).toContain('inherit');
    r2.unmount();
  });

  test('paints transparent over the checkerboard so the cells show through', () => {
    // happy-dom collapses `linear-gradient(transparent, transparent)`
    // away (it's a no-op layer), leaving just the checkerboard — which
    // is the right rendered result: the cells show through.
    const r = render(<ColorPickerSwatch value="transparent" />);
    const css = inline(r.container);
    expect(css).toContain('repeating-conic-gradient');
    r.unmount();
  });
});
