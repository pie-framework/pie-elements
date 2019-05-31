import { shallow, mount } from 'enzyme';
import React from 'react';
import Rubric from '../main';
import Link from '@material-ui/core/Link';


describe('rubric viewer', () => {


  const wrapper = extras => {
    const props = {value: {
      points: ['nothing right', 'a teeny bit right', 'mostly right', 'bingo'],
      maxPoints: 4,
      excludeZero: false
    }};

    return mount(<Rubric {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => {
      const w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });

  describe('expanded snapshot', () => {
    it('renders', () => {
      const w = wrapper();
      w.find(Link).simulate('click');
      expect(w).toMatchSnapshot();
    });
  });

});
