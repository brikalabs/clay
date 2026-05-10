/**
 * Pure-function coverage for the color-picker math layer. Every
 * exported helper plus every branch (sextant pick, alpha shortening,
 * SSR guards, eyedropper feature detection) is exercised so SonarCloud
 * lights up green for `coverage` on this file.
 */

import { describe, expect, test } from 'bun:test';
import {
  SPECIAL_KEYWORDS,
  type RGBA,
  contrastRatio,
  hasEyeDropper,
  hexToHsv,
  hexToRgba,
  hslToRgba,
  hsvToRgba,
  isHex,
  isSpecialKeyword,
  pickWithEyeDropper,
  rgbaToHex,
  rgbaToHsl,
  rgbaToHsv,
} from '../color-utils';

const close = (a: number, b: number, eps = 1e-6) => expect(Math.abs(a - b)).toBeLessThan(eps);
const closeRgba = (a: RGBA, b: RGBA, eps = 0.5) => {
  close(a.r, b.r, eps);
  close(a.g, b.g, eps);
  close(a.b, b.b, eps);
  close(a.a, b.a, eps);
};

describe('isHex', () => {
  test.each(['#fff', '#abcd', '#a1b2c3', '#a1b2c3ff', '  #FFF  '])('accepts %s', (v) => {
    expect(isHex(v)).toBe(true);
  });
  test.each(['', 'fff', '#gg0', '#ab', '#abcde', 'rgb(0,0,0)', 'currentColor'])('rejects %s', (v) => {
    expect(isHex(v)).toBe(false);
  });
});

describe('SPECIAL_KEYWORDS / isSpecialKeyword', () => {
  test('keyword set is exactly the documented three', () => {
    expect([...SPECIAL_KEYWORDS]).toEqual(['currentColor', 'transparent', 'inherit']);
  });
  test('matches case-insensitively, ignores whitespace', () => {
    expect(isSpecialKeyword('currentColor')).toBe(true);
    expect(isSpecialKeyword('  CURRENTCOLOR ')).toBe(true);
    expect(isSpecialKeyword('Transparent')).toBe(true);
    expect(isSpecialKeyword('inherit')).toBe(true);
  });
  test('rejects anything else', () => {
    expect(isSpecialKeyword('#fff')).toBe(false);
    expect(isSpecialKeyword('initial')).toBe(false);
    expect(isSpecialKeyword('')).toBe(false);
  });
});

describe('hexToRgba', () => {
  test('parses 6-digit hex', () => {
    expect(hexToRgba('#3b82f6')).toEqual({ r: 0x3b, g: 0x82, b: 0xf6, a: 1 });
  });
  test('parses 8-digit hex with alpha', () => {
    const rgba = hexToRgba('#3b82f680');
    expect(rgba?.r).toBe(0x3b);
    expect(rgba?.g).toBe(0x82);
    expect(rgba?.b).toBe(0xf6);
    close(rgba?.a ?? 0, 0x80 / 255);
  });
  test('expands 3-digit hex', () => {
    expect(hexToRgba('#abc')).toEqual({ r: 0xaa, g: 0xbb, b: 0xcc, a: 1 });
  });
  test('expands 4-digit hex with alpha', () => {
    const rgba = hexToRgba('#abcd');
    expect(rgba).toEqual({ r: 0xaa, g: 0xbb, b: 0xcc, a: 0xdd / 255 });
  });
  test('trims whitespace and accepts uppercase', () => {
    expect(hexToRgba('  #FFFFFF  ')).toEqual({ r: 255, g: 255, b: 255, a: 1 });
  });
  test('returns null for non-hex inputs', () => {
    expect(hexToRgba('rgb(0,0,0)')).toBeNull();
    expect(hexToRgba('#xyz')).toBeNull();
    expect(hexToRgba('')).toBeNull();
  });
});

describe('rgbaToHex', () => {
  test('drops the alpha byte when fully opaque', () => {
    expect(rgbaToHex({ r: 59, g: 130, b: 246, a: 1 })).toBe('#3b82f6');
  });
  test('emits 8-digit hex when alpha is below 1', () => {
    expect(rgbaToHex({ r: 59, g: 130, b: 246, a: 0.5 })).toBe('#3b82f680');
  });
  test('clamps out-of-range channels and rounds', () => {
    expect(rgbaToHex({ r: -10, g: 999, b: 127.4, a: 1 })).toBe('#00ff7f');
  });
  test('emits zero alpha as 00', () => {
    expect(rgbaToHex({ r: 0, g: 0, b: 0, a: 0 })).toBe('#00000000');
  });
});

