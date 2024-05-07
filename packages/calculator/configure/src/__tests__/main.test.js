import React from 'react';
import { Main } from '../main';
import { shallow } from 'enzyme';

jest.mock('@pie-lib/pie-toolbox/config-ui', () => ({
  layout: {
    ConfigLayout: (props) => <div>{props.children}</div>,
  },
}));

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
