import { shallow } from 'enzyme';
import React from 'react';

import { AlternateResponses } from '../alternateResponses';

describe('AlternateResponses', () => {
  let w;
  let onModelChanged = jest.fn();
  let model = {
    choices: [
      {
        id: '0',
        content: 'Choice 0',
        categoryCount: 0,
      },
      { id: '2', content: 'foo', categoryCount: 0 },
      { id: '3', content: 'foo1', categoryCount: 0 },
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

  const wrapper = (extras) => {
    console.log('Andreea extrassssss', extras);
    model = { ...model, ...extras };
    const defaults = {
      altIndex: 0,
      classes: {
        categories: 'categories',
        categoriesHolder: 'categoriesHolder',
        row: 'row',
      },
      categories: [{ id: '1', label: 'foo', choices: [] }],
      className: 'className',
      model: {
        ...model,
        choices: [
          { id: '1', categoryCount: 0 },
          { id: '2', categoryCount: 0 },
        ],
        correctResponse: [{ category: '0', choices: ['1'] }],
      },
      onModelChanged,
    };
    const props = { ...defaults, ...extras };

    return shallow(<AlternateResponses {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    describe('addChoiceToCategory', () => {
      w = wrapper();
      w.instance().addChoiceToCategory({ id: '2', content: 'foo' }, '0');

      expect(onModelChanged).toBeCalledWith({
        correctResponse: [{ category: '0', choices: ['1'], alternateResponses: [['2']] }],
        maxChoicesPerCategory: 0,
      });
    });

    describe('addChoiceToCategory-MaxChoicePerCategory', () => {
      const newModel = { maxChoicesPerCategory: 1 };
      w = wrapper(newModel);
      w.instance().addChoiceToCategory({ id: '2', content: 'foo', categoryCount: 0 }, '0');

      expect(onModelChanged).toBeCalledWith({
        maxChoicesPerCategory: 1,
        correctResponse: [{ category: '0', choices: ['1'], alternateResponses: [['2']] }],
      });
    });

    describe('deleteChoiceFromCategory', () => {
      w = wrapper();
      w.instance().addChoiceToCategory({ id: '2', content: 'foo' }, '0');
      w.instance().deleteChoiceFromCategory({ id: '0' }, { id: '2' }, 0);

      expect(onModelChanged).toBeCalledWith({
        correctResponse: [{ category: '0', choices: ['1'], alternateResponses: [[]] }],
      });
    });
  });
});
