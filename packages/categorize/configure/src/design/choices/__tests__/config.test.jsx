import { shallow } from 'enzyme';
import React from 'react';

import { Config } from '../config';

describe('config', () => {
  let onModelChanged;
  let allChoicesHaveCount;
  let config;

  beforeEach(() => {
    onModelChanged = jest.fn();
    allChoicesHaveCount = jest.fn();
    config = {
      choices: [
        {
          id: '0',
          content: 'Choice 0',
        },
      ],
      choicesPosition: 'below',
      choicesLabel: '',
      lockChoiceOrder: true,
      removeTilesAfterPlacing: false,
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
  });
  const wrapper = (extras) => {
    const props = { classes: {}, onModelChanged, allChoicesHaveCount, config, ...extras };
    return shallow(<Config {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => {
      const w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    it('changeLabel', () => {
      let w = wrapper();

      w.instance().changeLabel({ target: { value: 'foo' } });

      expect(onModelChanged).toBeCalledWith({
        choicesLabel: 'foo',
      });
    });

    it('changePosition', () => {
      let w = wrapper();

      w.instance().changePosition({ value: 'below' });

      expect(onModelChanged).toBeCalledWith({
        choicesPosition: 'below',
      });
    });
  });
});