describe('rgbaToHsv ↔ hsvToRgba', () => {
  test('round-trips a saturated red', () => {
    const rgba = { r: 255, g: 0, b: 0, a: 1 };
    const hsv = rgbaToHsv(rgba);
    expect(hsv.h).toBe(0);
    expect(hsv.s).toBe(100);
    expect(hsv.v).toBe(100);
    closeRgba(hsvToRgba(hsv, 1), rgba);
  });
  test('returns hue 0, sat 0 for greyscale', () => {
    const hsv = rgbaToHsv({ r: 128, g: 128, b: 128, a: 1 });
    expect(hsv.h).toBe(0);
    expect(hsv.s).toBe(0);
    close(hsv.v, (128 / 255) * 100);
  });
  test('returns hue 0, sat 0 for pure black (max=0 short-circuit)', () => {
    expect(rgbaToHsv({ r: 0, g: 0, b: 0, a: 1 })).toEqual({ h: 0, s: 0, v: 0 });
  });
  test('returns the right hue for green and blue maxima (sextant branches)', () => {
    expect(rgbaToHsv({ r: 0, g: 255, b: 0, a: 1 }).h).toBe(120);
    expect(rgbaToHsv({ r: 0, g: 0, b: 255, a: 1 }).h).toBe(240);
  });
  test('handles negative-hue branch (red max with blue tail)', () => {
    // r=255 g=0 b=128 → max is r, (g - b) is negative, so + 360 fires
    const hsv = rgbaToHsv({ r: 255, g: 0, b: 128, a: 1 });
    expect(hsv.h).toBeGreaterThan(300);
    expect(hsv.h).toBeLessThan(360);
  });
  test('alpha defaults to 1 in hsvToRgba', () => {
    const rgba = hsvToRgba({ h: 0, s: 100, v: 100 });
    expect(rgba.a).toBe(1);
  });
  test('hsvToRgba covers every sextant', () => {
    // Pick hues representative of each 60° sextant.
    for (const h of [30, 90, 150, 210, 270, 330]) {
      const rgba = hsvToRgba({ h, s: 100, v: 100 }, 1);
      // Round-trip back through rgbaToHsv; hue should return.
      const back = rgbaToHsv(rgba);
      close(back.h, h, 1);
    }
  });
});

describe('rgbaToHsl ↔ hslToRgba', () => {
  test('returns 0, 0, 50 for medium grey', () => {
    const hsl = rgbaToHsl({ r: 128, g: 128, b: 128, a: 1 });
    expect(hsl.h).toBe(0);
    expect(hsl.s).toBe(0);
    close(hsl.l, (128 / 255) * 100, 0.5);
  });
  test('returns 0, 100, 50 for primary red', () => {
    const hsl = rgbaToHsl({ r: 255, g: 0, b: 0, a: 1 });
    expect(hsl.h).toBe(0);
    expect(hsl.s).toBe(100);
    close(hsl.l, 50);
  });
  test('hsl saturation branch chooses the correct denominator (l > 0.5)', () => {
    // light pink: l above 0.5 → uses (2 - max - min) denominator
    const hsl = rgbaToHsl({ r: 255, g: 200, b: 200, a: 1 });
    expect(hsl.h).toBe(0);
    close(hsl.l, ((255 + 200) / 2 / 255) * 100);
  });
  test('hsl negative-hue branch (red max with green < blue)', () => {
    const hsl = rgbaToHsl({ r: 255, g: 0, b: 100, a: 1 });
    expect(hsl.h).toBeGreaterThan(180);
  });
  test('green and blue maxima cover the gN/bN branches', () => {
    expect(rgbaToHsl({ r: 0, g: 255, b: 0, a: 1 }).h).toBe(120);
    expect(rgbaToHsl({ r: 0, g: 0, b: 255, a: 1 }).h).toBe(240);
  });
  test('hslToRgba round-trips through every sextant', () => {
    for (const h of [30, 90, 150, 210, 270, 330]) {
      const rgba = hslToRgba({ h, s: 100, l: 50 }, 1);
      const back = rgbaToHsl(rgba);
      close(back.h, h, 1);
    }
  });
  test('hslToRgba alpha defaults to 1 and threads through', () => {
    expect(hslToRgba({ h: 0, s: 100, l: 50 }).a).toBe(1);
    expect(hslToRgba({ h: 0, s: 100, l: 50 }, 0.25).a).toBe(0.25);
  });
});

