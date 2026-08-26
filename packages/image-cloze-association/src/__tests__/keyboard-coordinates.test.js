import { KeyboardCode } from '@dnd-kit/core';
import { closestDroppableKeyboardCoordinates } from '../keyboard-coordinates';

function rectsToContext(rects) {
  const droppableRects = new Map(Object.entries(rects));
  const droppableContainers = new Map(Object.keys(rects).map((id) => [id, { disabled: false }]));

  return { droppableRects, droppableContainers };
}

function makeEvent(code, shiftKey = false) {
  return { code, preventDefault: () => {}, shiftKey };
}

// Mirrors dnd-kit's own KeyboardSensor, which always derives collisionRect's top-left
// from the dragged item's current on-screen position on every keydown — so a test's
// collisionRect must track currentCoordinates the same way on every simulated press,
// not stay fixed while currentCoordinates changes across multiple presses.
function press(rects, currentCoordinates, itemSize, event) {
  const context = {
    ...rectsToContext(rects),
    collisionRect: { left: currentCoordinates.x, top: currentCoordinates.y, ...itemSize },
  };

  return closestDroppableKeyboardCoordinates(event, { context, currentCoordinates });
}

describe('closestDroppableKeyboardCoordinates', () => {
  describe('arrow keys', () => {
    it("nudges the dragged item by dnd-kit's own default step (25px), unchanged", () => {
      const context = { ...rectsToContext({}), collisionRect: { left: 0, top: 0, width: 100, height: 40 } };
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
    // Two response containers plus the choices pool ("ica-board"), laid out
    // top-to-bottom like they would be over an image.
    const container0Rect = { left: 0, top: 0, width: 200, height: 40, right: 200, bottom: 40 };
    const container1Rect = { left: 0, top: 60, width: 200, height: 40, right: 200, bottom: 100 };
    const poolRect = { left: 0, top: 120, width: 400, height: 300, right: 400, bottom: 420 };
    const baseRects = {
      'response-container-0': container0Rect,
      'response-container-1': container1Rect,
      'ica-board': poolRect,
    };

    it('jumps to the next droppable in top-to-bottom order, landing at its center-left point', () => {
      const currentCoordinates = { x: container0Rect.left, y: container0Rect.top };

      const next = press(baseRects, currentCoordinates, { width: 200, height: 40 }, makeEvent('Tab'));

      expect(next).toEqual({ x: container1Rect.left, y: container1Rect.top + container1Rect.height / 2 });
    });

    it('cycles backwards with Shift+Tab, wrapping to the pool', () => {
      const currentCoordinates = { x: container0Rect.left, y: container0Rect.top };

      const next = press(baseRects, currentCoordinates, { width: 200, height: 40 }, makeEvent('Tab', true));

      expect(next).toEqual({ x: poolRect.left, y: poolRect.top + poolRect.height / 2 });
    });

    it('keeps advancing on repeated Shift+Tab when a container is much wider than the dragged item', () => {
      // Regression case for the bug already found and fixed in match-list: matching the
      // "current" target by reconstructing a center from the dragged item's own small
      // size (instead of checking which target's rect actually contains it) makes the
      // *next* press re-match a completely different droppable once the item is
      // actually sitting on a wide target, so it looks like the press does nothing.
      // Only two targets here (a wide container and the pool), to isolate this from
      // sort-order effects.
      const wideContainerRect = { left: 0, top: 0, width: 900, height: 40, right: 900, bottom: 40 };
      const rects = { 'response-container-0': wideContainerRect, 'ica-board': poolRect };
      const itemSize = { width: 100, height: 40 };

      // Start inside the pool, Shift+Tab to the only other target: the wide container.
      const afterFirst = press(rects, { x: poolRect.left, y: poolRect.top }, itemSize, makeEvent('Tab', true));

      expect(afterFirst).toEqual({ x: 0, y: 20 }); // wide container's center-left point

      // Now sitting exactly at that dropPosition — Shift+Tab again must advance back
      // to the pool, not re-match some other droppable.
      const afterSecond = press(rects, afterFirst, itemSize, makeEvent('Tab', true));

      expect(afterSecond).toEqual({ x: poolRect.left, y: poolRect.top + poolRect.height / 2 });
    });

    it("correctly identifies the pool as the current target when picking up an item positioned near the pool's edge, close to a small neighboring container", () => {
      // Regression case for the OTHER failure mode: matching "current target" purely
      // by nearest-dropPosition (instead of containment first) can misidentify the
      // pool as some small, unrelated nearby container, because a large droppable's
      // dropPosition is anchored at ITS OWN vertical middle — which can be far from an
      // item that's sitting near the droppable's edge, even though the item is clearly
      // still inside it.
      const tallPoolRect = { left: 0, top: 0, width: 400, height: 600, right: 400, bottom: 600 };
      const smallContainerRect = { left: 0, top: -60, width: 100, height: 40, right: 100, bottom: -20 };
      const rects = { 'response-container-0': smallContainerRect, 'ica-board': tallPoolRect };
      const itemSize = { width: 100, height: 40 };

      // The item sits just inside the pool's top edge (y: 10-50) — nowhere near the
      // pool's own vertical middle (y: 300), but visually still inside it, and closer
      // in raw distance to the small container's anchor point (top: -60, center y:
      // -40) than to the pool's anchor point (center y: 300).
      const currentCoordinates = { x: 0, y: 10 };

      const next = press(rects, currentCoordinates, itemSize, makeEvent('Tab'));

      // Tab forward from the pool lands on the only other target: the small
      // container — proving the pool, not the small container, was identified as
      // "current".
      expect(next).toEqual({ x: smallContainerRect.left, y: smallContainerRect.top + smallContainerRect.height / 2 });
    });
  });
});
