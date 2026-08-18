import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Tile from '../tile';

describe('Tile click-to-select / click-to-place', () => {
  const baseChoiceProps = {
    id: 'c1',
    label: 'Choice 1',
    type: 'choice',
    empty: false,
    draggable: true,
    disabled: false,
    index: undefined,
    instanceId: 'inst',
    tileIndex: 0,
  };

  const baseTargetProps = {
    id: 'c1',
    label: 'Choice 1',
    type: 'target',
    empty: false,
    draggable: true,
    disabled: false,
    index: 2,
    instanceId: 'inst',
    tileIndex: 2,
  };

  const emptyTargetProps = {
    id: undefined,
    label: '',
    type: 'target',
    empty: true,
    draggable: false,
    disabled: false,
    index: 2,
    instanceId: 'inst',
    tileIndex: 2,
  };

  const selectedChoice = { id: 'c1', type: 'choice', instanceId: 'inst', value: 'Choice 1', index: undefined };
  const selectedTarget = { id: 'c9', type: 'target', instanceId: 'inst', value: 'Choice 9', index: 0 };

  describe('choice tiles', () => {
    it('selects the choice on click when nothing is selected', () => {
      const onChoiceClick = jest.fn();
      const onPlacementClick = jest.fn();
      const { container } = render(
        <Tile {...baseChoiceProps} onChoiceClick={onChoiceClick} onPlacementClick={onPlacementClick} />,
      );

      fireEvent.click(container.firstChild);

      expect(onChoiceClick).toHaveBeenCalledWith({ id: 'c1', type: 'choice', instanceId: 'inst', value: 'Choice 1', index: undefined });
      expect(onPlacementClick).not.toHaveBeenCalled();
    });

    it('selects/switches on click even when a different choice is already selected', () => {
      const onChoiceClick = jest.fn();
      const onPlacementClick = jest.fn();
      const { container } = render(
        <Tile
          {...baseChoiceProps}
          selectedChoice={selectedChoice}
          onChoiceClick={onChoiceClick}
          onPlacementClick={onPlacementClick}
        />,
      );

      fireEvent.click(container.firstChild);

      expect(onChoiceClick).toHaveBeenCalled();
      expect(onPlacementClick).not.toHaveBeenCalled();
    });

    it('returns a selected placed answer (a "target") to the choices column/row on click', () => {
      const onChoiceClick = jest.fn();
      const onPlacementClick = jest.fn();
      const { container } = render(
        <Tile
          {...baseChoiceProps}
          selectedChoice={selectedTarget}
          onChoiceClick={onChoiceClick}
          onPlacementClick={onPlacementClick}
        />,
      );

      fireEvent.click(container.firstChild);

      expect(onPlacementClick).toHaveBeenCalledWith({ id: 'c1', type: 'choice', instanceId: 'inst', value: 'Choice 1', index: undefined });
      expect(onChoiceClick).not.toHaveBeenCalled();
    });

    it('does nothing when disabled', () => {
      const onChoiceClick = jest.fn();
      const { container } = render(<Tile {...baseChoiceProps} disabled onChoiceClick={onChoiceClick} />);

      fireEvent.click(container.firstChild);

      expect(onChoiceClick).not.toHaveBeenCalled();
    });
  });

  describe('target (placement area) tiles', () => {
    it('places the selected choice when clicked and something is selected (occupied target)', () => {
      const onPlacementClick = jest.fn();
      const { container } = render(
        <Tile {...baseTargetProps} selectedChoice={selectedChoice} onPlacementClick={onPlacementClick} />,
      );

      fireEvent.click(container.firstChild);

      expect(onPlacementClick).toHaveBeenCalledWith({ id: 'c1', type: 'target', instanceId: 'inst', value: 'Choice 1', index: 2 });
    });

    it('places the selected choice into an empty target', () => {
      const onPlacementClick = jest.fn();
      const { container } = render(
        <Tile {...emptyTargetProps} selectedChoice={selectedChoice} onPlacementClick={onPlacementClick} />,
      );

      fireEvent.click(container.firstChild);

      expect(onPlacementClick).toHaveBeenCalledWith({
        id: undefined,
        type: 'target',
        instanceId: 'inst',
        value: '',
        index: 2,
      });
    });

    it('selects the placed answer when clicked and nothing is selected (filled target)', () => {
      const onChoiceClick = jest.fn();
      const onPlacementClick = jest.fn();
      const { container } = render(
        <Tile {...baseTargetProps} onChoiceClick={onChoiceClick} onPlacementClick={onPlacementClick} />,
      );

      fireEvent.click(container.firstChild);

      expect(onChoiceClick).toHaveBeenCalledWith({ id: 'c1', type: 'target', instanceId: 'inst', value: 'Choice 1', index: 2 });
      expect(onPlacementClick).not.toHaveBeenCalled();
    });

    it('deselects the placed answer when clicked again while it is the selected one', () => {
      const onChoiceClick = jest.fn();
      const onPlacementClick = jest.fn();
      const selectedThisTarget = { id: 'c1', type: 'target', instanceId: 'inst', value: 'Choice 1', index: 2 };
      const { container } = render(
        <Tile
          {...baseTargetProps}
          selectedChoice={selectedThisTarget}
          onChoiceClick={onChoiceClick}
          onPlacementClick={onPlacementClick}
        />,
      );

      fireEvent.click(container.firstChild);

      expect(onChoiceClick).toHaveBeenCalledWith(selectedThisTarget);
      expect(onPlacementClick).not.toHaveBeenCalled();
    });

    it('places a different selected item here (swap) when clicked and this target is not the selected one', () => {
      const onChoiceClick = jest.fn();
      const onPlacementClick = jest.fn();
      const { container } = render(
        <Tile
          {...baseTargetProps}
          selectedChoice={selectedTarget}
          onChoiceClick={onChoiceClick}
          onPlacementClick={onPlacementClick}
        />,
      );

      fireEvent.click(container.firstChild);

      expect(onPlacementClick).toHaveBeenCalledWith({ id: 'c1', type: 'target', instanceId: 'inst', value: 'Choice 1', index: 2 });
      expect(onChoiceClick).not.toHaveBeenCalled();
    });

    it('does nothing when clicked empty and nothing is selected', () => {
      const onPlacementClick = jest.fn();
      const { container } = render(<Tile {...emptyTargetProps} onPlacementClick={onPlacementClick} />);

      fireEvent.click(container.firstChild);

      expect(onPlacementClick).not.toHaveBeenCalled();
    });

    it('does nothing when disabled, even with something selected', () => {
      const onPlacementClick = jest.fn();
      const { container } = render(
        <Tile {...emptyTargetProps} disabled selectedChoice={selectedChoice} onPlacementClick={onPlacementClick} />,
      );

      fireEvent.click(container.firstChild);

      expect(onPlacementClick).not.toHaveBeenCalled();
    });
  });

  describe('native Tab stop for non-draggable (empty) tiles', () => {
    it('is a native Tab stop when empty and not disabled', () => {
      const { container } = render(<Tile {...emptyTargetProps} />);

      expect(container.firstChild).toHaveAttribute('tabIndex', '0');
      expect(container.firstChild).toHaveAttribute('role', 'button');
    });

    it('is not a native Tab stop when disabled', () => {
      const { container } = render(<Tile {...emptyTargetProps} disabled />);

      expect(container.firstChild).not.toHaveAttribute('tabIndex');
    });

    it('is not an additional native Tab stop when draggable (dnd-kit already grants focus)', () => {
      const { container } = render(<Tile {...baseChoiceProps} />);

      expect(container.firstChild).not.toHaveAttribute('tabIndex');
    });

    it('places the selected choice on Enter', () => {
      const onPlacementClick = jest.fn();
      const { container } = render(
        <Tile {...emptyTargetProps} selectedChoice={selectedChoice} onPlacementClick={onPlacementClick} />,
      );

      fireEvent.keyDown(container.firstChild, { code: 'Enter' });

      expect(onPlacementClick).toHaveBeenCalled();
    });

    it('places the selected choice on Space', () => {
      const onPlacementClick = jest.fn();
      const { container } = render(
        <Tile {...emptyTargetProps} selectedChoice={selectedChoice} onPlacementClick={onPlacementClick} />,
      );

      fireEvent.keyDown(container.firstChild, { code: 'Space' });

      expect(onPlacementClick).toHaveBeenCalled();
    });
  });

  describe('isSelected', () => {
    it('does not throw and still fires the click callback when this exact tile is the selected one', () => {
      const onChoiceClick = jest.fn();
      const { container } = render(
        <Tile {...baseChoiceProps} selectedChoice={selectedChoice} onChoiceClick={onChoiceClick} />,
      );

      fireEvent.click(container.firstChild);

      expect(onChoiceClick).toHaveBeenCalledWith(selectedChoice);
    });
  });

  describe('hover effect on response areas while a choice is selected', () => {
    it('sets the cursor to pointer on a target while something is selected', () => {
      const { container } = render(<Tile {...baseTargetProps} selectedChoice={selectedChoice} />);

      expect(container.firstChild).toHaveStyle({ cursor: 'pointer' });
    });

    it('does not change the cursor on a target when nothing is selected', () => {
      const { container } = render(<Tile {...baseTargetProps} />);

      expect(container.firstChild).not.toHaveStyle({ cursor: 'pointer' });
    });

    it('sets the cursor to pointer on an empty target while something is selected', () => {
      const { container } = render(<Tile {...emptyTargetProps} selectedChoice={selectedChoice} />);

      expect(container.firstChild).toHaveStyle({ cursor: 'pointer' });
    });

    it('does not change the cursor on a choice tile even when a target is selected', () => {
      const { container } = render(<Tile {...baseChoiceProps} selectedChoice={selectedTarget} />);

      expect(container.firstChild).not.toHaveStyle({ cursor: 'pointer' });
    });

    it('applies the same visual treatment as a real drag-hover when hovering an occupied target while something is selected', () => {
      const { container } = render(<Tile {...baseTargetProps} selectedChoice={selectedChoice} />);
      const content = container.firstChild.firstChild;
      const classBeforeHover = content.className;

      fireEvent.mouseEnter(container.firstChild);
      expect(content.className).not.toBe(classBeforeHover);

      fireEvent.mouseLeave(container.firstChild);
      expect(content.className).toBe(classBeforeHover);
    });

    it('does not apply the hover treatment to a target when nothing is selected', () => {
      const { container } = render(<Tile {...baseTargetProps} />);
      const content = container.firstChild.firstChild;
      const classBeforeHover = content.className;

      fireEvent.mouseEnter(container.firstChild);
      expect(content.className).toBe(classBeforeHover);
    });

    it('does not apply the hover treatment to a target while disabled, even with something selected', () => {
      const { container } = render(<Tile {...baseTargetProps} disabled selectedChoice={selectedChoice} />);
      const content = container.firstChild.firstChild;
      const classBeforeHover = content.className;

      fireEvent.mouseEnter(container.firstChild);
      expect(content.className).toBe(classBeforeHover);
    });

    it('does not apply the hover treatment to a choice tile even when a target is selected', () => {
      const { container } = render(<Tile {...baseChoiceProps} selectedChoice={selectedTarget} />);
      const content = container.firstChild.firstChild;
      const classBeforeHover = content.className;

      fireEvent.mouseEnter(container.firstChild);
      expect(content.className).toBe(classBeforeHover);
    });
  });
});
