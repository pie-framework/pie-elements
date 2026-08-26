import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ImageDropTarget from '../image-drop-target';

jest.mock('@dnd-kit/core', () => ({
  useDroppable: () => ({
    setNodeRef: jest.fn(),
    isOver: false,
  }),
}));

jest.mock('../possible-response', () => (props) => (
  <div data-testid={`possible-response-${props.data.id}`} onClick={() => props.onSelectClick?.(props.data)}>
    {props.data.value}
  </div>
));

describe('ImageDropTarget', () => {
  const baseProps = {
    answers: [],
    canDrag: true,
    containerStyle: {},
    draggingElement: { id: '' },
    onDragAnswerBegin: jest.fn(),
    onDragAnswerEnd: jest.fn(),
    onDrop: jest.fn(),
    index: 2,
  };

  describe('empty container', () => {
    it('is a native tab stop (role=button, tabIndex=0) when canDrag', () => {
      const { container } = render(<ImageDropTarget {...baseProps} />);
      const target = container.firstChild;

      expect(target.getAttribute('role')).toBe('button');
      expect(target.getAttribute('tabindex')).toBe('0');
    });

    it('is not a tab stop when canDrag is false, and has no role either (I2)', () => {
      const { container } = render(<ImageDropTarget {...baseProps} canDrag={false} />);
      const target = container.firstChild;

      expect(target.getAttribute('tabindex')).toBe('-1');
      expect(target.getAttribute('role')).toBeNull();
    });

    it('places the selection here on click', () => {
      const onPlacementClick = jest.fn();
      const { container } = render(
        <ImageDropTarget
          {...baseProps}
          selectedResponse={{ id: '9', containerIndex: undefined }}
          onPlacementClick={onPlacementClick}
        />,
      );

      fireEvent.click(container.firstChild);

      expect(onPlacementClick).toHaveBeenCalledWith(2);
    });

    it('does nothing on click when nothing is selected', () => {
      const onPlacementClick = jest.fn();
      const { container } = render(<ImageDropTarget {...baseProps} onPlacementClick={onPlacementClick} />);

      fireEvent.click(container.firstChild);

      expect(onPlacementClick).not.toHaveBeenCalled();
    });

    it('places the selection here on Space/Enter', () => {
      const onPlacementClick = jest.fn();
      const { container } = render(
        <ImageDropTarget
          {...baseProps}
          selectedResponse={{ id: '9', containerIndex: undefined }}
          onPlacementClick={onPlacementClick}
        />,
      );

      fireEvent.keyDown(container.firstChild, { code: 'Space' });

      expect(onPlacementClick).toHaveBeenCalledWith(2);
    });
  });

  describe('occupied container', () => {
    const answers = [{ id: '7', value: 'Placed', containerIndex: 2 }];

    it('is not its own tab stop and has no role either — occupied containers must not become unlabeled buttons for screen readers (I2)', () => {
      const { container } = render(<ImageDropTarget {...baseProps} answers={answers} />);
      const target = container.firstChild;

      expect(target.getAttribute('tabindex')).toBe('-1');
      expect(target.getAttribute('role')).toBeNull();
    });

    it('places the selection here when clicking empty background (not a specific tile)', () => {
      const onPlacementClick = jest.fn();
      const { container } = render(
        <ImageDropTarget
          {...baseProps}
          answers={answers}
          selectedResponse={{ id: '9', containerIndex: undefined }}
          onPlacementClick={onPlacementClick}
        />,
      );

      fireEvent.click(container.firstChild);

      expect(onPlacementClick).toHaveBeenCalledWith(2);
    });

    it('forwards selection props to the placed tile, which handles its own click', () => {
      const onSelectClick = jest.fn();
      const { getByTestId } = render(
        <ImageDropTarget {...baseProps} answers={answers} onSelectClick={onSelectClick} />,
      );

      fireEvent.click(getByTestId('possible-response-7'));

      expect(onSelectClick).toHaveBeenCalledWith(answers[0]);
    });
  });

  describe('hover affordance during click-to-select (I3)', () => {
    it('gets the is-over highlight and a pointer cursor on hover when something is selected', () => {
      const { container } = render(
        <ImageDropTarget {...baseProps} selectedResponse={{ id: '9', containerIndex: undefined }} />,
      );
      const target = container.firstChild;

      expect(target.className).not.toMatch(/\bis-over\b/);

      fireEvent.mouseEnter(target);
      expect(target.className).toMatch(/\bis-over\b/);
      expect(target.style.cursor).toBe('pointer');

      fireEvent.mouseLeave(target);
      expect(target.className).not.toMatch(/\bis-over\b/);
    });

    it('does not show the is-over highlight on hover when nothing is selected', () => {
      const { container } = render(<ImageDropTarget {...baseProps} selectedResponse={null} />);
      const target = container.firstChild;

      fireEvent.mouseEnter(target);

      expect(target.className).not.toMatch(/\bis-over\b/);
      expect(target.style.cursor).toBe('');
    });

    it('does not show the is-over highlight on hover when canDrag is false, even with a selection', () => {
      const { container } = render(
        <ImageDropTarget
          {...baseProps}
          canDrag={false}
          selectedResponse={{ id: '9', containerIndex: undefined }}
        />,
      );
      const target = container.firstChild;

      fireEvent.mouseEnter(target);

      expect(target.className).not.toMatch(/\bis-over\b/);
      expect(target.style.cursor).toBe('');
    });
  });
});
