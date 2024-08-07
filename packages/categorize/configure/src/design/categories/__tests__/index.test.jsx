import { shallow } from 'enzyme';
import React from 'react';

import { Categories } from '../index';

describe('Categories', () => {
  let w;
  let onModelChanged;

  let wrapper;

  beforeEach(() => {
    let model = {
      choices: [
        {
          id: '0',
          content: 'Choice 0',
          categoryCount: 0,
        },
        {
          id: '1',
          content: 'Choice 0',
          categoryCount: 0,
        },
        {
          id: '2',
          content: 'Choice 3',
          categoryCount: 0,
        },
      ],
      choicesPosition: 'below',
      choicesLabel: '',
      lockChoiceOrder: true,
      categoriesPerRow: 2,
      categories: [
        {
          id: '0',
          label: 'Category 0',
          choices: [],
        },
      ],
      rowLabels: [''],
      correctResponse: [],
      partialScoring: true,
    };

    onModelChanged = jest.fn();
    wrapper = (extras) => {
      model = { ...model, ...extras };
      const defaults = {
        classes: {
          categories: 'categories',
          categoriesHolder: 'categoriesHolder',
          row: 'row',
        },
        categories: [{ id: '1', label: 'foo', choices: [] }],
        className: 'className',
        model,
        onModelChanged,
        extras,
      };

      const props = { ...defaults };
      return shallow(<Categories {...props} />);
    };
  });

  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    describe('add', () => {
      it('calls onChange', () => {
        w = wrapper();
        w.instance().add();

        expect(onModelChanged).toBeCalledWith({
          categories: expect.arrayContaining([
            { id: '1', label: 'Category 1' },
            {
              id: '0',
              label: 'Category 0',
              choices: [],
            },
          ]),
          correctResponse: [],
          rowLabels: [''],
        });
      });
    });

    describe('delete', () => {
      it('calls onChange', () => {
        w = wrapper();
        w.instance().delete({ id: '0' });

        expect(onModelChanged).toBeCalledWith(expect.objectContaining({ categories: [] }));
      });
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
      it('calls onChange', () => {
        w = wrapper();
        w.instance().addChoiceToCategory({ id: '1', content: 'foo' }, '0');

        expect(onModelChanged).toBeCalledWith({
          correctResponse: [{ category: '0', choices: ['1'] }],
          maxChoicesPerCategory: 0,
        });
      });
    });

    describe('deleteChoiceFromCategory', () => {
      it('calls onChange', () => {
        w = wrapper();
        w.instance().deleteChoiceFromCategory({ id: '0' }, { id: '1' }, 0);

        expect(onModelChanged).toBeCalledWith({
          correctResponse: [],
        });
      });
    });

    describe('addChoiceToCategory-MaxChoicePerCategory', () => {
      const newModel = { maxChoicesPerCategory: 1 };
      it('calls onChange', () => {
        w = wrapper(newModel);
        w.instance().addChoiceToCategory({ id: '2', content: 'foo' }, '0');

        expect(onModelChanged).toBeCalledWith({
          correctResponse: [{ category: '0', choices: ['2'] }],
          maxChoicesPerCategory: 1,
        });
      });
    });
  });
});
