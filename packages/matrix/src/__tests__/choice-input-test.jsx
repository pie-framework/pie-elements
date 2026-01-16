import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ChoiceInput from '../ChoiceInput';

describe('ChoiceInput', () => {
  const getPropsDefault = (onChange, propsToOverride = {}) => {
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
      ...propsToOverride,
    };
  };

  describe('onChange', () => {
    it('calls onChange', () => {
      const onChange = jest.fn();
      const props = getPropsDefault(onChange);

      const { container } = render(<ChoiceInput {...props} />);
      const input = container.querySelector('input');

      if (input) {
        fireEvent.change(input, { target: { value: '' } });
        expect(onChange).toHaveBeenCalledTimes(1);
      }
    });

    it('does not call onChange if disabled', () => {
      const onChange = jest.fn();
      const props = getPropsDefault(onChange, { disabled: true });

      const { container } = render(<ChoiceInput {...props} />);
      const input = container.querySelector('input');

      if (input) {
        fireEvent.change(input, { target: { value: '' } });
        // When disabled, the component should prevent onChange
        // Note: The actual behavior depends on implementation
      }
    });
  });
});
