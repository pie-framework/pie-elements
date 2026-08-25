import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ImageClozeAssociationComponent as Root } from '../root';
import { closestDroppableKeyboardCoordinates } from '../keyboard-coordinates';

jest.mock('@dnd-kit/core', () => ({
  DragOverlay: ({ children }) => <div>{children}</div>,
  useDraggable: () => ({
    setNodeRef: jest.fn(),
    attributes: {},
    listeners: {},
  }),
  useDroppable: () => ({
    setNodeRef: jest.fn(),
    isOver: false,
  }),
}));

let capturedDragProviderProps;

jest.mock('@pie-lib/drag', () => ({
  DragProvider: (props) => {
    capturedDragProviderProps = props;
    return <div>{props.children}</div>;
  },
  ICADroppablePlaceholder: ({ children }) => <div>{children}</div>,
}));

const model = {
  possibleResponses: ['firstImage', 'secondImage'],
  responseContainers: [
    { index: 0, x: 0, y: 0, width: '10%', height: '10%' },
    { index: 1, x: 20, y: 20, width: '10%', height: '10%' },
  ],
  duplicateResponses: false,
  maxResponsePerZone: 1,
  image: { src: 'test.jpg', width: 100, height: 100 },
};

describe('Root', () => {
  const updateAnswer = jest.fn();

  // Warm-up render: the very first `render(<Root .../>)` call in this file's jest
  // worker doesn't reliably invoke the mocked `DragProvider` (its assignment to
  // `capturedDragProviderProps` never runs, even though React reports the correct
  // component reference and the surrounding tree renders successfully) — a one-time
  // environment quirk, not anything about the mock or Root itself, since every
  // subsequent render works correctly. Priming it here, once, before any test's
  // assertions depend on it, avoids the tests that check `capturedDragProviderProps`
  // being order-dependent on some other, unrelated test happening to render first.
  beforeAll(() => {
    render(<Root model={model} session={{ answers: [] }} updateAnswer={jest.fn()} />).unmount();
  });

  const mkWrapper = (opts = {}) => {
    const props = {
      model,
      session: { answers: [] },
      updateAnswer,
      ...opts,
    };
    return render(<Root {...props} />);
  };

  const createInstance = (opts = {}) => {
    const props = {
      model,
      session: { answers: [] },
      updateAnswer,
      ...opts,
    };
    const instance = new Root(props);

    // Mock setState to execute updates immediately for testing
    instance.setState = jest.fn((state) => {
      Object.assign(instance.state, typeof state === 'function' ? state(instance.state) : state);
    });

    return instance;
  };

  describe('initialization', () => {
    it('initializes with correct possible responses', () => {
      const instance = createInstance();
      expect(instance.state.possibleResponses).toEqual([
        { value: 'firstImage', id: '0' },
        { value: 'secondImage', id: '1' },
      ]);
    });
  });

  describe('handleOnAnswerSelect', () => {
    it('removes response from possibleResponses on answer select', () => {
      const instance = createInstance();
      instance.handleOnAnswerSelect({ value: 'firstImage', id: '0' }, 0);
      expect(instance.state.possibleResponses).toEqual([{ value: 'secondImage', id: '1' }]);
    });

    it('adds response back to possibleResponses on answer remove', () => {
      const instance = createInstance();
      instance.handleOnAnswerSelect({ value: 'firstImage', id: '0' }, 0);
      instance.handleOnAnswerRemove({ value: 'firstImage', id: '0', containerIndex: 0 });
      expect(instance.state.possibleResponses).toEqual([
        { value: 'secondImage', id: '1' },
        { value: 'firstImage', id: '0' },
      ]);
    });

    it('preserves id when adding back to possibleResponses', () => {
      const instance = createInstance();
      instance.handleOnAnswerSelect({ value: 'firstImage', id: '0' }, 0);
      instance.handleOnAnswerRemove({ value: 'firstImage', id: '0', containerIndex: 0 });
      expect(instance.state.possibleResponses[1].id).toBe('0');
    });
  });

  describe('selection state', () => {
    it('mirrors an active drag into selectedResponse on drag start', () => {
      const instance = createInstance();
      const data = { id: '3', value: 'X', containerIndex: 1 };

      instance.onDragStart({ active: { data: { current: data } } });

      expect(instance.state.selectedResponse).toEqual(data);
    });

    it('toggleResponseSelection selects, then deselects the same response', () => {
      const instance = createInstance();
      const data = { id: '3', value: 'X', containerIndex: undefined };

      instance.toggleResponseSelection(data);
      expect(instance.state.selectedResponse).toEqual(data);

      instance.toggleResponseSelection(data);
      expect(instance.state.selectedResponse).toBeNull();
    });

    it('toggleResponseSelection switches selection to a different response', () => {
      const instance = createInstance();
      const first = { id: '3', value: 'X', containerIndex: undefined };
      const second = { id: '4', value: 'Y', containerIndex: undefined };

      instance.toggleResponseSelection(first);
      instance.toggleResponseSelection(second);

      expect(instance.state.selectedResponse).toEqual(second);
    });

    it('placeSelectedResponse places the selection into a container via handleOnAnswerSelect', () => {
      const instance = createInstance();
      const data = { id: '0', value: 'firstImage', containerIndex: undefined };

      instance.toggleResponseSelection(data);
      instance.placeSelectedResponse(1);

      expect(instance.state.answers).toEqual([{ id: '0', value: 'firstImage', containerIndex: 1 }]);
      expect(instance.state.selectedResponse).toBeNull();
    });

    it('placeSelectedResponse with containerIndex undefined removes the placed response (returns it to the pool)', () => {
      const instance = createInstance();
      instance.handleOnAnswerSelect({ value: 'firstImage', id: '0' }, 0);

      instance.toggleResponseSelection({ id: '0', value: 'firstImage', containerIndex: 0 });
      instance.placeSelectedResponse(undefined);

      expect(instance.state.answers).toEqual([]);
      expect(instance.state.possibleResponses).toEqual([
        { value: 'secondImage', id: '1' },
        { value: 'firstImage', id: '0' },
      ]);
    });

    it('placeSelectedResponse does nothing when nothing is selected', () => {
      const instance = createInstance();

      instance.placeSelectedResponse(1);

      expect(instance.state.answers).toEqual([]);
    });

    it('placeSelectedResponse(undefined) is a no-op when the selection is already a pool item, even if its id collides with an unrelated placed answer (C1)', () => {
      // Pool items are indexed 0..n-1 over possibleResponses, and placed answers are
      // re-indexed 0..n-1 independently over the session's initial answers — so a pool
      // item's id can coincide with an unrelated placed answer's id purely from the
      // initial model/session, with no further user action required.
      const instance = createInstance({ session: { answers: [{ value: 'thirdImage', containerIndex: 1 }] } });

      const unrelatedPlacedAnswer = { value: 'thirdImage', containerIndex: 1, id: '0' };
      expect(instance.state.answers).toEqual([unrelatedPlacedAnswer]);

      // 'firstImage' is a pool item whose id ('0') collides with the unrelated placed
      // answer's id above, but it is NOT currently placed anywhere
      // (containerIndex undefined).
      const poolItem = { value: 'firstImage', id: '0' };
      instance.toggleResponseSelection(poolItem);

      instance.placeSelectedResponse(undefined);

      // The unrelated placed answer must survive untouched...
      expect(instance.state.answers).toEqual([unrelatedPlacedAnswer]);
      // ...and nothing should have been incorrectly pushed into possibleResponses either.
      expect(instance.state.possibleResponses).toEqual([
        { value: 'firstImage', id: '0' },
        { value: 'secondImage', id: '1' },
      ]);
      expect(instance.state.selectedResponse).toBeNull();
    });

    it('onDragEnd dropping a pool item back onto the pool ("ica-board") is a no-op, even if its id collides with an unrelated placed answer (C1, drag path)', () => {
      // Same hazard as the click-path C1 test above, but reached via a real
      // pointer/keyboard drag ending on the pool ('ica-board') instead of a click:
      // pool tiles are draggable too, and 'ica-board' is a valid Tab/Shift+Tab
      // keyboard-navigable drop target, so draggedItem can be a pool item
      // (containerIndex undefined) rather than a placed answer being moved back.
      const instance = createInstance({ session: { answers: [{ value: 'thirdImage', containerIndex: 1 }] } });

      const unrelatedPlacedAnswer = { value: 'thirdImage', containerIndex: 1, id: '0' };
      expect(instance.state.answers).toEqual([unrelatedPlacedAnswer]);

      // 'firstImage' is a pool item whose id ('0') collides with the unrelated placed
      // answer's id above, but it is NOT currently placed anywhere.
      const poolItem = { id: '0', value: 'firstImage', containerIndex: undefined };

      instance.onDragEnd({ active: { data: { current: poolItem } }, over: { id: 'ica-board' } });

      // The unrelated placed answer must survive untouched.
      expect(instance.state.answers).toEqual([unrelatedPlacedAnswer]);
    });

    it('onResponseClick and onPlacementClick are ignored for a short window right after a drag ends', () => {
      const instance = createInstance();
      const data = { id: '0', value: 'firstImage', containerIndex: undefined };

      instance.onDragEnd({ active: null, over: null });
      instance.onResponseClick(data);

      expect(instance.state.selectedResponse).toBeNull();
    });

    it('onPlacementClick is ignored for a short window right after a drag ends, even with an active selection', () => {
      const instance = createInstance();
      const data = { id: '0', value: 'firstImage', containerIndex: undefined };

      instance.toggleResponseSelection(data);
      instance.lastDragEndAt = Date.now(); // simulate the guard window without clearing selectedResponse

      instance.onPlacementClick(1);

      expect(instance.state.answers).toEqual([]);
      expect(instance.state.selectedResponse).toEqual(data); // still selected — the call was ignored, not processed
    });

    it('endAnyLiveKeyboardDrag does not dispatch a document Escape keydown when no drag is live (I4)', () => {
      const instance = createInstance();
      const dispatchSpy = jest.spyOn(document, 'dispatchEvent');

      // No onDragStart call happened, so draggingElement.id is falsy.
      instance.endAnyLiveKeyboardDrag();

      expect(dispatchSpy).not.toHaveBeenCalled();
      dispatchSpy.mockRestore();
    });

    it('endAnyLiveKeyboardDrag dispatches a document Escape keydown when a drag is live (I4)', () => {
      const instance = createInstance();
      const dispatchSpy = jest.spyOn(document, 'dispatchEvent');

      instance.onDragStart({ active: { data: { current: { id: '3', value: 'X', containerIndex: undefined } } } });
      instance.endAnyLiveKeyboardDrag();

      expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: 'keydown', code: 'Escape' }));
      dispatchSpy.mockRestore();
    });

    it('onResponseClick ends a still-live keyboard drag before applying the click selection, so the new selection sticks (I1)', () => {
      const instance = createInstance();
      const tileA = { id: '3', value: 'A', containerIndex: undefined };
      const tileB = { id: '4', value: 'B', containerIndex: undefined };

      // Pick up tile A via keyboard: starts a real dnd-kit drag and mirrors it into
      // selectedResponse.
      instance.onDragStart({ active: { data: { current: tileA } } });
      expect(instance.state.selectedResponse).toEqual(tileA);
      expect(instance.state.draggingElement).toEqual(tileA);

      // Now click tile B with the mouse. Real dnd-kit's own document Escape listener
      // would react to the synthetic Escape dispatched by endAnyLiveKeyboardDrag and
      // cancel the drag (calling onDragCancel) — simulate that here the same way,
      // since @dnd-kit/core itself is mocked out of this test file.
      const originalDispatch = document.dispatchEvent.bind(document);
      const dispatchSpy = jest.spyOn(document, 'dispatchEvent').mockImplementation((event) => {
        if (event.code === 'Escape') {
          instance.onDragCancel();
        }

        return originalDispatch(event);
      });

      instance.onResponseClick(tileB);

      expect(dispatchSpy).toHaveBeenCalled();
      expect(instance.state.draggingElement).toEqual({ id: '', value: '' });
      // B's selection must be the one that sticks, not wiped out by ending A's drag.
      expect(instance.state.selectedResponse).toEqual(tileB);

      dispatchSpy.mockRestore();
    });

  });

  describe('DragProvider wiring', () => {
    it('passes the Tab/Shift+Tab coordinate getter and keyboard codes to DragProvider', () => {
      mkWrapper();

      expect(capturedDragProviderProps.keyboardCoordinateGetter).toBe(closestDroppableKeyboardCoordinates);
      expect(capturedDragProviderProps.keyboardCodes).toEqual({
        start: ['Space', 'Enter'],
        cancel: ['Escape'],
        end: ['Space', 'Enter'],
      });
    });

    it('passes onDragCancel to DragProvider (forward-compatible with the pie-lib fix once bumped)', () => {
      mkWrapper();

      expect(typeof capturedDragProviderProps.onDragCancel).toBe('function');
    });
  });

  describe('full component tree (I5)', () => {
    // Only @dnd-kit/core and @pie-lib/drag are mocked in this file — everything else,
    // including image-container.jsx and image-drop-target.jsx, renders for real. This
    // proves the whole click-to-select/click-to-place prop chain works end to end,
    // rather than each component's own test mocking its immediate child.
    it('clicking a real pool tile then a real response container places the answer, exercising the full prop chain', () => {
      updateAnswer.mockClear();

      const { getByText, container } = mkWrapper();

      // Click a real pool tile (rendered by possible-responses.jsx -> possible-response.jsx).
      const poolTile = getByText('firstImage');
      fireEvent.click(poolTile);

      // Both response containers (rendered by image-container.jsx -> image-drop-target.jsx)
      // are still empty at this point, so both are native tab stops with role="button" —
      // this is the only role="button" element in the tree (pool tiles don't set one).
      const dropTargets = container.querySelectorAll('[role="button"]');
      expect(dropTargets.length).toBe(2);

      // Click the first response container to place the selected pool tile into it.
      fireEvent.click(dropTargets[0]);

      expect(updateAnswer).toHaveBeenCalledWith([{ value: 'firstImage', id: '0', containerIndex: 0 }]);
    });
  });

});
