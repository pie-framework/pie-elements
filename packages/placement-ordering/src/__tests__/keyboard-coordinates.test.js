import { defaultKeyboardCoordinateGetter, KeyboardCode } from '@dnd-kit/core';
import { closestDroppableKeyboardCoordinates } from '../keyboard-coordinates';

// Two target tiles stacked vertically, plus an empty gap left behind in the choices row.
const target1Rect = { left: 0, top: 100, width: 200, height: 40, right: 200, bottom: 140 };
const target2Rect = { left: 0, top: 150, width: 200, height: 40, right: 200, bottom: 190 };
const choiceGapRect = { left: 0, top: 0, width: 200, height: 40, right: 200, bottom: 40 };

function buildContext({ collisionRect, extraContainers = {} }) {
  const droppableRects = new Map([
    ['drop-target-c1-2-instance', target1Rect],
    ['drop-target-c2-3-instance', target2Rect],
    ['drop-choice-c3-0-instance', choiceGapRect],
  ]);
  const droppableContainers = new Map([
    ['drop-target-c1-2-instance', { disabled: false, data: { current: { id: 'c1', type: 'target' } } }],
    ['drop-target-c2-3-instance', { disabled: false, data: { current: { id: 'c2', type: 'target' } } }],
    ['drop-choice-c3-0-instance', { disabled: false, data: { current: { id: 'c3', type: 'choice' } } }],
    ...Object.entries(extraContainers),
  ]);

  return { droppableRects, droppableContainers, collisionRect };
}

const activeChoice = { data: { current: { id: 'c4', type: 'choice' } } };
const activeTarget = { data: { current: { id: 'c5', type: 'target' } } };

function makeEvent(code, shiftKey = false) {
  return { code, preventDefault: jest.fn(), shiftKey };
}

