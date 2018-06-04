import { shallow } from 'enzyme';
import React from 'react';

import { Header } from '../header';

describe('Header', () => {
  let w;
  let onAdd = jest.fn();
  const wrapper = extras => {
    const defaults = {
      classes: {
        header: 'header'
      },
      label: 'Header',
      className: 'className',
      onAdd
    };
    const props = { ...defaults, ...extras };
    return shallow(<Header {...props} />);
  };
  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });
});
