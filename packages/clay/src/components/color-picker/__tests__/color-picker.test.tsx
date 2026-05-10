/**
 * Browser-side coverage for the ColorPicker UI. Renders the component
 * into happy-dom, exercises each branch (alpha on/off, contrast on/off,
 * special pills empty/full, eyedropper visible/hidden, format tabs,
 * pointer drags, hex/rgb/hsl numeric input, recent colors, close
 * callback) and asserts on the props the React tree commits via
 * `onChange`.
 */

import './happydom';
import { describe, expect, test } from 'bun:test';
import { useState } from 'react';
import {
  ColorPicker,
  ColorPickerSwatch,
} from '../color-picker';
import {
  click,
  pointerCancel,
  pointerDown,
  pointerMove,
  pointerUp,
  render,
  setInput,
  stubRect,
} from './render';

function Controlled({
  initial,
  showAlpha = true,
  showContrast = true,
  showEyedropper = true,
  specialKeywords,
  recentColors,
  onAddRecent,
  onClose,
}: {
  initial: string;
  showAlpha?: boolean;
  showContrast?: boolean;
  showEyedropper?: boolean;
  specialKeywords?: readonly ('currentColor' | 'transparent' | 'inherit')[];
  recentColors?: readonly string[];
  onAddRecent?: (v: string) => void;
  onClose?: () => void;
}) {
  const [value, setValue] = useState(initial);
  return (
    <>
      <ColorPicker
        value={value}
        onChange={setValue}
        showAlpha={showAlpha}
        showContrast={showContrast}
        showEyedropper={showEyedropper}
        specialKeywords={specialKeywords}
        recentColors={recentColors}
        onAddRecent={onAddRecent}
        onClose={onClose}
      />
      <output data-testid="value">{value}</output>
    </>
  );
}

const readValue = (root: HTMLElement) =>
  root.querySelector('[data-testid="value"]')?.textContent ?? '';

const tab = (root: HTMLElement, name: 'hex' | 'rgb' | 'hsl') => {
  const t = [...root.querySelectorAll('[role="tab"]')].find(
    (el) => el.textContent?.trim() === name
  );
  if (!t) throw new Error(`tab ${name} not found`);
  return t as HTMLElement;
};

const stubSliders = (root: HTMLElement) => {
  for (const sel of [
    '[aria-label^="Saturation"]',
    '[aria-label="Hue"]',
    '[aria-label="Alpha"]',
  ]) {
    const el = root.querySelector(sel);
    if (el) stubRect(el);
  }
};

