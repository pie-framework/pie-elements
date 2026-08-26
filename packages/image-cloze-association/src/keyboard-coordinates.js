import { defaultKeyboardCoordinateGetter, KeyboardCode } from '@dnd-kit/core';

/**
 * Custom keyboard coordinate getter for image-cloze-association's Tab-based placement.
 *
 * Tab/Shift+Tab cycle the dragged answer directly onto the next/previous enabled
 * droppable — a response container (`response-container-{index}`) or the choices pool
 * (`ica-board`) — sorted by on-screen position (top-to-bottom, then left-to-right),
 * since response containers are absolutely positioned over an image rather than laid
 * out as a simple list.
 *
 * Arrow keys are delegated to dnd-kit's own `defaultKeyboardCoordinateGetter`, leaving
 * the existing free-form arrow-key dragging behavior completely unchanged.
 */
export const closestDroppableKeyboardCoordinates = (event, { context, currentCoordinates }) => {
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

  const targets = [];

  for (const [id, container] of droppableContainers) {
    if (container?.disabled) continue;

    const rect = droppableRects.get(id);

    if (!rect) continue;

    const center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    // Land the dragged item's own top-left corner at the target's center-left point,
    // rather than at the target's own top-left corner (avoids overshooting into a
    // neighboring droppable when the target is much wider than the dragged item).
    const dropPosition = {
      x: rect.left,
      y: rect.top + rect.height / 2,
    };

    targets.push({ id, rect, dropPosition, center });
  }

  if (targets.length === 0) {
    return currentCoordinates;
  }

  const reverse = event.shiftKey;

  targets.sort((a, b) => {
    if (Math.abs(a.center.y - b.center.y) > 10) return a.center.y - b.center.y;
    return a.center.x - b.center.x;
  });

  // Find the current target: whichever target's rect actually contains the dragged
  // item's own center. This holds regardless of how the dragged item's size compares
  // to the target's — a compact answer tile landed (per `dropPosition` above) at a much
  // wider container's left edge is still contained within that container's rect.
  // Comparing distances between reconstructed centers (as an earlier, buggy version of
  // this same logic in match-list did) breaks down for exactly that shape: a
  // reconstructed center can end up closer to a completely different droppable than to
  // the one the item is actually sitting on, so the *next* press re-matches the wrong
  // target and looks like it does nothing.
  const draggedCenter = collisionRect
    ? { x: collisionRect.left + collisionRect.width / 2, y: collisionRect.top + collisionRect.height / 2 }
    : currentCoordinates;

  let currentIndex = targets.findIndex(
    (t) =>
      draggedCenter.x >= t.rect.left &&
      draggedCenter.x <= t.rect.right &&
      draggedCenter.y >= t.rect.top &&
      draggedCenter.y <= t.rect.bottom,
  );

  // Fall back to nearest-by-dropPosition if the dragged item's center isn't strictly
  // inside any target (e.g. mid-flight after a free arrow-key move).
  if (currentIndex === -1) {
    let minDist = Infinity;

    for (let i = 0; i < targets.length; i++) {
      const dist = distance(currentCoordinates, targets[i].dropPosition);

      if (dist < minDist) {
        minDist = dist;
        currentIndex = i;
      }
    }
  }

  const nextIndex = reverse
    ? (currentIndex - 1 + targets.length) % targets.length
    : (currentIndex + 1) % targets.length;

  return targets[nextIndex].dropPosition;
};

const distance = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
