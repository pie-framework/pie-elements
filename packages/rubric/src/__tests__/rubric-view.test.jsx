import { shallow, mount } from 'enzyme';
import React from 'react';
import Rubric from '../main';
import Link from '@material-ui/core/Link';


describe('rubric viewer', () => {


  const wrapper = extras => {
    const props = {value: {
      points: ['nothing right', 'a teeny bit right', 'mostly right', 'bingo'],
      excludeZero: false,
      ...extras
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

  describe('exclude zeros', () => {
    it('renders correctly with exluded zeroes', () => {
      let w = wrapper({ excludeZero: true });
      w.find(Link).simulate('click');
      expect(w.find('li').length).toEqual(3);

      w = wrapper({ excludeZero: false });
      w.find(Link).simulate('click');
      expect(w.find('li').length).toEqual(4);
    });
  });

});
