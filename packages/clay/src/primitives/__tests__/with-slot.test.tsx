/**
 * Unit tests for `withSlot`. Renders the wrapped component into
 * happy-dom to confirm:
 *   1. `data-slot` is attached to the underlying element.
 *   2. Caller props are forwarded.
 *   3. The wrapper's `displayName` is the slot name (used by React
 *      DevTools and component-meta scrapers).
 */

import './happydom';
import { afterAll, describe, expect, test } from 'bun:test';
import { act } from 'react';
import { createRoot } from 'react-dom/client';

import { withSlot } from '../with-slot';

afterAll(() => {
  document.body.innerHTML = '';
});

function mount(node: React.ReactNode) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(node);
  });
  return {
    container,
    unmount: () => {
      act(() => {
        root.unmount();
      });
      container.remove();
    },
  };
}

describe('withSlot', () => {
  test('attaches data-slot and forwards arbitrary props', () => {
    const Slotted = withSlot('button', 'card-trigger');
    const r = mount(
      <Slotted className="x" type="button">
        click
      </Slotted>
    );
    const btn = r.container.querySelector('button') as HTMLButtonElement;
    expect(btn).not.toBeNull();
    expect(btn.dataset.slot).toBe('card-trigger');
    expect(btn.className).toBe('x');
    expect(btn.type).toBe('button');
    expect(btn.textContent).toBe('click');
    r.unmount();
  });

  test('sets the wrapper displayName to the slot name', () => {
    const Slotted = withSlot('span', 'badge-leading');
    expect(Slotted.displayName).toBe('badge-leading');
  });
});
