import * as React from 'react';
import { shallow } from 'enzyme';

import { GraphingConfig } from '../graphing-config';
import defaultValues from '../defaults';

describe('GraphingConfig', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      classes: {},
      model: defaultValues.model,
      onChange: jest.fn(),
      tools: [],
    };

    wrapper = (newProps) => {
      const configureProps = { ...props, newProps };

      return shallow(<GraphingConfig {...configureProps} />);
    };
  });

  describe('renders', () => {
    it('snapshot', () => {
      expect(wrapper()).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    it('changeBackgroundMarks calls onChange', () => {
      const component = wrapper();
      const bM = [];

      component.instance().changeBackgroundMarks(bM);

      expect(component.instance().props.onChange).toBeCalledWith({
        ...defaultValues.model,
        backgroundMarks: bM,
      });
    });
  });
});
