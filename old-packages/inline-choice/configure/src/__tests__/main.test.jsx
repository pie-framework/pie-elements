import { shallow } from 'enzyme';
import React from 'react';

import { RawMain } from '../main';

const choices = [
  {
    correct: true,
    value: '1',
    label: 'Sweden'
  },
  {
    value: '2',
    label: 'Iceland',
    feedback: {
      type: 'default'
    }
  },
  {
    value: '4',
    label: 'Norway'
  },
  {
    value: '5',
    label: 'Finland',
    feedback: {
      type: 'custom',
      value: 'Nokia was founded in Finland.'
    }
  }
];

const defaultModel = {
  defaultLang: 'en-US',
  choiceLabel: 'Select option ...',
  choices
};

describe('RawMain', () => {
  let wrapper;
  let onPromptChange = jest.fn();
  let onChoiceChange = jest.fn();
  let onRemoveChoice = jest.fn();
  let onAddChoice = jest.fn();

  beforeAll(() => {
    const props = {
      classes: {},
      model: defaultModel,
      onPromptChange,
      onChoiceChange,
      onRemoveChoice,
      onAddChoice
    };

    wrapper = () => shallow(<RawMain {...props} />);
  });

  describe('snapshot', () => {
    it('renders', () => {
      expect(wrapper()).toMatchSnapshot();
    });
  });

  describe('logoc', () => {
    it('', () => {
      wrapper().instance().onChoiceChange(0, { value: '0', label: 'New Choice'});

      expect(onChoiceChange).toHaveBeenCalledWith(0, { value: '0', label: 'New Choice'});
    });
  });
});
