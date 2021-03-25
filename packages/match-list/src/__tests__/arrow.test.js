import * as React from 'react';
import { shallow } from 'enzyme';
import { Arrow } from '../arrow';

describe('Arrow', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Arrow classes={{}} />);
  });

  describe('render', () => {
    it('renders correctly for default direction', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly for direction left', () => {
      wrapper.setProps({ direction: 'left' });
      expect(wrapper).toMatchSnapshot();
    });
  });
});
