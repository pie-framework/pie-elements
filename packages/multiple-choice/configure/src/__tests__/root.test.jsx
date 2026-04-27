import { render } from '@testing-library/react';
import React from 'react';

import { Main } from '../main';
import defaults from '../defaults';
import { choiceUtils as utils } from '@pie-lib/config-ui';
import MultipleChoice from '../index';

jest.mock('@pie-lib/editable-html-tip-tap', () => (props) => (
  <div data-testid="editable-html">{props.markup}</div>
));

jest.mock('@pie-lib/config-ui', () => ({
  choiceUtils: {
    firstAvailableIndex: jest.fn(),
    normalizeChoices: jest.fn((model) => model),
  },
  settings: {
    Panel: (props) => <div data-testid="settings-panel" {...props} />,
    toggle: jest.fn(),
    radio: jest.fn(),
    dropdown: jest.fn(),
  },
  layout: {
    ConfigLayout: (props) => <div data-testid="config-layout">{props.children}</div>,
  },
  InputContainer: (props) => <div data-testid="input-container" {...props}>{props.children}</div>,
  ChoiceConfiguration: (props) => (
    <div data-testid="choice-configuration">
      <button onClick={() => props.onDelete()}>Delete</button>
      <button onClick={() => props.onChange(props.data)}>Change</button>
    </div>
  ),
  AlertDialog: (props) => props.open ? <div data-testid="alert-dialog">{props.text}</div> : null,
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
        value: '',
      },
    },
    {
      value: 'iceland',
      label: 'Iceland',
      feedback: {
        type: 'none',
        value: '',
      },
    },
    {
      value: 'norway',
      label: 'Norway',
      feedback: {
        type: 'none',
        value: '',
      },
    },
    {
      correct: true,
      value: 'finland',
      label: 'Finland',
      feedback: {
        type: 'none',
        value: '',
      },
    },
  ],
  partialScoring: false,
  configure: {},
  ...extras,
});

describe('Main', () => {
  let onModelChanged = jest.fn();
  let onConfigurationChanged = jest.fn();
  let initialModel = model();

  const wrapper = (extras) => {
    const defaultProps = {
      onModelChanged,
      onConfigurationChanged,
      classes: {},
      model: model(),
      configuration: defaults.configuration,
    };
    const props = { ...defaultProps, ...extras };

    return render(<Main {...props} />);
  };

  const createInstance = (extras) => {
    const defaultProps = {
      onModelChanged,
      onConfigurationChanged,
      classes: {},
      model: model(),
      configuration: defaults.configuration,
    };
    const props = { ...defaultProps, ...extras };
    const instance = new Main(props);
    instance.setState = jest.fn((state, callback) => {
      Object.assign(instance.state, typeof state === 'function' ? state(instance.state) : state);
      if (callback) callback();
    });
    return instance;
  };

  beforeEach(() => {
    onModelChanged = jest.fn();
    onConfigurationChanged = jest.fn();
    initialModel = model();
  });

  describe('logic', () => {
    describe('onRemoveChoice', () => {
      it('removes choice', () => {
        const instance = createInstance();
        instance.onRemoveChoice(0);

        expect(onModelChanged).toBeCalledWith({
          ...initialModel,
          choices: initialModel.choices.slice(1),
        });
      });
    });

    describe('createDefaultModel', () => {
      it('sets choicesLayout: horizontal if verticalMode: false', () => {
        const m = MultipleChoice.createDefaultModel(model({ verticalMode: false, choicesLayout: undefined }));

        expect(m.choicesLayout).toEqual('horizontal');
      });

      it('sets choicesLayout: vertical if verticalMode: true', () => {
        const m = MultipleChoice.createDefaultModel(model({ verticalMode: true, choicesLayout: undefined }));

        expect(m.choicesLayout).toEqual('vertical');
      });

      it('sets choicesLayout: grid if verticalMode: true && choicesLayout: grid', () => {
        const m = MultipleChoice.createDefaultModel(model({ verticalMode: true, choicesLayout: 'grid' }));

        expect(m.choicesLayout).toEqual('grid');
      });

      it('sets choicesLayout: vertical', () => {
        const m = MultipleChoice.createDefaultModel(model());

        expect(m.choicesLayout).toEqual('vertical');
      });
    });

    describe('onAddChoice', () => {
      it('adds a choice', () => {
        const instance = createInstance();
        instance.onAddChoice();

        expect(onModelChanged).toBeCalledWith({
          ...initialModel,
          choices: [
            ...initialModel.choices,
            {
              label: '',
              value: utils.firstAvailableIndex(
                initialModel.choices.map((c) => c.value),
                0,
              ),
              feedback: {
                type: 'none',
              },
            },
          ],
        });
      });
    });

    describe('onChoiceChanged', () => {
      describe('checkbox', () => {
        it('changes choice (there are 2 true values)', () => {
          const instance = createInstance();
          const newChoices = [...model().choices];
          let choice = {
            correct: true,
            value: 'iceland',
            label: 'Iceland',
            feedback: {
              type: 'none',
              value: '',
            },
          };

          instance.onChoiceChanged(1, choice);

          newChoices[1].correct = true;

          expect(onModelChanged).toBeCalledWith({
            ...initialModel,
            choices: newChoices,
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
              value: '',
            },
          };

          const newModel = { ...initialModel, choiceMode: 'radio', choices: initialModel.choices.slice(0, 2) };
          const instance = createInstance({ model: newModel });

          instance.onChoiceChanged(1, choice);

          expect(onModelChanged).toBeCalledWith({
            ...newModel,
            choices: [
              {
                correct: false,
                value: 'sweden',
                label: 'Sweden',
                feedback: {
                  type: 'none',
                  value: '',
                },
              },
              {
                correct: true,
                value: 'iceland',
                label: 'Iceland',
                feedback: {
                  type: 'none',
                  value: '',
                },
              },
            ],
          });
        });
      });
    });

    describe('onPromptChanged', () => {
      it('changes prompt', () => {
        const instance = createInstance();
        instance.onPromptChanged('New Prompt');

        expect(onModelChanged).toBeCalledWith({
          ...initialModel,
          prompt: 'New Prompt',
        });
      });
    });

    describe('onTeacherInstructionsChanged', () => {
      it('changes teacher instructions', () => {
        const instance = createInstance();
        instance.onTeacherInstructionsChanged('New Teacher Instructions');

        expect(onModelChanged).toBeCalledWith({
          ...initialModel,
          teacherInstructions: 'New Teacher Instructions',
        });
      });
    });

    describe('onModelChanged', () => {
      it('changes choice and makes incorrect all other choices', () => {
        const instance = createInstance();
        instance.onModelChanged(
          {
            ...initialModel,
            choiceMode: 'radio',
          },
          'choiceMode',
        );

        const expectedChoices = model().choices;

        expectedChoices.forEach((eC, index) => {
          eC.correct = index === 0;
        });

        expect(onModelChanged).toBeCalledWith(
          {
            ...initialModel,
            choiceMode: 'radio',
            choices: expectedChoices,
          },
          true,
        );
      });
    });
  });
});
