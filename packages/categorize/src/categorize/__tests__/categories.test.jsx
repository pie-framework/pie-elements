import { shallow } from 'enzyme';
import React from 'react';
import { Categories } from '../categories';

describe('categories', () => {
  const wrapper = extras => {
    const defaults = {
      classes: {},
      categories: [{ choices: [], id: '1', label: 'category label' }],
      onDropChoice: jest.fn(),
      onRemoveChoice: jest.fn(),
      id: '1',
      label: 'Category Label',
      grid: { columns: 1, rows: 1 },
    };

    const props = { ...defaults, ...extras };
    return shallow(<Categories {...props} />);
  };

  describe('snapshots', () => {
    it('renders', () => {
      expect(wrapper()).toMatchSnapshot();
    });

    it('disabled', () => {
      expect(wrapper({ disabled: true })).toMatchSnapshot();
    });
  });
});
