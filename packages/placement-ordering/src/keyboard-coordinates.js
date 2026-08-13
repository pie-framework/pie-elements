import { defaultKeyboardCoordinateGetter, KeyboardCode } from '@dnd-kit/core';

/**
 * Custom keyboard coordinate getter for placement-ordering's Tab-based placement mode
 * (enabled only when the item is configured with `placementArea` / `includeTargets`).
 *
 * Tab/Shift+Tab cycle the dragged choice directly onto the next/previous enabled
 * droppable (a placement/target tile, or an empty gap left behind in the choices row),
 * in real on-screen position order, placing the dragged item's own top-left corner at
 * the target's center-left point.
 *
 * Arrow keys are delegated to dnd-kit's own `defaultKeyboardCoordinateGetter` so the
 * pre-existing free-form arrow-key dragging behavior is left completely unchanged.
 *
 * The tile currently being dragged already disables its own droppable
 * (see `useDroppable({ disabled: isDragging })` in tile.jsx), so it's naturally
 * excluded from the candidate list here without any extra bookkeeping.
 *
 * When picking up a choice from the choices row, the other not-yet-placed choice
 * tiles are also registered droppables (tile.jsx disables a droppable only while it's
 * the one being dragged), but dropping a choice onto another choice is a no-op in the
 * reducer (ordering.js's updateResponse has no `choice -> choice` case) — so they're
 * excluded from the Tab/Shift+Tab cycle, leaving only the real placement targets.
 */
export const closestDroppableKeyboardCoordinates = (event, { active, context, currentCoordinates }) => {
  const { code } = event;
  const isTab = code === 'Tab';
  const isArrow =
    code === KeyboardCode.Down || code === KeyboardCode.Up || code === KeyboardCode.Left || code === KeyboardCode.Right;

  if (!isTab && !isArrow) {
    return undefined;
  }

  if (isArrow) {
    return defaultKeyboardCoordinateGetter(event, { context, currentCoordinates });
  }

  event.preventDefault();

  const { droppableRects, droppableContainers, collisionRect } = context;

  if (!droppableRects || droppableRects.size === 0) {
    return currentCoordinates;
  }

  // `currentCoordinates` is the top-left of the dragged item's collision rect (not its
  // center), so derive the dragged item's center in the same frame before comparing it
  // against droppable centers below.
  const draggedHalfSize = {
    x: (collisionRect?.width || 0) / 2,
    y: (collisionRect?.height || 0) / 2,
  };
  const currentCenter = {
    x: currentCoordinates.x + draggedHalfSize.x,
    y: currentCoordinates.y + draggedHalfSize.y,
  };

  // Only exclude other choice tiles while dragging a choice; dragging a placed target
  // back onto a choice-row gap is still a valid "return to pool" destination.
  const activeType = active?.data?.current?.type;
  const excludeChoiceDroppables = activeType === 'choice';

  const targets = [];

  for (const [id, container] of droppableContainers) {
    if (container?.disabled) continue;

    if (excludeChoiceDroppables && container?.data?.current?.type === 'choice') continue;

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

  const reverse = event.shiftKey;

  // Sort targets by real on-screen position (top to bottom, then left to right), so
  // this works the same whether the tiler is laid out vertically or horizontally.
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

  const nextIndex = reverse
    ? (currentIndex - 1 + targets.length) % targets.length
    : (currentIndex + 1) % targets.length;

  return targets[nextIndex].dropPosition;
};

const distance = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
