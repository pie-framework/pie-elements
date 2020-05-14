import * as React from 'react';
import { shallow } from 'enzyme';

import { GraphingConfig, AuthoringColumn } from '../graphing-config';
import defaultValues from '../defaults';

describe('AuthoringColumn', () => {
  describe('renders', () => {
    it('snapshot', () => {
      const props = {
        classes: {},
        axis: 'x',
        columnKey: 'columnKey',
        model: defaultValues.model
      };

      expect(shallow(<AuthoringColumn {...props} />)).toMatchSnapshot();
    })
  });
});


describe('GraphingConfig', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      classes: {},
      model: defaultValues.model,
      onChange: jest.fn(),
      tools: []
    };

    wrapper = newProps => {
      const configureProps = { ...props, newProps };

      return shallow(<GraphingConfig { ...configureProps } />);
    };
  });

  describe('renders', () => {
    it('snapshot', () => {
      expect(wrapper()).toMatchSnapshot();
    })
  });

  describe('logic', () => {
    it('changeBackgroundMarks calls onChange', () => {
      const component = wrapper();
      const bM = [{ x: 1, y: 1, type: 'point'}];

      component.instance().changeBackgroundMarks(bM);

      expect(component.instance().props.onChange).toBeCalledWith({
        ...defaultValues.model,
        backgroundMarks: bM
      });
    });

    it('onChangeInputValue calls onChange', () => {
      const component = wrapper();
      component.instance().onChangeInputValue('domain.min', 20);

      expect(component.instance().props.model.domain.min).toEqual(20);
      expect(component.instance().props.onChange).toHaveBeenCalledWith({
        ...defaultValues.model,
        domain: {
          ...defaultValues.model.domain,
          min: 20
        }
      })
    });
  });
});


