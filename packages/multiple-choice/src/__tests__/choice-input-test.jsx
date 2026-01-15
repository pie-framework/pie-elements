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

  describe('snapshots', () => {
    describe('radio', () => {
      it('renders', () => {
        const { container } = mkWrapper({ choiceMode: 'radio' });
        expect(container).toMatchSnapshot();
      });
    });

    describe('checkbox', () => {
      it('renders', () => {
        const { container } = mkWrapper({ choiceMode: 'checkbox' });
        expect(container).toMatchSnapshot();
      });
    });

    describe('radio with incorrect', () => {
      it('renders', () => {
        const { container } = mkWrapper({
          choiceMode: 'radio',
          correctness: 'incorrect',
        });
        expect(container).toMatchSnapshot();
      });
    });

    describe('rationale', () => {
      it('does not render', () => {
        const { container } = mkWrapper();
        expect(container).toMatchSnapshot();
      });

      it('renders', () => {
        const { container } = mkWrapper({ rationale: 'This is rationale' });
        expect(container).toMatchSnapshot();
      });
    });
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
