import { shallow } from 'enzyme';
import React from 'react';

import { Categories } from '../index';
import defaultValues from '../../../defaults';

describe('Categories', () => {
  let w;
  let onModelChanged = jest.fn();
  let model = defaultValues.model;

  const wrapper = extras => {
    const defaults = {
      classes: {
        categories: 'categories',
        categoriesHolder: 'categoriesHolder',
        row: 'row'
      },
      categories: [{ id: '1', label: 'foo', choices: [] }],
      className: 'className',
      model,
      onModelChanged
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
    describe('changeCategoryColumns', () => {
      w = wrapper();
      w.instance().changeCategoryColumns({ target: { value: 4 } });

      expect(onModelChanged).toBeCalledWith({ categoriesPerRow: 4 });
    });

    describe('add', () => {
      w = wrapper();
      w.instance().add();

      expect(onModelChanged).toBeCalledWith({
        categories: expect.arrayContaining([{ id: '1', label: 'Category 1' }])
      });
    });

    describe('delete', () => {
      w = wrapper();
      w.instance().delete({ id: '0' });

      expect(onModelChanged).toBeCalledWith(expect.objectContaining({ categories: [] }));
    });

    describe('change', () => {
      it('calls onChange', () => {
        w = wrapper();
        const update = { id: '1', label: 'update', choices: [] };
        w.instance().change(update);
        expect(onModelChanged).toBeCalledWith({ categories: [update] });
      });
    });

    describe('addChoiceToCategory', () => {
      w = wrapper();
      w.instance().addChoiceToCategory({ id: '1', content: 'foo' }, '0');

      expect(onModelChanged).toBeCalledWith({
        correctResponse: [{ category: '0', choices: ['1'] }]
      });
    });

    describe('deleteChoiceFromCategory', () => {
      w = wrapper();
      w.instance().deleteChoiceFromCategory({ id: '0'}, { id: '1' }, 0);

      expect(onModelChanged).toBeCalledWith({
        correctResponse: [{ category: '0', choices: [] }]
      });
    });



  });
});
