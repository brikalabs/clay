/**
 * Shared fixtures for the ColorPicker test split: the `Controlled`
 * wrapper that feeds the picker through React state, a DOM helper to
 * read the committed value, a tab-finder, and a bounding-rect stubber
 * for the three drag surfaces.
 */

import { useState } from 'react';

import { ColorPicker } from '../color-picker';
import { stubRect } from './render';

export function Controlled({
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

export const readValue = (root: HTMLElement) =>
  root.querySelector('[data-testid="value"]')?.textContent ?? '';

export const tab = (root: HTMLElement, name: 'hex' | 'rgb' | 'hsl') => {
  const t = [...root.querySelectorAll('[data-slot="toggle-group-item"]')].find(
    (el) => el.textContent?.trim() === name
  );
  if (!t) throw new Error(`tab ${name} not found`);
  return t as HTMLElement;
};

export const stubSliders = (root: HTMLElement) => {
  for (const sel of [
    '[aria-label^="Saturation"]',
    '[aria-label="Hue"]',
    '[aria-label="Alpha"]',
  ]) {
    const el = root.querySelector(sel);
    if (el) stubRect(el);
  }
};
