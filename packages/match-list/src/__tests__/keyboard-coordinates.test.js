import { KeyboardCode } from '@dnd-kit/core';
import { closestDroppableKeyboardCoordinates } from '../keyboard-coordinates';

// Response row ("drop-2") sits directly above the choices pool.
const dropZoneRect = { left: 0, top: 100, width: 200, height: 40, right: 200, bottom: 140 };
const choicesPoolRect = { left: 0, top: 150, width: 400, height: 300, right: 400, bottom: 450 };

function buildContext({ collisionRect }) {
  const droppableRects = new Map([
    ['drop-2', dropZoneRect],
    ['choices-pool', choicesPoolRect],
  ]);
  const droppableContainers = new Map([
    ['drop-2', { disabled: false }],
    ['choices-pool', { disabled: false }],
  ]);

  return { droppableRects, droppableContainers, collisionRect };
}

function makeEvent(code, shiftKey = false) {
  return { code, preventDefault: () => {}, shiftKey };
}

describe('closestDroppableKeyboardCoordinates', () => {
  describe('arrow keys', () => {
    it('nudges the dragged item by a fixed step instead of jumping to a droppable', () => {
      const collisionRect = { left: 0, top: 100, width: 200, height: 40 };
      const context = buildContext({ collisionRect });
      const currentCoordinates = { x: 10, y: 20 };

      expect(
        closestDroppableKeyboardCoordinates(makeEvent(KeyboardCode.Down), { context, currentCoordinates }),
      ).toEqual({ x: 10, y: 45 });
      expect(
        closestDroppableKeyboardCoordinates(makeEvent(KeyboardCode.Up), { context, currentCoordinates }),
      ).toEqual({ x: 10, y: -5 });
      expect(
        closestDroppableKeyboardCoordinates(makeEvent(KeyboardCode.Right), { context, currentCoordinates }),
      ).toEqual({ x: 35, y: 20 });
      expect(
        closestDroppableKeyboardCoordinates(makeEvent(KeyboardCode.Left), { context, currentCoordinates }),
      ).toEqual({ x: -15, y: 20 });
    });
  });

  describe('Tab / Shift+Tab', () => {
    it('jumps to the next droppable, placing the dragged item\'s top-left at the target\'s center-left', () => {
      // Dragging an item currently positioned exactly over drop-2.
      const collisionRect = { left: 0, top: 100, width: 200, height: 40 };
      const context = buildContext({ collisionRect });
      const currentCoordinates = { x: dropZoneRect.left, y: dropZoneRect.top };

      const next = closestDroppableKeyboardCoordinates(makeEvent('Tab'), {
        context,
        currentCoordinates,
      });

      // x = choices-pool's left edge; y = choices-pool's vertical center. The dragged
      // item's own top-left corner (not its center) lands there.
      expect(next).toEqual({
        x: choicesPoolRect.left,
        y: choicesPoolRect.top + choicesPoolRect.height / 2,
      });
    });

    it('cycles backwards with Shift+Tab', () => {
      const collisionRect = { left: 0, top: 100, width: 200, height: 40 };
      const context = buildContext({ collisionRect });
      const currentCoordinates = { x: dropZoneRect.left, y: dropZoneRect.top };

      const next = closestDroppableKeyboardCoordinates(makeEvent('Tab', true), {
        context,
        currentCoordinates,
      });

      // Only one other target exists (choices-pool), so Shift+Tab wraps to it too.
      expect(next).toEqual({
        x: choicesPoolRect.left,
        y: choicesPoolRect.top + choicesPoolRect.height / 2,
      });
    });

    it('does not get stuck on its own drop-zone when cycling from a placed answer ("target")', () => {
      // A "target" is simultaneously draggable and droppable for its own slot, so its own
      // drop-zone rect can be off-by-a-few-px from the dragged node's own rect in a real
      // browser (they're different DOM nodes). Simulate that mismatch here: the active
      // item's own slot ("drop-2") is registered slightly below the item's actual
      // collision rect, which — without excluding it — could make Tab cycle back onto it.
      const collisionRect = { left: 0, top: 150, width: 200, height: 40 };
      const droppableRects = new Map([
        ['drop-1', { left: 0, top: 100, width: 200, height: 40 }],
        ['drop-2', { left: 0, top: 152, width: 200, height: 42 }], // active item's own slot, slightly offset
        ['drop-3', { left: 0, top: 200, width: 200, height: 40 }],
        // Sits below all rows (non-overlapping), same as in the real layout.
        ['choices-pool', { left: 0, top: 250, width: 400, height: 300 }],
      ]);
      const droppableContainers = new Map(
        Array.from(droppableRects.keys(), (id) => [id, { disabled: false }]),
      );
      const context = { droppableRects, droppableContainers, collisionRect };
      const currentCoordinates = { x: collisionRect.left, y: collisionRect.top };
      const active = { id: 'target-9', data: { current: { type: 'target', id: 9, promptId: 2 } } };

      const next = closestDroppableKeyboardCoordinates(makeEvent('Tab'), {
        active,
        context,
        currentCoordinates,
      });

      // drop-3's center-left point (top:200, height:40 -> y:220), not the own
      // slightly-lower drop-2.
      expect(next).toEqual({ x: 0, y: 220 });
    });

    it('keeps advancing on repeated Shift+Tab when response rows are much wider than the dragged item', () => {
      // Regression test for a real report: after Shift+Tab lands the dragged item on a
      // wide response row, the *next* Shift+Tab appeared to do nothing. Response rows
      // here (900px) are much wider than the dragged choice tile (100px) and the
      // choices pool is comparatively narrow — the exact shape that reproduced it.
      const rowWidth = 900;
      const rowHeight = 40;
      const droppableRects = new Map([
        ['drop-1', { left: 0, top: 0, width: rowWidth, height: rowHeight }],
        ['drop-2', { left: 0, top: 50, width: rowWidth, height: rowHeight }],
        ['drop-3', { left: 0, top: 100, width: rowWidth, height: rowHeight }],
        ['choices-pool', { left: 0, top: 140, width: 300, height: 300 }],
      ]);
      const droppableContainers = new Map(
        Array.from(droppableRects.keys(), (id) => [id, { disabled: false }]),
      );
      const context = { droppableRects, droppableContainers };
      const active = { id: 'choice-1', data: { current: { type: 'choice', id: 1 } } };

      // Shift+Tab #1: starting from inside the pool, lands on drop-3 (the last row).
      const afterFirst = closestDroppableKeyboardCoordinates(makeEvent('Tab', true), {
        active,
        context,
        currentCoordinates: { x: 20, y: 300 },
      });

      expect(afterFirst).toEqual({ x: 0, y: 120 }); // drop-3's center-left point

      // Shift+Tab #2: now sitting exactly at drop-3's drop position, should advance to
      // drop-2 — not re-match the choices pool as "current" and recompute the same move.
      const afterSecond = closestDroppableKeyboardCoordinates(makeEvent('Tab', true), {
        active,
        context,
        currentCoordinates: afterFirst,
      });

      expect(afterSecond).toEqual({ x: 0, y: 70 }); // drop-2's center-left point
    });
  });
});
