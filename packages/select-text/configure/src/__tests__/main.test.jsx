import { shallow } from 'enzyme';
import React from 'react';
import { Main } from '../main';
import {
  layout,
  settings,
} from '@pie-lib/config-ui';

jest.mock('@pie-lib/config-ui', () => ({
  layout: {
    ConfigLayout: props => <div>{props.children}</div>
  },
  settings: {
    Panel: props => <div onChange={props.onChange} />,
    toggle: jest.fn(),
    radio: jest.fn()
  }
}));


describe('main', () => {
  let w;
  let onChange;

  const getModel = () => ({ tokens: [] });
  beforeEach(() => {
    onChange = jest.fn();
    w = shallow(<Main model={getModel()} classes={{}} onChange={onChange} />);
  });

  describe('snapshot', () => {
    it('renders', () => {
      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {});
});