describe('closestDroppableKeyboardCoordinates', () => {
  describe('arrow keys', () => {
    it('delegates to dnd-kit default keyboard coordinate getter, unchanged', () => {
      const collisionRect = { left: 0, top: 100, width: 200, height: 40 };
      const context = buildContext({ collisionRect });
      const currentCoordinates = { x: 10, y: 20 };

      [KeyboardCode.Down, KeyboardCode.Up, KeyboardCode.Left, KeyboardCode.Right].forEach((code) => {
        const event = makeEvent(code);
        const result = closestDroppableKeyboardCoordinates(event, { context, currentCoordinates });
        const expected = defaultKeyboardCoordinateGetter(event, { context, currentCoordinates });

        expect(result).toEqual(expected);
      });
    });

    it('does not call preventDefault for arrow keys (matches existing dnd-kit behavior)', () => {
      const collisionRect = { left: 0, top: 100, width: 200, height: 40 };
      const context = buildContext({ collisionRect });
      const event = makeEvent(KeyboardCode.Down);

      closestDroppableKeyboardCoordinates(event, { context, currentCoordinates: { x: 0, y: 0 } });

      expect(event.preventDefault).not.toHaveBeenCalled();
    });
  });

  describe('Tab / Shift+Tab', () => {
    it('jumps to the next droppable, placing the dragged item\'s top-left at its center-left', () => {
      const collisionRect = { left: 0, top: 0, width: 200, height: 40 };
      const context = buildContext({ collisionRect });
      // Currently positioned over the choice gap (topmost by y).
      const currentCoordinates = { x: choiceGapRect.left, y: choiceGapRect.top };

      const next = closestDroppableKeyboardCoordinates(makeEvent('Tab'), { context, currentCoordinates });

      expect(next).toEqual({ x: target1Rect.left, y: target1Rect.top + target1Rect.height / 2 });
    });

    it('cycles backwards with Shift+Tab', () => {
      const collisionRect = { left: 0, top: 100, width: 200, height: 40 };
      const context = buildContext({ collisionRect });
      const currentCoordinates = { x: target1Rect.left, y: target1Rect.top };

      const next = closestDroppableKeyboardCoordinates(makeEvent('Tab', true), { context, currentCoordinates });

      expect(next).toEqual({ x: choiceGapRect.left, y: choiceGapRect.top + choiceGapRect.height / 2 });
    });

    it('calls preventDefault so native Tab focus movement does not also happen', () => {
      const collisionRect = { left: 0, top: 100, width: 200, height: 40 };
      const context = buildContext({ collisionRect });
      const event = makeEvent('Tab');

      closestDroppableKeyboardCoordinates(event, { context, currentCoordinates: { x: 0, y: 100 } });

      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('excludes the dragged tile\'s own droppable (already disabled while isDragging) from the candidates', () => {
      // tile.jsx disables a tile's own droppable via `useDroppable({ disabled: isDragging })`,
      // so the dragged target's own slot must not appear as an enabled candidate here.
      const collisionRect = { left: 0, top: 150, width: 200, height: 40 };
      const context = buildContext({
        collisionRect,
        extraContainers: { 'drop-target-c2-3-instance': { disabled: true } },
      });
      const currentCoordinates = { x: target2Rect.left, y: target2Rect.top };

      const next = closestDroppableKeyboardCoordinates(makeEvent('Tab'), { context, currentCoordinates });

      // With target2 (its own slot) excluded, the remaining candidates are target1 and
      // the choice gap. target1 is closest to the current position, so it becomes the
      // "current" index, and Tab steps forward from there to the choice gap.
      expect(next).toEqual({ x: choiceGapRect.left, y: choiceGapRect.top + choiceGapRect.height / 2 });
    });

    it('lands on an occupied target tile just like any other enabled droppable', () => {
      // Occupied vs. empty target tiles are both just "enabled droppables" from this
      // getter's point of view — the swap/replacement behavior itself lives in the
      // reducer (ordering.js), triggered the same way as pointer dragging once the
      // item is placed there.
      const collisionRect = { left: 0, top: 0, width: 200, height: 40 };
      const context = buildContext({ collisionRect });
      const currentCoordinates = { x: choiceGapRect.left, y: choiceGapRect.top };

      const next = closestDroppableKeyboardCoordinates(makeEvent('Tab'), {
        active: activeTarget,
        context,
        currentCoordinates,
      });

      expect(next).toEqual({ x: target1Rect.left, y: target1Rect.top + target1Rect.height / 2 });
    });

    it('excludes other choice-row tiles while dragging a choice, cycling only through targets', () => {
      // Dragging a choice: the choice gap must not be a Tab stop, since dropping a
      // choice onto another choice is a no-op in the reducer. With the choice gap
      // excluded, only target1/target2 remain, so Shift+Tab (backwards) from target1
      // wraps around to target2 instead of landing on the choice gap.
      const collisionRect = { left: 0, top: 100, width: 200, height: 40 };
      const context = buildContext({ collisionRect });
      const currentCoordinates = { x: target1Rect.left, y: target1Rect.top };

      const next = closestDroppableKeyboardCoordinates(makeEvent('Tab', true), {
        active: activeChoice,
        context,
        currentCoordinates,
      });

      expect(next).toEqual({ x: target2Rect.left, y: target2Rect.top + target2Rect.height / 2 });
    });

    it('still allows returning a placed target back onto a choice-row gap', () => {
      // Dragging a target (a placed choice): the choice-row gap is a valid "return to
      // pool" destination and must remain a Tab stop.
      const collisionRect = { left: 0, top: 100, width: 200, height: 40 };
      const context = buildContext({ collisionRect });
      const currentCoordinates = { x: target1Rect.left, y: target1Rect.top };

      const next = closestDroppableKeyboardCoordinates(makeEvent('Tab', true), {
        active: activeTarget,
        context,
        currentCoordinates,
      });

      expect(next).toEqual({ x: choiceGapRect.left, y: choiceGapRect.top + choiceGapRect.height / 2 });
    });
  });
});
