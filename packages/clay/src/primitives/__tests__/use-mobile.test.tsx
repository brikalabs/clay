/**
 * Unit tests for `useIsMobile`. Mounts the hook into a happy-dom
 * environment with a stubbed `matchMedia` so each branch (initial
 * state, change events, cleanup) is exercised without a real
 * viewport.
 */

import './happydom';
import { afterAll, describe, expect, test } from 'bun:test';
import { act, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import { useIsMobile } from '../use-mobile';

interface FakeMql {
  matches: boolean;
  listeners: Array<(event: { matches: boolean }) => void>;
  addEventListener: (type: 'change', l: (event: { matches: boolean }) => void) => void;
  removeEventListener: (type: 'change', l: (event: { matches: boolean }) => void) => void;
}

function installMatchMedia(initialMatches: boolean): FakeMql {
  const mql: FakeMql = {
    matches: initialMatches,
    listeners: [],
    addEventListener(_type, listener) {
      this.listeners.push(listener);
    },
    removeEventListener(_type, listener) {
      this.listeners = this.listeners.filter((l) => l !== listener);
    },
  };
  (globalThis as unknown as { matchMedia: (q: string) => FakeMql }).matchMedia = () => mql;
  return mql;
}

function mountHook(): { last: { value: boolean }; unmount: () => void } {
  const last = { value: false };
  function Probe() {
    const v = useIsMobile();
    useEffect(() => {
      last.value = v;
    });
    return null;
  }
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(<Probe />);
  });
  return {
    last,
    unmount: () => {
      act(() => {
        root.unmount();
      });
      container.remove();
    },
  };
}

afterAll(() => {
  document.body.innerHTML = '';
});

describe('useIsMobile', () => {
  test('returns the initial matchMedia result after mount', () => {
    installMatchMedia(true);
    const probe = mountHook();
    expect(probe.last.value).toBe(true);
    probe.unmount();
  });

  test('returns false when the viewport is wider than the breakpoint', () => {
    installMatchMedia(false);
    const probe = mountHook();
    expect(probe.last.value).toBe(false);
    probe.unmount();
  });

  test('reacts to subsequent `change` events from the MQL', () => {
    const mql = installMatchMedia(false);
    const probe = mountHook();
    expect(probe.last.value).toBe(false);
    act(() => {
      mql.matches = true;
      for (const listener of mql.listeners) listener({ matches: true });
    });
    expect(probe.last.value).toBe(true);
    probe.unmount();
  });

  test('removes the change listener on unmount', () => {
    const mql = installMatchMedia(false);
    const probe = mountHook();
    expect(mql.listeners.length).toBe(1);
    probe.unmount();
    expect(mql.listeners.length).toBe(0);
  });
});
