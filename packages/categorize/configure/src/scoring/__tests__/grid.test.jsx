import { shallow } from 'enzyme';
import React from 'react';

import { Grid } from '../grid';

describe('Grid', () => {
  let w;
  let onChange = jest.fn();
  const wrapper = extras => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      headings: ['A', 'B']
    };
    const props = { ...defaults, ...extras };
    return shallow(
      <Grid {...props}>
        <div>a</div>
        <div>b</div>
      </Grid>
    );
  };
  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });
});
