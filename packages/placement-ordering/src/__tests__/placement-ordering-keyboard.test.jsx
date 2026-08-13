import { render } from '@testing-library/react';
import React from 'react';
import { PlacementOrdering } from '../placement-ordering';
import { closestDroppableKeyboardCoordinates } from '../keyboard-coordinates';

jest.mock('../ordering', () => ({
  buildState: jest.fn().mockReturnValue({ tiles: [], choices: [], response: [] }),
  reducer: jest.fn().mockReturnValue({ tiles: [], choices: [], response: [] }),
}));

const mockDragProvider = jest.fn((props) => <div>{props.children}</div>);

jest.mock('@pie-lib/drag', () => ({
  DragProvider: (props) => mockDragProvider(props),
}));

describe('PlacementOrdering keyboard placement wiring', () => {
  const choices = [{ id: 'c1', label: 'C1' }, { id: 'c2', label: 'C2' }];

  const renderWithConfig = (config) => {
    mockDragProvider.mockClear();

    render(
      <PlacementOrdering
        model={{ config, choices }}
        session={{ value: [] }}
        onSessionChange={jest.fn()}
      />,
    );

    // React (in dev builds) calls a brand-new function component type an extra time,
    // with no arguments, the very first time that type is ever rendered in the process
    // (to capture a stack-trace frame for warnings) — harmless, but it means the *last*
    // recorded call isn't reliably the real one. Use the last call that actually
    // received props instead.
    const callsWithProps = mockDragProvider.mock.calls.filter((call) => call[0] !== undefined);

    return callsWithProps[callsWithProps.length - 1][0];
  };

  // "placementArea" is normalized by the controller into model.config.includeTargets
  // before it reaches this component, so gating on includeTargets here is equivalent
  // to gating on placementArea.
  describe('when placementArea is true (includeTargets: true)', () => {
    it('passes the Tab-based coordinateGetter to DragProvider', () => {
      const props = renderWithConfig({ includeTargets: true, orientation: 'vertical' });

      expect(props.keyboardCoordinateGetter).toBe(closestDroppableKeyboardCoordinates);
    });

    it('configures keyboardCodes so Tab no longer ends the drag, while Space/Enter/Escape are preserved', () => {
      const props = renderWithConfig({ includeTargets: true, orientation: 'vertical' });

      expect(props.keyboardCodes).toEqual({
        start: ['Space', 'Enter'],
        cancel: ['Escape'],
        end: ['Space', 'Enter'],
      });
      expect(props.keyboardCodes.end).not.toContain('Tab');
    });

    it('passes screen reader instructions describing Tab/Shift+Tab placement', () => {
      const props = renderWithConfig({ includeTargets: true, orientation: 'vertical' });

      expect(props.accessibility.screenReaderInstructions.draggable).toEqual(
        'Press Space or Enter to pick up this answer choice. Once picked up, use Tab or Shift+Tab to cycle through response areas, or use arrow keys to move it freely. Press Space or Enter to drop, or Escape to cancel.',
      );
    });
  });

  describe('when placementArea is false (includeTargets: false)', () => {
    it('does not pass a custom keyboardCoordinateGetter', () => {
      const props = renderWithConfig({ includeTargets: false, orientation: 'vertical' });

      expect(props.keyboardCoordinateGetter).toBeUndefined();
    });

    it('does not pass custom keyboardCodes, leaving dnd-kit defaults (including Tab-ends-drag) untouched', () => {
      const props = renderWithConfig({ includeTargets: false, orientation: 'vertical' });

      expect(props.keyboardCodes).toBeUndefined();
    });

    it('does not pass accessibility instructions describing Tab-based placement', () => {
      const props = renderWithConfig({ includeTargets: false, orientation: 'vertical' });

      expect(props.accessibility).toBeUndefined();
    });
  });

  describe('when placementArea is missing entirely', () => {
    it('does not pass a custom keyboardCoordinateGetter or keyboardCodes', () => {
      const props = renderWithConfig({ orientation: 'vertical' });

      expect(props.keyboardCoordinateGetter).toBeUndefined();
      expect(props.keyboardCodes).toBeUndefined();
    });
  });

  describe('existing behavior preserved regardless of placementArea', () => {
    it('still passes onDragEnd and collisionDetection to DragProvider', () => {
      const props = renderWithConfig({ includeTargets: true, orientation: 'vertical' });

      expect(typeof props.onDragEnd).toBe('function');
      expect(typeof props.collisionDetection).toBe('function');
    });
  });
});
