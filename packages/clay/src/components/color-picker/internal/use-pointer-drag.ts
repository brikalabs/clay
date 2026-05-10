/**
 * Pointer-drag handlers shared by every 1D / 2D slider in the picker.
 *
 *   const { handlers } = usePointerDrag(({ x, y }) => writePosition(x, y));
 *   <div {...handlers} />
 *
 * Captures the pointer on `pointerdown`, calls `update` on every
 * `pointermove` while the drag is active, and releases capture on
 * `pointerup` / `pointercancel`. Caller decides whether to use `x`,
 * `y`, or both.
 */

import { type PointerEvent as ReactPointerEvent, useRef } from 'react';

export interface DragPoint {
  readonly x: number;
  readonly y: number;
}

export interface PointerDragHandlers {
  readonly onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void;
  readonly onPointerMove: (e: ReactPointerEvent<HTMLDivElement>) => void;
  readonly onPointerUp: (e: ReactPointerEvent<HTMLDivElement>) => void;
  readonly onPointerCancel: (e: ReactPointerEvent<HTMLDivElement>) => void;
}

export function usePointerDrag(
  update: (point: DragPoint) => void
): { readonly handlers: PointerDragHandlers } {
  const dragRef = useRef(false);
  const handlers: PointerDragHandlers = {
    onPointerDown: (e) => {
      dragRef.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      update({ x: e.clientX, y: e.clientY });
    },
    onPointerMove: (e) => {
      if (!dragRef.current) return;
      update({ x: e.clientX, y: e.clientY });
    },
    onPointerUp: (e) => {
      dragRef.current = false;
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    },
    onPointerCancel: (e) => {
      dragRef.current = false;
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    },
  };
  return { handlers };
}
