import { shallow } from 'enzyme';
import React from 'react';

import Root from '../root';
import { choiceUtils as utils, settings } from '@pie-lib/config-ui';

jest.mock('@pie-lib/config-ui', () => ({
  choiceUtils: {
    firstAvailableIndex: jest.fn()
  },
  settings: {
    Panel: props => <div {...props} />,
    toggle: jest.fn(),
    radio: jest.fn()
  }
}));

const model = () => ({
  prompt: 'Which of these northern European countries are EU members?',
  choiceMode: 'checkbox',
  choicePrefix: 'numbers',
  choices: [
    {
      correct: true,
      value: 'sweden',
      label: 'Sweden',
      feedback: {
        type: 'none',
        value: ''
      }
    },
    {
      value: 'iceland',
      label: 'Iceland',
      feedback: {
        type: 'none',
        value: ''
      }
    },
    {
      value: 'norway',
      label: 'Norway',
      feedback: {
        type: 'none',
        value:
          ''
      }
    },
    {
      correct: true,
      value: 'finland',
      label: 'Finland',
      feedback: {
        type: 'none',
        value: ''
      }
    }
  ],
  partialScoring: false,
  configure: {}
});

describe('Root', () => {
  let w;
  let onModelChanged = jest.fn();
  let initialModel = model();
  let modelCopy;

  const wrapper = extras => {
    const defaults = {
      onModelChanged,
      model: model()
    };
    const props = { ...defaults, ...extras };

    return shallow(<Root {...props} />);
  };

  beforeEach(() => {
    modelCopy = model();
  });

  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    describe('onChoiceModeChanged', () => {
      it('resets the model', () => {
        w = wrapper();
        w.instance().updateModel({
          ...modelCopy,
          choiceMode: 'radio'
        }, true);

        expect(onModelChanged).toBeCalledWith(
          expect.objectContaining({ choiceMode: 'radio' }),
          true
        );
      });
    });

    describe('onRemoveChoice', () => {
      it('removes choice', () => {
        w = wrapper();
        w.instance().onRemoveChoice(0);

        expect(onModelChanged).toBeCalledWith(
          expect.objectContaining({ choices: initialModel.choices.slice(1) }),
          undefined
        );
      });
    });

    describe('onPartialScoringChanged', () => {
      it('changes partial scoring value', () => {
        w = wrapper();
        w.instance().updateModel({
          ...modelCopy,
          partialScoring: true
        });

        expect(onModelChanged).toBeCalledWith(
          expect.objectContaining({ partialScoring: true }),
          undefined
        );
      });
    });

    describe('onAddChoice', () => {
      it('adds a choice', () => {
        w = wrapper();
        w.instance().onAddChoice();

        expect(onModelChanged).toBeCalledWith(
          expect.objectContaining({ choices: [
            ...initialModel.choices,
            {
              label: 'label',
              value: utils.firstAvailableIndex(initialModel.choices.map(c => c.value), 0),
              feedback: {
                type: 'none'
              }
            }
          ] }),
          undefined
        );
      });
    });

    describe('onChoicePrefixChanged', () => {
      it('changes choicePrefix', () => {
        w = wrapper();
        w.instance().updateModel({
          ...modelCopy,
          choicePrefix: 'letters'
        });

        expect(onModelChanged).toBeCalledWith(
          expect.objectContaining({ choicePrefix: 'letters' }),
          undefined
        );
      });
    });

    describe('onChoiceChanged', () => {
      it('changes choice', () => {
        let choice = {
          correct: true,
          value: 'iceland',
          label: 'Iceland',
          feedback: {
            type: 'none',
            value: ''
          }
        };

        w = wrapper();
        w.instance().onChoiceChanged(1, choice);
        initialModel.choices.splice(1, 1, choice);

        expect(onModelChanged).toBeCalledWith(
          expect.objectContaining({ choices: initialModel.choices }),
          undefined
        );
      });

      it('changes choice and makes incorrect all other choices', () => {
        let choice = {
          correct: true,
          value: 'iceland',
          label: 'Iceland',
          feedback: {
            type: 'none',
            value: ''
          }
        };
        let instance;

        w = wrapper();
        instance = w.instance();

        instance.updateModel({
          ...modelCopy,
          choiceMode: 'radio'
        });
        instance.onChoiceChanged(1, choice);

        initialModel.choices.splice(1, 1, choice);

        expect(onModelChanged).toBeCalledWith(
          expect.objectContaining({ choices: [
            {
              correct: false,
              value: 'sweden',
              label: 'Sweden',
              feedback: {
                type: 'none',
                value: ''
              }
            },
            {
              correct: true,
              value: 'iceland',
              label: 'Iceland',
              feedback: {
                type: 'none',
                value: ''
              }
            },
            {
              correct: false,
              value: 'norway',
              label: 'Norway',
              feedback: {
                type: 'none',
                value:
                  ''
              }
            },
            {
              correct: false,
              value: 'finland',
              label: 'Finland',
              feedback: {
                type: 'none',
                value: ''
              }
            }
          ] }),
          undefined
        );
      });
    });

    describe('onChoiceModelChanged', () => {
      it('resets the model', () => {
        w = wrapper();
        const updatedModel = w.state('model');

        updatedModel.choices.forEach(c => {
          c.correct = !c.correct;
        });

        w.setProps({ model: updatedModel });
        w.update();

        expect(w.state('model')).toEqual(updatedModel);
      });
    });
  });
});