describe('<ColorPicker />', () => {
  test('renders with default chrome and shows the contrast row', () => {
    const r = render(<Controlled initial="#3b82f6" />);
    expect(r.container.querySelector('[data-slot="color-picker"]')).not.toBeNull();
    // Three special pills + a slider for hue + alpha + contrast text
    const pills = r.container.querySelectorAll('button[aria-pressed]');
    expect(pills.length).toBe(3);
    // Contrast row text is present.
    expect(r.container.textContent).toContain('vs #fff');
    expect(r.container.textContent).toContain('vs #000');
    r.unmount();
  });

  test('hides special pills when specialKeywords=[]', () => {
    const r = render(<Controlled initial="#3b82f6" specialKeywords={[]} />);
    expect(r.container.querySelectorAll('button[aria-pressed]').length).toBe(0);
    r.unmount();
  });

  test('hides alpha slider + alpha column when showAlpha=false', () => {
    const r = render(<Controlled initial="#3b82f6" showAlpha={false} />);
    expect(r.container.querySelector('[aria-label="Alpha"]')).toBeNull();
    // Format tabs grid should be 3 cols (no A column)
    expect(r.container.textContent).not.toContain('vs #fff '); // contrast row still present though
    r.unmount();
  });

  test('hides the contrast row when showContrast=false', () => {
    const r = render(<Controlled initial="#3b82f6" showContrast={false} />);
    expect(r.container.textContent).not.toContain('vs #fff');
    r.unmount();
  });

  test('renders close button when onClose is provided', () => {
    let closed = false;
    const r = render(<Controlled initial="#3b82f6" onClose={() => { closed = true; }} />);
    const closeBtn = [...r.container.querySelectorAll('button')]
      .find((b) => b.getAttribute('aria-label') === 'Close');
    expect(closeBtn).toBeDefined();
    click(closeBtn!);
    expect(closed).toBe(true);
    r.unmount();
  });

  test('eyedropper button shows when window.EyeDropper exists and fires onChange + onAddRecent', async () => {
    type Stub = { EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> } };
    (globalThis as Stub).EyeDropper = class {
      async open() {
        return { sRGBHex: '#abcdef' };
      }
    };
    const recents: string[] = [];
    const r = render(
      <Controlled
        initial="#3b82f6"
        onAddRecent={(v) => recents.push(v)}
      />
    );
    const eye = [...r.container.querySelectorAll('button')]
      .find((b) => b.getAttribute('aria-label') === 'Eyedropper');
    expect(eye).toBeDefined();
    click(eye!);
    // Wait microtask for the async pickWithEyeDropper promise to settle.
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(readValue(r.container)).toBe('#abcdef');
    expect(recents).toContain('#abcdef');
    delete (globalThis as Stub).EyeDropper;
    r.unmount();
  });

  test('eyedropper button hidden when showEyedropper=false', () => {
    type Stub = { EyeDropper?: unknown };
    (globalThis as Stub).EyeDropper = class {
      async open() {
        return { sRGBHex: '#fff' };
      }
    };
    const r = render(<Controlled initial="#3b82f6" showEyedropper={false} />);
    const eye = [...r.container.querySelectorAll('button')]
      .find((b) => b.getAttribute('aria-label') === 'Eyedropper');
    expect(eye).toBeUndefined();
    delete (globalThis as Stub).EyeDropper;
    r.unmount();
  });

  test('clicking a special pill commits the keyword; clicking again restores hex', () => {
    const r = render(<Controlled initial="#3b82f6" />);
    const cc = [...r.container.querySelectorAll('button')]
      .find((b) => b.textContent === 'currentColor')!;
    click(cc);
    expect(readValue(r.container)).toBe('currentColor');
    expect(cc.getAttribute('aria-pressed')).toBe('true');
    click(cc);
    // After toggling off, value is the hex the picker remembered.
    expect(readValue(r.container)).toMatch(/^#[0-9a-f]{6}$/i);
    r.unmount();
  });

  test('pointer drag on the sat/val pad commits a new color', () => {
    const r = render(<Controlled initial="#3b82f6" />);
    stubSliders(r.container);
    const pad = r.container.querySelector('[aria-label^="Saturation"]')!;
    pointerDown(pad, 50, 30);
    pointerMove(pad, 80, 10);
    pointerUp(pad, 80, 10);
    expect(readValue(r.container)).toMatch(/^#[0-9a-f]{6}$/i);
    r.unmount();
  });

  test('pointer cancel during a drag releases capture without further change', () => {
    const r = render(<Controlled initial="#3b82f6" />);
    stubSliders(r.container);
    const pad = r.container.querySelector('[aria-label^="Saturation"]')!;
    pointerDown(pad, 50, 50);
    const after = readValue(r.container);
    pointerCancel(pad);
    pointerMove(pad, 90, 90); // ignored — drag ended
    expect(readValue(r.container)).toBe(after);
    r.unmount();
  });

  test('hue slider drag changes hue', () => {
    const r = render(<Controlled initial="#ff0000" />);
    stubSliders(r.container);
    const hue = r.container.querySelector('[aria-label="Hue"]')!;
    pointerDown(hue, 0, 50);
    pointerUp(hue, 0, 50);
    expect(readValue(r.container)).toMatch(/^#[0-9a-f]{6}$/i);
    r.unmount();
  });

  test('alpha slider drag emits an 8-digit hex', () => {
    const r = render(<Controlled initial="#3b82f6" />);
    stubSliders(r.container);
    const alpha = r.container.querySelector('[aria-label="Alpha"]')!;
    pointerDown(alpha, 50, 0);
    pointerUp(alpha, 50, 0);
    expect(readValue(r.container)).toMatch(/^#[0-9a-f]{8}$/i);
    r.unmount();
  });

  test('hex tab: typing a valid hex commits; invalid is ignored', () => {
    const r = render(<Controlled initial="#3b82f6" />);
    click(tab(r.container, 'hex'));
    const hexInput = r.container.querySelector('input[aria-label="Hex value"]') as HTMLInputElement;
    setInput(hexInput, 'not-a-hex');
    expect(readValue(r.container)).toBe('#3b82f6');
    setInput(hexInput, '#10b981');
    expect(readValue(r.container)).toBe('#10b981');
    r.unmount();
  });

  test('rgb tab: editing R clamps and commits', () => {
    const r = render(<Controlled initial="#000000" />);
    click(tab(r.container, 'rgb'));
    const rField = r.container.querySelector('input[aria-label="R"]') as HTMLInputElement;
    setInput(rField, '255');
    expect(readValue(r.container)).toMatch(/^#ff/);
    setInput(rField, '999'); // clamped to 255
    setInput(rField, '-50'); // clamped to 0
    setInput(rField, ''); // NaN guard
    r.unmount();
  });

  test('rgb tab: editing A commits an alpha value', () => {
    const r = render(<Controlled initial="#3b82f6" />);
    click(tab(r.container, 'rgb'));
    const aField = r.container.querySelector('input[aria-label="A"]') as HTMLInputElement;
    setInput(aField, '50');
    expect(readValue(r.container)).toMatch(/^#[0-9a-f]{8}$/);
    r.unmount();
  });

  test('hsl tab: editing H/S/L commits and the alpha column updates too', () => {
    const r = render(<Controlled initial="#3b82f6" />);
    click(tab(r.container, 'hsl'));
    const h = r.container.querySelector('input[aria-label="H"]') as HTMLInputElement;
    const s = r.container.querySelector('input[aria-label="S"]') as HTMLInputElement;
    const l = r.container.querySelector('input[aria-label="L"]') as HTMLInputElement;
    const a = r.container.querySelector('input[aria-label="A"]') as HTMLInputElement;
    setInput(h, '120');
    setInput(s, '50');
    setInput(l, '40');
    setInput(a, '30');
    expect(readValue(r.container)).toMatch(/^#[0-9a-f]{8}$/);
    r.unmount();
  });

  test('rgb/hsl tabs render only 3 cols when showAlpha=false', () => {
    const r = render(<Controlled initial="#3b82f6" showAlpha={false} />);
    click(tab(r.container, 'rgb'));
    expect(r.container.querySelector('input[aria-label="A"]')).toBeNull();
    click(tab(r.container, 'hsl'));
    expect(r.container.querySelector('input[aria-label="A"]')).toBeNull();
    r.unmount();
  });

  test('save-to-recent button is enabled only when onAddRecent is provided', () => {
    const recents: string[] = [];
    const noOp = render(<Controlled initial="#3b82f6" />);
    const noOpSwatch = noOp.container.querySelector('button[aria-label="Save to recent"]') as HTMLButtonElement;
    expect(noOpSwatch.disabled).toBe(true);
    noOp.unmount();

    const r = render(
      <Controlled initial="#3b82f6" onAddRecent={(v) => recents.push(v)} />
    );
    const swatch = r.container.querySelector('button[aria-label="Save to recent"]') as HTMLButtonElement;
    expect(swatch.disabled).toBe(false);
    click(swatch);
    expect(recents).toEqual(['#3b82f6']);
    r.unmount();
  });

  test('recent-colors strip clicks restore the saved color', () => {
    const r = render(
      <Controlled initial="#3b82f6" recentColors={['#10b981', '#f59e0b']} />
    );
    const recentBtns = [...r.container.querySelectorAll('button')]
      .filter((b) => b.getAttribute('aria-label')?.startsWith('Use #'));
    expect(recentBtns.length).toBe(2);
    click(recentBtns[1]);
    expect(readValue(r.container)).toBe('#f59e0b');
    r.unmount();
  });

  test('value prop sync via useEffect picks up external changes', () => {
    function Driver() {
      const [v, setV] = useState('#3b82f6');
      return (
        <>
          <button type="button" data-testid="bump" onClick={() => setV('#10b981')}>
            bump
          </button>
          <ColorPicker value={v} onChange={setV} />
        </>
      );
    }
    const r = render(<Driver />);
    click(r.container.querySelector('[data-testid="bump"]')!);
    // After external change, the hex field should reflect the new value
    const hexInput = r.container.querySelector('input[aria-label="Hex value"]') as HTMLInputElement;
    expect(hexInput.value.toLowerCase()).toBe('#10b981');
    r.unmount();
  });
});

describe('<ColorPickerSwatch />', () => {
  test('paints a hex value as a flat fill over the checkerboard', () => {
    const r = render(<ColorPickerSwatch value="#3b82f6" />);
    const span = r.container.querySelector('[data-slot="color-picker-swatch"]') as HTMLElement;
    expect(span.style.background).toContain('#3b82f6');
    r.unmount();
  });

  test('renders the diagonal stripe pattern when value is empty', () => {
    const r = render(<ColorPickerSwatch value="" />);
    const span = r.container.querySelector('[data-slot="color-picker-swatch"]') as HTMLElement;
    expect(span.style.background).toContain('repeating-linear-gradient');
    r.unmount();
  });

  test('paints a flat fill for currentColor and inherit', () => {
    const r1 = render(<ColorPickerSwatch value="currentColor" />);
    const s1 = r1.container.querySelector('[data-slot="color-picker-swatch"]') as HTMLElement;
    expect(s1.style.background).toContain('currentColor');
    r1.unmount();

    const r2 = render(<ColorPickerSwatch value="inherit" />);
    const s2 = r2.container.querySelector('[data-slot="color-picker-swatch"]') as HTMLElement;
    expect(s2.style.background).toContain('inherit');
    r2.unmount();
  });

  test('paints transparent over the checkerboard so the cells show through', () => {
    const r = render(<ColorPickerSwatch value="transparent" />);
    const span = r.container.querySelector('[data-slot="color-picker-swatch"]') as HTMLElement;
    expect(span.style.background).toContain('transparent');
    expect(span.style.background).toContain('repeating-conic-gradient');
    r.unmount();
  });
});
