import { shallow } from 'enzyme';
import React from 'react';

import { RawAddButton } from '../buttons';

describe('AddButton', () => {
  let w;
  let onClick = jest.fn();
  const wrapper = extras => {
    const defaults = {
      classes: { addButton: 'addButton' },
      className: 'className',
      onClick
    };
    const props = { ...defaults, ...extras };
    return shallow(<RawAddButton {...props} />);
  };
  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });
});
