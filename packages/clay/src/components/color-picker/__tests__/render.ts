/**
 * Tiny render helper for component tests. Wraps `react-dom/client`
 * with happy-dom-friendly cleanup. Avoids a `@testing-library/react`
 * dep — Clay's component tests stay light and direct: render, query
 * the DOM, dispatch native events.
 */

import { act, type ReactNode } from 'react';
import { type Root, createRoot } from 'react-dom/client';

export interface RenderResult {
  readonly container: HTMLElement;
  readonly root: Root;
  readonly rerender: (node: ReactNode) => void;
  readonly unmount: () => void;
}

export function render(node: ReactNode): RenderResult {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(node);
  });
  return {
    container,
    root,
    rerender: (next) => {
      act(() => {
        root.render(next);
      });
    },
    unmount: () => {
      act(() => {
        root.unmount();
      });
      container.remove();
    },
  };
}

/**
 * Synchronous pointer-event dispatch. Each helper fires the events
 * Radix / our pointer handlers listen for.
 */
export function pointerDown(el: Element, x: number, y: number): void {
  act(() => {
    el.dispatchEvent(new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y,
      pointerId: 1,
      isPrimary: true,
    }));
  });
}
export function pointerMove(el: Element, x: number, y: number): void {
  act(() => {
    el.dispatchEvent(new PointerEvent('pointermove', {
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y,
      pointerId: 1,
      isPrimary: true,
    }));
  });
}
export function pointerUp(el: Element, x = 0, y = 0): void {
  act(() => {
    el.dispatchEvent(new PointerEvent('pointerup', {
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y,
      pointerId: 1,
      isPrimary: true,
    }));
  });
}
export function pointerCancel(el: Element): void {
  act(() => {
    el.dispatchEvent(new PointerEvent('pointercancel', {
      bubbles: true,
      cancelable: true,
      pointerId: 1,
    }));
  });
}

export function click(el: Element): void {
  act(() => {
    (el as HTMLElement).click();
  });
}

export function setInput(el: HTMLInputElement, value: string): void {
  // React 19 + happy-dom doesn't deliver dispatched `input` events to
  // React's synthetic-event listener (events bubble through the DOM
  // fine, but React's root listener never fires). Workaround: read the
  // input's React fiber-attached props (`__reactProps$<id>`) and call
  // the original `onChange` directly with a minimal synthetic-event
  // shape. This is the same trick `@testing-library/react` falls back
  // to when `fireEvent` can't drive a controlled input cleanly.
  type WithFiberProps = HTMLElement & Record<string, unknown>;
  const propsKey = Object.keys(el as WithFiberProps).find((k) => k.startsWith('__reactProps$'));
  const props = propsKey
    ? ((el as WithFiberProps)[propsKey] as { onChange?: (e: unknown) => void } | undefined)
    : undefined;
  // Mirror the value into the DOM so subsequent reads see it.
  const proto =
    el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
  setter?.call(el, value);
  if (props?.onChange) {
    act(() => {
      props.onChange?.({ target: el, currentTarget: el });
    });
  }
}

/**
 * happy-dom returns 0 width/height by default, which breaks the
 * picker's pointer-position math (`(x - rect.left) / rect.width`
 * NaNs). Stub a fixed 100×100 rect so percentages are deterministic.
 */
export function stubRect(el: Element, rect: Partial<DOMRect> = {}): void {
  const filled: DOMRect = {
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: 100,
    bottom: 100,
    width: 100,
    height: 100,
    toJSON: () => ({}),
    ...rect,
  } as DOMRect;
  Object.defineProperty(el, 'getBoundingClientRect', {
    configurable: true,
    value: () => filled,
  });
}
