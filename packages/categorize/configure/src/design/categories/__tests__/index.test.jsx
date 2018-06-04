import { shallow } from 'enzyme';
import React from 'react';

import { Categories } from '../index';

describe('Categories', () => {
  let w;
  let onChange = jest.fn();
  let onDeleteChoice = jest.fn();
  let onAddChoice = jest.fn();
  let onAdd = jest.fn();
  let onDelete = jest.fn();
  let onColumnsChange = jest.fn();

  const wrapper = extras => {
    const defaults = {
      classes: {
        categories: 'categories',
        categoriesHolder: 'categoriesHolder',
        row: 'row'
      },
      columns: 2,
      onColumnsChange,
      categories: [{ id: '1', label: 'foo', choices: [] }],
      onDelete,
      onDeleteChoice,
      onAddChoice,
      onAdd,
      className: 'className',
      onChange
    };

    const props = { ...defaults, ...extras };
    return shallow(<Categories {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });
  describe('logic', () => {
    describe('changeCategory', () => {
      it('calls onChange', () => {
        w = wrapper();
        const update = { id: '1', label: 'update', choices: [] };
        w.instance().changeCategory(update);
        expect(onChange).toBeCalledWith([update]);
      });
    });
  });
});
