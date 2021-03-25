import { shallow } from 'enzyme';
import React from 'react';
import { Choice, Layout, spec } from '../choice';

describe('layout', () => {
  let connectDragSource;

  beforeEach(() => {
    connectDragSource = jest.fn(n => n);
  });

  const wrapper = extras => {
    const defaults = {
      classes: {},
      content: 'Foo'
    };
    const props = { ...defaults, ...extras };
    return shallow(<Layout {...props} />);
  };

  it('renders', () => {
    expect(wrapper()).toMatchSnapshot();
  });

  it('disabled', () => {
    expect(wrapper({ disabled: true })).toMatchSnapshot();
  });

  it('correct', () => {
    expect(wrapper({ correct: true })).toMatchSnapshot();
  });

  it('isDragging', () => {
    expect(wrapper({ isDragging: true })).toMatchSnapshot();
  });
});

describe('spec', () => {
  describe('canDrag', () => {
    it('returns false, when disabled', () => {
      expect(spec.canDrag({ disabled: true })).toEqual(false);
    });
    it('returns true, when not disabled', () => {
      expect(spec.canDrag({ disabled: false })).toEqual(true);
    });
  });
  describe('beginDrag', () => {
    const id = '1';
    const categoryId = '1';
    const choiceIndex = 0;
    it('returns data', () => {
      expect(spec.beginDrag({ id, categoryId, choiceIndex })).toEqual({
        id,
        categoryId,
        choiceIndex
      });
    });
  });

  describe('endDrag', () => {
    let props;
    let monitor;
    let item;

    beforeEach(() => {
      props = {
        onRemoveChoice: jest.fn()
      };
      item = { id: '1', categoryId: '1' };
      monitor = {
        getItem: jest.fn().mockReturnValue(item),
        didDrop: jest.fn().mockReturnValue(false)
      };
    });

    it('calls onRemoveChoice', () => {
      spec.endDrag(props, monitor);
      expect(props.onRemoveChoice).toBeCalledWith(item);
    });

    it('does not call onRemoveChoice if category id is null', () => {
      item.categoryId = null;
      spec.endDrag(props, monitor);
      expect(props.onRemoveChoice).not.toBeCalledWith(item);
    });

    it('does not call onRemoveChoice monitor.didDrop returns true', () => {
      monitor.didDrop.mockReturnValue(true);
      spec.endDrag(props, monitor);
      expect(props.onRemoveChoice).not.toBeCalledWith(item);
    });
  });
});
