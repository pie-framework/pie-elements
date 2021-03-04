import * as React from 'react';
import { shallow } from 'enzyme';
import { ChoicesList } from '../choices-list';
import { model } from '../../docs/demo/config';

describe('ChoicesList', () => {
  const defaultProps = {
    model: model('1'),
    session: {},
    classes: {}
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<ChoicesList {...defaultProps} />);
  });

  describe('render', () => {
    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
