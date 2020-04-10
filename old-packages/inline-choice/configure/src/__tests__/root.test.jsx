import { shallow } from 'enzyme';
import React from 'react';

import Root from '../root';

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

describe('Root', () => {
  let wrapper;
  let onModelChanged = jest.fn();

  beforeEach(() => {
    const props = {
      model: defaultModel,
      onModelChanged
    };
    wrapper = () => shallow(<Root {...props} />);
  });

  describe('snapshot', () => {
    it('renders', () => {
      expect(wrapper()).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    let wInstance;

    beforeAll(() => {
      wInstance = wrapper().instance();
    });

    it('handleModelChange calls onModelChanged', () => {
      wInstance.handleModelChange();

      expect(onModelChanged).toHaveBeenCalledWith(defaultModel);
    });

    it('update calls onModelChanged', () => {
      wInstance.update({ ...defaultModel, prompt: 'Prompt' });

      expect(onModelChanged).toHaveBeenCalledWith(expect.objectContaining({ prompt: 'Prompt' }));
    });

    it('onAddChoice calls onModelChanged with correct choice value', () => {
      wInstance.onAddChoice();

      const newChoices = [
        ...choices,
        {
          correct: false,
          value: '6',
          label: '',
          feedback: { type: 'default' }
        }
      ];

      expect(onModelChanged).toHaveBeenCalledWith(expect.objectContaining({ choices: newChoices }));
      expect(wInstance.state.model.choices).toEqual(newChoices);

    });

    it('onChoiceChange calls onModelChanged with existing index', () => {
      wInstance.onChoiceChange('2', { value: '4', label: 'Germany' });

      const newChoices = [
        choices[0],
        choices[1],
        { value: '4', label: 'Germany' },
        choices[3],
        {
          correct: false,
          value: '6',
          label: '',
          feedback: { type: 'default' }
        }
      ];

      expect(onModelChanged).toHaveBeenCalledWith(expect.objectContaining({
        choices: newChoices
      }));

      expect(wInstance.state.model.choices).toEqual(newChoices);

    });

    it('onChoiceChange calls onModelChanged with non-existent index', () => {
      wInstance.onChoiceChange('20', { value: '4', label: 'Germany' });

      const newChoices = [
        choices[0],
        choices[1],
        { value: '4', label: 'Germany' },
        choices[3],
        {
          correct: false,
          value: '6',
          label: '',
          feedback: { type: 'default' }
        }
      ];

      expect(onModelChanged).toHaveBeenCalledWith(expect.objectContaining({
        choices: newChoices
      }));
      expect(wInstance.state.model.choices).toEqual(newChoices);
    });

    it('onRemoveChoice with existing index', () => {
      wInstance.onRemoveChoice(0);

      const newChoices = [
        choices[1],
        { value: '4', label: 'Germany' },
        choices[3],
        {
          correct: false,
          value: '6',
          label: '',
          feedback: { type: 'default' }
        }
      ];

      expect(wInstance.state.model.choices).toEqual(newChoices);
    });

    it('onRemoveChoice with non-existing index', () => {
      wInstance.onRemoveChoice(20);

      const newChoices = [
        choices[1],
        { value: '4', label: 'Germany' },
        choices[3],
        {
          correct: false,
          value: '6',
          label: '',
          feedback: { type: 'default' }
        }
      ];

      expect(wInstance.state.model.choices).toEqual(newChoices);
    });

    it('onPromptChange', () => {
      wInstance.onPromptChange('New Prompt');

      expect(onModelChanged).toHaveBeenCalledWith(expect.objectContaining({
        prompt: 'New Prompt'
      }));
    });
  });
});
