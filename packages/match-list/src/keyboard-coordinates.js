import { KeyboardCode } from '@dnd-kit/core';

const ARROW_STEP = 25;

/**
 * Custom keyboard coordinate getter for non-sortable drag-and-drop.
 *
 * Tab/Shift+Tab cycle the dragged item directly onto the next/previous droppable
 * (response area or the choices pool), in DOM order, placing the dragged item's own
 * top-left corner at the target's center-left point. Arrow keys are left doing plain
 * free-form movement (nudging the dragged item by a fixed step, same as dnd-kit's own
 * default keyboard behavior) rather than jumping between droppables — collision
 * detection (rectIntersection) still picks up whatever the item ends up actually
 * overlapping.
 */
export const closestDroppableKeyboardCoordinates = (event, { active, context, currentCoordinates }) => {
  const { code } = event;
  const isTab = code === 'Tab';
  const isArrow =
    code === KeyboardCode.Down || code === KeyboardCode.Up || code === KeyboardCode.Left || code === KeyboardCode.Right;

  if (!isTab && !isArrow) {
    return undefined;
  }

  event.preventDefault();

  if (isArrow) {
    switch (code) {
      case KeyboardCode.Down:
        return { ...currentCoordinates, y: currentCoordinates.y + ARROW_STEP };

      case KeyboardCode.Up:
        return { ...currentCoordinates, y: currentCoordinates.y - ARROW_STEP };

      case KeyboardCode.Right:
        return { ...currentCoordinates, x: currentCoordinates.x + ARROW_STEP };

      case KeyboardCode.Left:
        return { ...currentCoordinates, x: currentCoordinates.x - ARROW_STEP };

      default:
        return currentCoordinates;
    }
  }

  const { droppableRects, droppableContainers, collisionRect } = context;

  if (!droppableRects || droppableRects.size === 0) {
    return currentCoordinates;
  }

  // `currentCoordinates` is the top-left of the dragged item's collision rect (not its
  // center), so derive the dragged item's center in the same frame before comparing it
  // against droppable centers below. Returning a droppable's *center* as the next
  // coordinates (as opposed to its top-left) would shift the dragged item's top-left to
  // that center, overshooting the target by roughly half its size and causing
  // dnd-kit to resolve collisions against a neighboring droppable instead.
  const draggedHalfSize = {
    x: (collisionRect?.width || 0) / 2,
    y: (collisionRect?.height || 0) / 2,
  };
  const currentCenter = {
    x: currentCoordinates.x + draggedHalfSize.x,
    y: currentCoordinates.y + draggedHalfSize.y,
  };

  // A placed answer ("target") is itself a droppable for its own prompt slot
  // ("drop-{promptId}"). That self drop-zone must never be treated as a navigable
  // target: it sits under the dragged item, so a tiny (even sub-pixel) discrepancy
  // between its measured rect and the dragged item's own rect is enough to make it
  // register as the "closest" candidate, which reads as the drag being stuck.
  // Exclude it outright rather than relying on a distance threshold.
  const activeData = active?.data?.current;
  const ownDropId = activeData?.promptId != null ? `drop-${activeData.promptId}` : undefined;

  // Collect top-left and center of all enabled droppable containers
  const targets = [];

  for (const [id, container] of droppableContainers) {
    if (container?.disabled) continue;

    if (id === ownDropId) continue;

    const rect = droppableRects.get(id);

    if (!rect) continue;

    const center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    // Land the dragged item's own top-left corner at the target's center-left point,
    // rather than at the target's own top-left corner.
    const dropPosition = {
      x: rect.left,
      y: rect.top + rect.height / 2,
    };

    targets.push({ id, dropPosition, center });
  }

  if (targets.length === 0) {
    return currentCoordinates;
  }

  // Tab/Shift+Tab: cycle through targets in DOM order (sorted top-to-bottom, left-to-right)
  const reverse = event.shiftKey;

  // Sort targets by position (top to bottom, then left to right)
  targets.sort((a, b) => {
    if (Math.abs(a.center.y - b.center.y) > 10) return a.center.y - b.center.y;
    return a.center.x - b.center.x;
  });

  // Find the current target (closest to current coordinates)
  let currentIndex = 0;
  let minDist = Infinity;

  for (let i = 0; i < targets.length; i++) {
    const dist = distance(currentCenter, targets[i].center);

    if (dist < minDist) {
      minDist = dist;
      currentIndex = i;
    }
  }

  // Move to next/previous
  const nextIndex = reverse
    ? (currentIndex - 1 + targets.length) % targets.length
    : (currentIndex + 1) % targets.length;

  return targets[nextIndex].dropPosition;
};

const distance = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
