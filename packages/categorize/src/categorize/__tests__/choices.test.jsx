import { shallow } from 'enzyme';
import React from 'react';
import { Choices } from '../choices';

describe('choices', () => {
  const wrapper = extras => {
    const defaults = {
      classes: {},
      choices: [],
      onDropChoice: jest.fn(),
      onRemoveChoice: jest.fn(),
      id: '1',
      label: 'Category Label',
      grid: { columns: 1, rows: 1 },
    };

    const props = { ...defaults, ...extras };
    return shallow(<Choices {...props} />);
  };

  describe('snapshots', () => {
    it('renders', () => {
      expect(wrapper()).toMatchSnapshot();
    });

    it('disabled', () => {
      expect(wrapper({ disabled: true })).toMatchSnapshot();
    });

    it('empty', () => {
      expect(
        wrapper({ choices: [{ id: '1', label: 'foo' }] })
      ).toMatchSnapshot();
    });

    it('empty', () => {
      expect(wrapper({ choices: [{ empty: true }] })).toMatchSnapshot();
    });
  });
});
