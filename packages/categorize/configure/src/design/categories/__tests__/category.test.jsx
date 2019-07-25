import { shallow } from 'enzyme';
import React from 'react';
import { Category } from '../category';

describe('category', () => {
  let w;

  let onChange = jest.fn();
  let onDelete = jest.fn();
  let onDeleteChoice = jest.fn();
  let onAddChoice = jest.fn();

  const wrapper = extras => {
    const defaults = {
      classes: {},
      className: 'className',
      category: {
        id: '1',
        label: 'Category title'
      },
      onChange,
      onDelete,
      onDeleteChoice,
      onAddChoice
    };
    const props = { ...defaults, ...extras };
    return shallow(<Category {...props} />);
  };

  describe('snapshot', () => {

    it('renders with default props', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });

    it('renders without some components if no handlers are provided', () => {
      w = wrapper({
        onChange: undefined,
        onDelete: undefined
      });
      expect(w).toMatchSnapshot();
    });

  });

  describe('logic', () => {
    describe('changeLabel', () => {
      it('calls onChange', () => {
        w = wrapper();
        w.instance().changeLabel('new label');
        expect(onChange).toBeCalledWith({ id: '1', label: 'new label' });
      });
    });
  });
});
