import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import PossibleResponses from '../possible-responses';

jest.mock('@pie-lib/drag', () => ({
  ICADroppablePlaceholder: ({ children }) => <div data-testid="ica-board">{children}</div>,
}));

jest.mock('../possible-response', () => (props) => (
  <div data-testid={`possible-response-${props.data.id}`} onClick={(e) => { e.stopPropagation(); props.onSelectClick?.(props.data); }}>
    {props.data.value}
  </div>
));

describe('PossibleResponses', () => {
  const baseProps = {
    canDrag: true,
    data: [{ id: '0', value: 'Choice A' }],
    onDragBegin: jest.fn(),
  };

  it('places the selection into the pool when clicking the pool background', () => {
    const onPlacementClick = jest.fn();
    const { container } = render(
      <PossibleResponses
        {...baseProps}
        selectedResponse={{ id: '9', containerIndex: 1 }}
        onPlacementClick={onPlacementClick}
      />,
    );

    fireEvent.click(container.firstChild);

    expect(onPlacementClick).toHaveBeenCalledWith(undefined);
  });

  it('does nothing when clicking the pool background with nothing selected', () => {
    const onPlacementClick = jest.fn();
    const { container } = render(<PossibleResponses {...baseProps} onPlacementClick={onPlacementClick} />);

    fireEvent.click(container.firstChild);

    expect(onPlacementClick).not.toHaveBeenCalled();
  });

  it('clicking a specific pool item selects it, not the pool background handler', () => {
    const onPlacementClick = jest.fn();
    const onSelectClick = jest.fn();
    const { getByTestId } = render(
      <PossibleResponses
        {...baseProps}
        selectedResponse={{ id: '9', containerIndex: 1 }}
        onSelectClick={onSelectClick}
        onPlacementClick={onPlacementClick}
      />,
    );

    fireEvent.click(getByTestId('possible-response-0'));

    expect(onSelectClick).toHaveBeenCalledWith(baseProps.data[0]);
    expect(onPlacementClick).not.toHaveBeenCalled();
  });
});
