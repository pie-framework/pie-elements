import React from 'react';
import _ from 'lodash';
import { shallow, mount } from 'enzyme';
import { ChoiceInput } from '../choice-input';
import toJson from 'enzyme-to-json';

describe('ChoiceInput', () => {
  let onChange, wrapper;

  const mkWrapper = (opts = {}) => {
    opts = _.extend(
      {
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
      },
      opts
    );

    return shallow(<ChoiceInput {...opts} onChange={onChange} />);
  };

  beforeEach(() => {
    onChange = jest.fn();
    wrapper = mkWrapper();
  });

  describe('snapshots', () => {
    describe('radio', () => {
      it('renders', () => {
        const wrapper = mkWrapper({ choiceMode: 'radio' });
        expect(toJson(wrapper)).toMatchSnapshot();
      });
    });

    describe('checkbox', () => {
      it('renders', () => {
        const wrapper = mkWrapper({ choiceMode: 'checkbox' });
        expect(toJson(wrapper)).toMatchSnapshot();
      });
    });

    describe('radio with incorrect', () => {
      it('renders', () => {
        const wrapper = mkWrapper({
          choiceMode: 'radio',
          correctness: 'incorrect',
        });
        expect(toJson(wrapper)).toMatchSnapshot();
      });
    });

    describe('rationale', () => {
      it('does not render', () => {
        const wrapper = mkWrapper();
        expect(toJson(wrapper)).toMatchSnapshot();
      });

      it('renders', () => {
        const wrapper = mkWrapper({ rationale: 'This is rationale' });
        expect(toJson(wrapper)).toMatchSnapshot();
      });
    });
  });

  describe('onToggleChoice', () => {
    it('calls handler', () => {
      wrapper.instance().onToggleChoice({ target: { checked: true } });
      expect(onChange).toBeCalledWith({
        value: 'value',
        selected: true,
      });
    });
  });

  /** we're mocking preview prompt - so this won't pass */
  describe.skip('clicking on choice text triggers toggle choice', () => {
    it('calls handler', () => {
      const onChange = jest.fn();
      const props = {
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
        onChange,
      };

      console.log(ChoiceInput);
      const item = mount(<ChoiceInput {...props} />);
      const label = item.find('.label');

      label.simulate('click');

      expect(onChange).toHaveBeenCalledWith({ value: 'value', selected: true });
    });
  });
});
