import { shallow } from 'enzyme';
import React from 'react';
import { InputHeader } from '../input-header';

describe('InputHeader', () => {
  let w;
  let onChange = jest.fn();
  let onDelete = jest.fn();
  const wrapper = extras => {
    const defaults = {
      classes: { inputHeader: 'inputHeader', editor: 'editor' },
      className: 'className',
      onChange,
      onDelete
    };
    const props = { ...defaults, ...extras };
    return shallow(<InputHeader {...props} />);
  };
  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });
});
