import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import PossibleResponse from '../possible-response';

jest.mock('@dnd-kit/core', () => ({
  useDraggable: () => ({
    setNodeRef: jest.fn(),
    attributes: {},
    listeners: {},
    isDragging: false,
  }),
}));

describe('PossibleResponse', () => {
  const baseProps = {
    canDrag: true,
    data: { id: '0', value: 'Choice A' },
    onDragBegin: jest.fn(),
  };

  it('selects a pool item on click when nothing else is selected', () => {
    const onSelectClick = jest.fn();
    const onPlacementClick = jest.fn();
    const { container } = render(
      <PossibleResponse
        {...baseProps}
        selectedResponse={null}
        onSelectClick={onSelectClick}
        onPlacementClick={onPlacementClick}
      />,
    );

    fireEvent.click(container.firstChild);

    expect(onSelectClick).toHaveBeenCalledWith(baseProps.data);
    expect(onPlacementClick).not.toHaveBeenCalled();
  });

  it('toggles off (calls onSelectClick again) when clicking the already-selected item', () => {
    const onSelectClick = jest.fn();
    const onPlacementClick = jest.fn();
    const { container } = render(
      <PossibleResponse
        {...baseProps}
        selectedResponse={{ id: '0', containerIndex: undefined }}
        onSelectClick={onSelectClick}
        onPlacementClick={onPlacementClick}
      />,
    );

    fireEvent.click(container.firstChild);

    expect(onSelectClick).toHaveBeenCalledWith(baseProps.data);
    expect(onPlacementClick).not.toHaveBeenCalled();
  });

  it('selects a different pool item on click even while something else is selected (pool items are never placement targets)', () => {
    const onSelectClick = jest.fn();
    const onPlacementClick = jest.fn();
    const { container } = render(
      <PossibleResponse
        {...baseProps}
        selectedResponse={{ id: '1', containerIndex: 2 }}
        onSelectClick={onSelectClick}
        onPlacementClick={onPlacementClick}
      />,
    );

    fireEvent.click(container.firstChild);

    expect(onSelectClick).toHaveBeenCalledWith(baseProps.data);
    expect(onPlacementClick).not.toHaveBeenCalled();
  });

  it('places the current selection into this tile\'s container when clicking an already-placed tile that is not the selection', () => {
    const onSelectClick = jest.fn();
    const onPlacementClick = jest.fn();
    const placedData = { id: '5', value: 'Choice B', containerIndex: 3 };
    const { container } = render(
      <PossibleResponse
        {...baseProps}
        data={placedData}
        selectedResponse={{ id: '1', containerIndex: undefined }}
        onSelectClick={onSelectClick}
        onPlacementClick={onPlacementClick}
      />,
    );

    fireEvent.click(container.firstChild);

    expect(onPlacementClick).toHaveBeenCalledWith(3);
    expect(onSelectClick).not.toHaveBeenCalled();
  });

  it('does nothing on click when disabled (canDrag=false)', () => {
    const onSelectClick = jest.fn();
    const onPlacementClick = jest.fn();
    const { container } = render(
      <PossibleResponse
        {...baseProps}
        canDrag={false}
        selectedResponse={null}
        onSelectClick={onSelectClick}
        onPlacementClick={onPlacementClick}
      />,
    );

    fireEvent.click(container.firstChild);

    expect(onSelectClick).not.toHaveBeenCalled();
    expect(onPlacementClick).not.toHaveBeenCalled();
  });
});
