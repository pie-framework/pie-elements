import { shallow } from 'enzyme';
import React from 'react';

import { spec, DroppablePlaceholder } from '../droppable-placeholder';

describe('spec', () => {
  describe('drop', () => {
    let props;
    let monitor;
    let item;

    beforeEach(() => {
      props = {
        onDropChoice: jest.fn()
      };
      item = {
        id: '1'
      };
      monitor = {
        getItem: jest.fn().mockReturnValue(item)
      };
    });

    it('calls onDropChoice', () => {
      spec.drop(props, monitor);
      expect(props.onDropChoice).toBeCalledWith(item);
    });
  });

  describe('canDrop', () => {
    it('returns true when not disabled', () => {
      expect(spec.canDrop({ disabled: false })).toEqual(true);
    });
    it('returns false when disabled', () => {
      expect(spec.canDrop({ disabled: true })).toEqual(false);
    });
  });
});

describe('droppable-placeholder', () => {
  const wrapper = extras => {
    const defaults = {
      classes: {},
      connectDropTarget: jest.fn(n => n)
    };
    const props = { ...defaults, ...extras };
    return shallow(
      <DroppablePlaceholder {...props}>content</DroppablePlaceholder>
    );
  };

  describe('snapshot', () => {
    it('renders', () => {
      expect(wrapper()).toMatchSnapshot();
    });
    it('className', () => {
      expect(wrapper({ className: 'foo' })).toMatchSnapshot();
    });
    it('disabled', () => {
      expect(wrapper({ disabled: true })).toMatchSnapshot();
    });
    it('grid', () => {
      expect(wrapper({ grid: { columns: 2 } })).toMatchSnapshot();
    });
  });
});
