import { shallow } from 'enzyme';
import React from 'react';
import { GridContent } from '../grid-content';

describe('grid-content', () => {
  const wrapper = extras => {
    const defaults = {
      classes: {},
      columns: 2
    };

    const props = { ...defaults, ...extras };
    return shallow(<GridContent {...props}>content</GridContent>);
  };

  describe('snapshots', () => {
    it('renders', () => {
      expect(wrapper()).toMatchSnapshot();
    });

    it('columns', () => {
      expect(wrapper({ columns: 3 })).toMatchSnapshot();
    });
    it('className', () => {
      expect(wrapper({ className: 'foo' })).toMatchSnapshot();
    });
  });
});
