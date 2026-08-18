import { render } from '@testing-library/react';
import React from 'react';
import { PlacementOrdering } from '../placement-ordering';

jest.mock('../ordering', () => ({
  buildState: jest.fn().mockReturnValue({ tiles: [], choices: [], response: [] }),
  reducer: jest.fn().mockReturnValue({ tiles: [], choices: [], response: [] }),
}));

const mockTiler = jest.fn(() => null);

jest.mock('../tiler', () => ({
  HorizontalTiler: (props) => mockTiler(props),
  VerticalTiler: (props) => mockTiler(props),
}));

describe('PlacementOrdering click-to-select/click-to-place wiring to the tiler', () => {
  const choices = [
    { id: 'c1', label: 'C1' },
    { id: 'c2', label: 'C2' },
  ];

  const renderWithConfig = (config) => {
    mockTiler.mockClear();

    render(<PlacementOrdering model={{ config, choices }} session={{ value: [] }} onSessionChange={jest.fn()} />);

    // React (in dev builds) calls a brand-new function component type an extra time,
    // with no arguments, the very first time that type is ever rendered in the process
    // (to capture a stack-trace frame for warnings) — harmless, but it means the *last*
    // recorded call isn't reliably the real one. Use the last call that actually
    // received props instead.
    const callsWithProps = mockTiler.mock.calls.filter((call) => call[0] !== undefined);

    return callsWithProps[callsWithProps.length - 1][0];
  };

  describe('when placementArea is true (includeTargets: true)', () => {
    it('passes selectedChoice, onChoiceClick, and onPlacementClick to the tiler', () => {
      const props = renderWithConfig({ includeTargets: true, orientation: 'vertical' });

      expect(props.selectedChoice).toBeNull();
      expect(typeof props.onChoiceClick).toBe('function');
      expect(typeof props.onPlacementClick).toBe('function');
    });
  });

  describe('when placementArea is false (includeTargets: false)', () => {
    it('does not pass selectedChoice, onChoiceClick, or onPlacementClick to the tiler', () => {
      const props = renderWithConfig({ includeTargets: false, orientation: 'vertical' });

      expect(props.selectedChoice).toBeUndefined();
      expect(props.onChoiceClick).toBeUndefined();
      expect(props.onPlacementClick).toBeUndefined();
    });
  });

  describe('when placementArea is missing entirely', () => {
    it('does not pass selectedChoice, onChoiceClick, or onPlacementClick to the tiler', () => {
      const props = renderWithConfig({ orientation: 'vertical' });

      expect(props.selectedChoice).toBeUndefined();
      expect(props.onChoiceClick).toBeUndefined();
      expect(props.onPlacementClick).toBeUndefined();
    });
  });
});