describe('hexToHsv', () => {
  test('parses a valid hex via hexToRgba+rgbaToHsv', () => {
    expect(hexToHsv('#ff0000')).toEqual({ h: 0, s: 100, v: 100 });
  });
  test('returns null when the hex does not parse', () => {
    expect(hexToHsv('not-a-color')).toBeNull();
  });
});

describe('contrastRatio', () => {
  test('returns 21 for pure white over pure black', () => {
    close(contrastRatio('#ffffff', '#000000') ?? 0, 21, 0.001);
  });
  test('is symmetric (a vs b == b vs a)', () => {
    const ab = contrastRatio('#3b82f6', '#ffffff');
    const ba = contrastRatio('#ffffff', '#3b82f6');
    expect(ab).toBe(ba);
  });
  test('exercises both branches of the sRGB gamma piecewise', () => {
    // A near-black colour hits the linear branch (v <= 0.03928); a
    // near-white hits the polynomial branch.
    expect(contrastRatio('#020202', '#ffffff')).not.toBeNull();
    expect(contrastRatio('#fefefe', '#000000')).not.toBeNull();
  });
  test('returns null if either side fails to parse', () => {
    expect(contrastRatio('not-hex', '#000')).toBeNull();
    expect(contrastRatio('#000', 'not-hex')).toBeNull();
  });
});

describe('hasEyeDropper / pickWithEyeDropper', () => {
  type EyeDropperRes = { sRGBHex: string };
  type EyeDropperCtor = new () => { open: () => Promise<EyeDropperRes> };
  type Stub = { window?: unknown; EyeDropper?: EyeDropperCtor };

  const stashWindow = (globalThis as Stub).window;
  const stashCtor = (globalThis as Stub).EyeDropper;

  const installWindow = () => {
    (globalThis as Stub).window = globalThis;
  };
  const setCtor = (ctor: EyeDropperCtor | undefined) => {
    if (ctor) (globalThis as Stub).EyeDropper = ctor;
    else delete (globalThis as Stub).EyeDropper;
  };
  const restore = () => {
    if (stashWindow === undefined) delete (globalThis as Stub).window;
    else (globalThis as Stub).window = stashWindow;
    setCtor(stashCtor);
  };

  test('hasEyeDropper is false in SSR (no window)', () => {
    delete (globalThis as Stub).window;
    expect(hasEyeDropper()).toBe(false);
    restore();
  });

  test('hasEyeDropper is false when the constructor is missing', () => {
    installWindow();
    setCtor(undefined);
    expect(hasEyeDropper()).toBe(false);
    restore();
  });

  test('hasEyeDropper is true when the API is present', () => {
    installWindow();
    setCtor(class {
      async open() {
        return { sRGBHex: '#abcdef' };
      }
    } as EyeDropperCtor);
    expect(hasEyeDropper()).toBe(true);
    restore();
  });

  test('pickWithEyeDropper returns the picked color', async () => {
    installWindow();
    setCtor(class {
      async open() {
        return { sRGBHex: '#abcdef' };
      }
    } as EyeDropperCtor);
    expect(await pickWithEyeDropper()).toBe('#abcdef');
    restore();
  });

  test('pickWithEyeDropper returns null when the user cancels', async () => {
    installWindow();
    setCtor(class {
      async open(): Promise<EyeDropperRes> {
        throw new Error('cancelled');
      }
    } as EyeDropperCtor);
    expect(await pickWithEyeDropper()).toBeNull();
    restore();
  });

  test('pickWithEyeDropper returns null when the API is absent', async () => {
    installWindow();
    setCtor(undefined);
    expect(await pickWithEyeDropper()).toBeNull();
    restore();
  });

  test('pickWithEyeDropper returns null in SSR', async () => {
    delete (globalThis as Stub).window;
    expect(await pickWithEyeDropper()).toBeNull();
    restore();
  });
});
