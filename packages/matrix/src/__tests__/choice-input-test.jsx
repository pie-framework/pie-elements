import React from 'react';
import {shallow, mount} from 'enzyme';
import ChoiceInput from '../ChoiceInput';
import toJson from 'enzyme-to-json';

describe('ChoiceInput', () => {

  const getPropsDefault = (onChange, propsToOverride) => {
    return {
      checked: false,
      disabled: false,
      matrixValue: 2,
      matrixKey: 'matrixKey',
      classes: {
        root: 'root',
        checked: 'checked',
      },
      onChange,
      ...propsToOverride
    }
  };

  describe('snapshots', () => {
    it('renders', () => {
      const onChange = jest.fn();
      const props = getPropsDefault(onChange);
      const shallowInstance = shallow(<ChoiceInput {...props} />);
      expect(toJson(shallowInstance)).toMatchSnapshot();
    });

    it('calls onChange', () => {
      const onChange = jest.fn();
      const props = getPropsDefault(onChange);

      const mountInstance = mount(<ChoiceInput {...props} />);

      mountInstance.find('input').at(0).simulate('change', {
        target: {
          id: 'name',
          value: '',
        },
      });

      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('does not calls onChange if disabled', () => {
      const onChange = jest.fn();
      const props = getPropsDefault(onChange, {disabled: true});

      const mountedComponent = mount(<ChoiceInput {...props} />);

      mountedComponent.find('input').at(0).simulate('change', {
        target: {
          id: 'name',
          value: '',
        },
      });

      expect(onChange).toHaveBeenCalledTimes(0);
    });
  });
});
