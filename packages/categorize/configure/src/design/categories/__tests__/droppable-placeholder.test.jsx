import { shallow } from 'enzyme';
import React from 'react';

import { DroppablePlaceHolder, spec } from '../droppable-placeholder';

describe('DroppablePlaceholder', () => {
  let w;
  let connectDropTarget = jest.fn(o => o);
  let onDropChoice = jest.fn();
  let onDeleteChoice = jest.fn();
  const wrapper = extras => {
    const defaults = {
      classes: {},
      className: 'className',
      onDeleteChoice,
      onDropChoice,
      connectDropTarget,
      categoryId: '1',
      choices: [{ id: '1', content: 'content' }]
    };
    const props = {
      ...defaults,
      ...extras
    };
    return shallow(<DroppablePlaceHolder {...props} />);
  };
  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });

    it('renders helper', () => {
      w = wrapper({ choices: [] });
      expect(w).toMatchSnapshot();
    });
  });
});

describe('spec', () => {
  describe('drop', () => {
    it('calls onDropChoice', () => {
      const props = {
        onDropChoice: jest.fn(),
        categoryId: '1'
      };

      const item = { id: '2' };
      const monitor = {
        getItem: jest.fn().mockReturnValue(item)
      };
      spec.drop(props, monitor);
      expect(props.onDropChoice).toBeCalledWith(item, props.categoryId);
    });
  });
  describe('canDrop', () => {
    it('returns true if !disabled', () => {
      expect(spec.canDrop({ disabled: false })).toEqual(true);
    });
    it('returns false if disabled', () => {
      expect(spec.canDrop({ disabled: true })).toEqual(false);
    });
  });
});
