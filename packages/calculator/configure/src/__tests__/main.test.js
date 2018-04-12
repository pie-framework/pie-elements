import React from 'react';
import { Main } from '../main';
import { truncateSync } from 'fs';

describe('Render a calculator element', () => {
  let wrapper, onChange;

  beforeEach(() => {
    onChange = jest.fn();
    wrapper = shallow(<Main model={{ mode: 'basic' }} onChange={onChange} />);
  });

  it('Creates snapshot using enzyme', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('onModeChange', () => {
    it('calls onChange', () => {
      wrapper.instance().onModeChange('scientific');
      expect(onChange.mock.calls.length).toEqual(1);
    });
  });
});
