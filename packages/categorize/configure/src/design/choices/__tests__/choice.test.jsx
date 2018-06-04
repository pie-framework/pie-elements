import { shallow } from 'enzyme';
import React from 'react';
import { Choice, spec } from '../choice';

describe('choice', () => {
  let onChange;
  let onDelete;
  let connectDragSource;
  let connectDragPreview;

  beforeEach(() => {
    onChange = jest.fn();
    onDelete = jest.fn();
    connectDragSource = jest.fn();
    connectDragPreview = jest.fn();
  });

  const wrapper = extras => {
    const props = {
      classes: {},
      correctResponseCount: 0,
      className: 'classname',
      choice: {
        content: 'hi',
        id: '1'
      },
      onChange,
      onDelete,
      connectDragSource,
      connectDragPreview,
      ...extras
    };

    return shallow(<Choice {...props} />);
  };
  describe('snapshot', () => {
    it('renders', () => {
      const w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    describe('changeContent', () => {
      it('calls onChange', () => {
        const w = wrapper();
        w.instance().changeContent('foo');
        expect(onChange).toBeCalledWith({ content: 'foo', id: '1' });
      });
    });
    describe('changeCategoryCount', () => {
      it('calls onChange', () => {
        const w = wrapper();
        w.instance().changeCategoryCount(1);
        expect(onChange).toBeCalledWith({
          content: 'hi',
          id: '1',
          categoryCount: 1
        });
      });
    });
  });
});

describe('spec', () => {
  describe('canDrag', () => {
    it('returns true for categoryCount 0 and correctResponseCount: 100', () => {
      const result = spec.canDrag({
        choice: { categoryCount: 0 },
        correctResponseCount: 100
      });
      expect(result).toEqual(true);
    });

    it('returns true for categoryCount 1 and correctResponseCount: 0', () => {
      const result = spec.canDrag({
        choice: { categoryCount: 1 },
        correctResponseCount: 0
      });
      expect(result).toEqual(true);
    });

    it('returns false for categoryCount 1 and correctResponseCount: 1', () => {
      const result = spec.canDrag({
        choice: { categoryCount: 1 },
        correctResponseCount: 1
      });
      expect(result).toEqual(false);
    });
  });

  describe('beginDrag', () => {
    it('returns the id', () => {
      const result = spec.beginDrag({ choice: { id: '1' } });
      expect(result).toEqual({ id: '1' });
    });
  });

  describe('endDrag', () => {
    let monitor;
    let item;
    beforeEach(() => {
      item = {
        categoryId: '2'
      };
      monitor = {
        didDrop: jest.fn().mockReturnValue(false),
        getItem: jest.fn().mockReturnValue(item)
      };
    });

    it('calls onRemoveChoice if !didDrop is false and categoryId is defined', () => {
      const props = {
        onRemoveChoice: jest.fn()
      };
      spec.endDrag(props, monitor);
      expect(props.onRemoveChoice).toBeCalledWith(item);
    });
  });
});
