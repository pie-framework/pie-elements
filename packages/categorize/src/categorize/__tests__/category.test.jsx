import { shallow } from 'enzyme';
import React from 'react';
import { Category } from '../category';

describe('category', () => {
  const wrapper = extras => {
    const defaults = {
      classes: {
        label: 'label',
        incorrect: 'incorrect',
        placeholder: 'placeholder',
        category: 'category'
      },
      choices: [],
      id: '1',
      label: 'Category Label',
      grid: { columns: 1, rows: 1 }
    };

    const props = { ...defaults, ...extras };
    return shallow(<Category {...props} />);
  };

  describe('snapshots', () => {
    it('renders', () => {
      expect(wrapper()).toMatchSnapshot();
    });

    it('disabled', () => {
      expect(wrapper({ disabled: true })).toMatchSnapshot();
    });

    it('incorrect', () => {
      expect(wrapper({ choices: [{ correct: false }] })).toMatchSnapshot();
    });
  });
});
