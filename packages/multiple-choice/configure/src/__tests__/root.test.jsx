import { shallow } from 'enzyme';
import React from 'react';

import { Main } from '../main';
import defaults from '../defaults';
import { choiceUtils as utils } from '@pie-lib/config-ui';

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

const model = (extras) => ({
  ...defaults.model,
  prompt: 'Which of these northern European countries are EU members?',
  choiceMode: 'checkbox',
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
  configure: {},
  ...extras
});

describe('Main', () => {
  let w;
  let onModelChanged = jest.fn();
  let onConfigurationChanged = jest.fn();
  let initialModel = model();

  const wrapper = extras => {
    const defaults = {
      onModelChanged,
      onConfigurationChanged,
      classes: {},
      model: model()
    };
    const props = { ...defaults, ...extras };

    return shallow(<Main {...props} />);
  };

  describe('snapshot', () => {
    it('renders with choicePrefix="numbers"', () => {
      w = wrapper({ model: model({ choicePrefix: 'numbers' }) });
      expect(w).toMatchSnapshot();
    });

    it('renders with choicePrefix="letters" as default', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    beforeEach(() => {
      w = wrapper();
    });
    describe('onRemoveChoice', () => {
      it('removes choice', () => {
        w.instance().onRemoveChoice(0);

        expect(onModelChanged).toBeCalledWith({
          ...initialModel,
          choices: initialModel.choices.slice(1)
        });
      });
    });

    describe('onAddChoice', () => {
      it('adds a choice', () => {
        w.instance().onAddChoice();

        expect(onModelChanged).toBeCalledWith({
          ...initialModel,
          choices: [
            ...initialModel.choices,
            {
              label: '',
              value: utils.firstAvailableIndex(initialModel.choices.map(c => c.value), 0),
              feedback: {
                type: 'none'
              }
            }
          ]
        });
      });
    });

    describe('onChoiceChanged', () => {
      describe('checkbox', () => {
        it('changes choice (there are 2 true values)', () => {
          const newChoices = [...model().choices];
          let choice = {
            correct: true,
            value: 'iceland',
            label: 'Iceland',
            feedback: {
              type: 'none',
              value: ''
            }
          };

          w.instance().onChoiceChanged(1, choice);

          newChoices[1].correct = true;

          expect(onModelChanged).toBeCalledWith({
            ...initialModel,
            choices: newChoices
          });
        });
      });

      describe('radio', () => {
        it('changes choice (there is only one true value)', () => {
          let choice = {
            correct: true,
            value: 'iceland',
            label: 'Iceland',
            feedback: {
              type: 'none',
              value: ''
            }
          };

          const newModel = { ...initialModel, choiceMode: 'radio', choices: initialModel.choices.slice(0, 2) };
          w = wrapper({ model: newModel });


          w.instance().onChoiceChanged(1, choice);

          expect(onModelChanged).toBeCalledWith({
            ...newModel,
            choices: [
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
            ]
          });
        });
      });
    });

    describe('onPromptChanged', () => {
      it('changes prompt', () => {
        w.instance().onPromptChanged('New Prompt');

        expect(onModelChanged).toBeCalledWith({
            ...initialModel,
            prompt: 'New Prompt'
          }
        );
      });
    });

    describe('onTeacherInstructionsChanged', () => {
      it('changes teacher instructions', () => {
        w.instance().onTeacherInstructionsChanged('New Teacher Instructions');

        expect(onModelChanged).toBeCalledWith({
            ...initialModel,
            teacherInstructions: 'New Teacher Instructions'
          }
        );
      });
    });

    describe('onModelChanged', () => {
      it('changes choice and makes incorrect all other choices', () => {
        w.instance().onModelChanged({
            ...initialModel,
            choiceMode: 'radio'
          },
          'choiceMode'
        );

        const expectedChoices = model().choices;

        expectedChoices.forEach((eC, index) => {
          eC.correct = index === 0;
        });

        expect(onModelChanged).toBeCalledWith({
            ...initialModel,
            choiceMode: 'radio',
            choices: expectedChoices
          },
          true
        );
      });
    });
  });
});
