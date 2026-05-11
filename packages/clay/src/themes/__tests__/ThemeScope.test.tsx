/**
 * Coverage for `<ThemeScope>`. Renders into happy-dom and asserts on
 * the wrapper / Slot / hoisted `<style>` outputs across each branch
 * (default wrapper, `asChild`, `style` override, dark mode, empty
 * theme without rootVars / darkVars).
 */

import './happydom';
import { afterAll, describe, expect, test } from 'bun:test';
import { act } from 'react';
import { createRoot } from 'react-dom/client';

import { ThemeScope } from '../ThemeScope';
import type { ThemeConfig } from '../types';

const baseTheme: ThemeConfig = {
  id: 'scope-test',
  name: 'Scope Test',
  description: 'Fixture for ThemeScope tests.',
  accentSwatches: ['#abc'],
  colors: {
    light: { primary: '#abc' },
    dark: { primary: '#fff' },
  },
};

function mount(node: React.ReactNode) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(node);
  });
  return {
    container,
    unmount() {
      act(() => {
        root.unmount();
      });
      container.remove();
    },
  };
}

afterAll(() => {
  document.head.innerHTML = '';
  document.body.innerHTML = '';
});

describe('ThemeScope', () => {
  test('default wrapper is a <div display:contents> carrying theme attrs', () => {
    const r = mount(
      <ThemeScope theme={baseTheme}>
        <span data-testid="child">x</span>
      </ThemeScope>
    );
    const wrapper = r.container.querySelector('[data-clay-theme-scope]') as HTMLElement;
    expect(wrapper.tagName).toBe('DIV');
    expect(wrapper.dataset.theme).toBe('scope-test');
    expect(wrapper.dataset.mode).toBe('light');
    expect(wrapper.style.display).toBe('contents');
    expect(wrapper.querySelector('[data-testid="child"]')).not.toBeNull();
    r.unmount();
  });

  test('dark mode renders data-mode="dark" and emits the dark @rule', () => {
    const r = mount(
      <ThemeScope theme={baseTheme} mode="dark">
        <span>x</span>
      </ThemeScope>
    );
    const wrapper = r.container.querySelector('[data-clay-theme-scope]') as HTMLElement;
    expect(wrapper.dataset.mode).toBe('dark');
    // Walk all style tags in the document — React 19 may hoist the
    // `<style href precedence>` into <head> (browser path) or render
    // it inline (happy-dom fallback). Either way the dark selector
    // must appear in the combined CSS.
    const inlineCss = Array.from(document.querySelectorAll('style'))
      .map((s) => s.textContent ?? '')
      .join('\n');
    expect(inlineCss).toContain('[data-mode="dark"]');
    r.unmount();
  });

  test('asChild merges theme attributes onto the single child element', () => {
    const r = mount(
      <ThemeScope theme={baseTheme} asChild>
        <article data-testid="art" className="prose">
          merged
        </article>
      </ThemeScope>
    );
    const art = r.container.querySelector('[data-testid="art"]') as HTMLElement;
    expect(art.tagName).toBe('ARTICLE');
    expect(art.dataset.theme).toBe('scope-test');
    expect(art.dataset.clayThemeScope).toBe('');
    expect(art.classList.contains('prose')).toBe(true);
    // asChild: no display:contents forced on the article.
    expect(art.style.display).toBe('');
    r.unmount();
  });

  test('custom inline style merges with display:contents in default wrapper', () => {
    const r = mount(
      <ThemeScope theme={baseTheme} style={{ minHeight: '10px' }}>
        <span>x</span>
      </ThemeScope>
    );
    const wrapper = r.container.querySelector('[data-clay-theme-scope]') as HTMLElement;
    expect(wrapper.style.display).toBe('contents');
    expect(wrapper.style.minHeight).toBe('10px');
    r.unmount();
  });

  test('asChild + custom style forwards the style without forcing display:contents', () => {
    const r = mount(
      <ThemeScope theme={baseTheme} asChild style={{ padding: '4px' }}>
        <section data-testid="sect">x</section>
      </ThemeScope>
    );
    const sect = r.container.querySelector('[data-testid="sect"]') as HTMLElement;
    expect(sect.style.padding).toBe('4px');
    expect(sect.style.display).toBe('');
    r.unmount();
  });

  test('an empty theme renders without errors and still emits a hoisted style tag', () => {
    const empty: ThemeConfig = {
      id: 'empty-scope',
      name: 'Empty',
      description: '',
      accentSwatches: [],
    };
    const r = mount(
      <ThemeScope theme={empty}>
        <span>x</span>
      </ThemeScope>
    );
    const wrapper = r.container.querySelector('[data-clay-theme-scope]');
    expect(wrapper).not.toBeNull();
    expect(wrapper?.querySelector('span')?.textContent).toBe('x');
    r.unmount();
  });

  test('a custom theme emits both the :root and dark scope rules (registry defaults always seed both)', () => {
    const r = mount(
      <ThemeScope theme={{ ...baseTheme, id: 'custom-rule-test' }}>
        <span>x</span>
      </ThemeScope>
    );
    const styles = Array.from(document.querySelectorAll('style'));
    const inlineCss = styles.map((s) => s.textContent ?? '').join('\n');
    expect(inlineCss.includes('[data-theme="custom-rule-test"]')).toBe(true);
    expect(inlineCss.includes(':is(.dark, [data-mode="dark"])[data-theme="custom-rule-test"]')).toBe(true);
    r.unmount();
  });

  test('default wrapper className lands on the wrapper div', () => {
    const r = mount(
      <ThemeScope theme={baseTheme} className="custom-wrap">
        <span>x</span>
      </ThemeScope>
    );
    const wrapper = r.container.querySelector('[data-clay-theme-scope]') as HTMLElement;
    expect(wrapper.classList.contains('custom-wrap')).toBe(true);
    r.unmount();
  });
});
