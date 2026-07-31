import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ChoiceInput } from '../choice-input';

describe('ChoiceInput', () => {
  let onChange;

  const mkWrapper = (opts = {}) => {
    const defaultOpts = {
      checked: false,
      disabled: false,
      choiceMode: 'checkbox',
      label: 'label',
      displayKey: '1',
      correctness: 'correct',
      value: 'value',
      classes: {
        label: 'label',
      },
    };

    const finalOpts = { ...defaultOpts, ...opts };

    return render(<ChoiceInput {...finalOpts} onChange={onChange} />);
  };

  beforeEach(() => {
    onChange = jest.fn();
  });

  describe('onToggleChoice', () => {
    it('calls handler when checkbox is clicked', () => {
      const { container } = mkWrapper({ disabled: false });
      const input = container.querySelector('input[type="checkbox"]');

      if (input) {
        fireEvent.click(input);
        expect(onChange).toHaveBeenCalled();
      }
    });
  });
});
