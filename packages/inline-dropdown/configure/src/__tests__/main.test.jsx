import { shallow } from 'enzyme';
import React from 'react';

import { Main } from '../main';
import cloneDeep from 'lodash/cloneDeep';
import sensibleDefaults from '../defaults';
import { createSlateMarkup, processMarkup } from '../markupUtils';

jest.mock('@pie-lib/config-ui', () => ({
  choiceUtils: {
    firstAvailableIndex: jest.fn()
  },
  settings: {
    Panel: props => <div {...props} />,
    toggle: jest.fn(),
    radio: jest.fn(),
    dropdown: jest.fn()
  },
  layout: {
    ConfigLayout: props => <div>{props.children}</div>
  },
  InputContainer: props => <div>{props.children}</div>
}));

const model = {
  prompt: 'Use the dropdowns to complete the sentence',
  shuffle: true,
  markup: '<div><p>The {{0}} jumped {{1}} the {{2}}</p></div>',
  choices: {
    '0': [
      {
        label: 'cow ',
        value: '0',
        correct: true
      },
      {
        label: 'dog ',
        value: '1',
        correct: false
      },
      {
        label: 'cat ',
        value: '2',
        correct: false
      }
    ],
    '1': [
      {
        label: 'over ',
        value: '0',
        correct: true
      },
      {
        label: 'under ',
        value: '1',
        correct: false
      },
      {
        label: 'across ',
        value: '2',
        correct: false
      }
    ],
    '2': [
      {
        label: 'moon ',
        value: '0',
        correct: true
      },
      {
        label: 'sun',
        value: '2',
        correct: false
      },
      {
        label: 'house ',
        value: '3',
        correct: false
      }
    ]
  },
  alternateResponse: {
    '2': ['2']
  }
};

const prepareModel = (model = {}) => {
  const currModal = {
    ...sensibleDefaults.model,
    ...model
  };
  const slateMarkup = model.slateMarkup || createSlateMarkup(currModal.markup, currModal.choices);
  const markup = processMarkup(slateMarkup);

  return {
    ...currModal,
    slateMarkup,
    markup
    /*...processedMarkup,*/
  };
};

describe('Main', () => {
  let onModelChanged;
  let onConfigurationChanged;

  const wrapper = extras => {
    onModelChanged = jest.fn();
    onConfigurationChanged = jest.fn();

    const defaults = {
      onModelChanged,
      onConfigurationChanged,
      classes: {},
      model: prepareModel({
        ...model,
        ...extras
      }),
      configuration: sensibleDefaults.configuration
    };
    const props = { ...defaults };

    return shallow(<Main {...props} />, { disableLifecycleMethods: true });
  };

  describe('snapshot', () => {
    it('renders with teacher instructions, prompt and rationale even if not set', () => {
      expect(wrapper()).toMatchSnapshot();
    });

    it('renders without teacher instructions, prompt and rationale', () => {
      expect(wrapper({
        promptEnabled: false,
        teacherInstructionsEnabled: false,
        rationaleEnabled: false
      })).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    let w;

    beforeEach(() => {
      w = wrapper();
    });

    describe('onModelChange', () => {
      it('changes the model', () => {
        w.instance().onModelChange({ promptEnabled: false });

        expect(onModelChanged).toBeCalledWith({
          ...prepareModel(model),
          promptEnabled: false
        });
      });
    });

    describe('onPromptChanged', () => {
      it('changes the prompt value', () => {
        w.instance().onPromptChanged('This is the new prompt');

        expect(onModelChanged).toBeCalledWith({
          ...prepareModel(model),
          prompt: 'This is the new prompt'
        });
      });
    });

    describe('onRationaleChanged', () => {
      it('changes the rationale value', () => {
        w.instance().onRationaleChanged('New Rationale');

        expect(onModelChanged).toBeCalledWith({
          ...prepareModel(model),
          rationale: 'New Rationale'
        });
      });
    });

    describe('onTeacherInstructionsChanged', () => {
      it('changes the teacher instructions value', () => {
        w.instance().onTeacherInstructionsChanged('New Teacher Instructions');

        expect(onModelChanged).toBeCalledWith({
          ...prepareModel(model),
          teacherInstructions: 'New Teacher Instructions'
        });
      });
    });

    describe('onMarkupChanged', () => {
      it('changes slate markup value', () => {
        const slateMarkup = '<p>The <span data-type=\\"explicit_constructed_response\\" data-index=\\"0\\" data-value=\\"cow\\"></span> jumped</p>';

        w.instance().onMarkupChanged(slateMarkup);

        expect(onModelChanged).toBeCalledWith({
          ...prepareModel(model),
          slateMarkup
        });
      });
    });

    describe('onChange', () => {
      it('Removing choices (keeping only 1 choice): slateMarkup and choices are updated', () => {
        const newChoices = {
          ...model.choices,
          '0': model.choices['0'].slice(0, 1)
        };
        const newMarkup = `<div><p>The <span data-type="inline_dropdown" data-index="0" data-value="cow "></span> jumped <span data-type="inline_dropdown" data-index="1" data-value="over "></span> the <span data-type="inline_dropdown" data-index="2" data-value="moon "></span>.</p></div>`;

        w.instance().setState({ respAreaChoices: newChoices });
        w.instance().onChange(newMarkup);

        // TODO do we have to test what happens if clicking on OK/Cancel? How?
        expect(onModelChanged).not.toBeCalled();
      });

      it('No correct choice selected: slateMarkup and choices are updated', () => {
        const newChoices = {
          ...model.choices,
          '0': [
            {
              label: 'cow ',
              value: '0',
              correct: false
            },
            {
              label: 'dog ',
              value: '1',
              correct: false
            },
            {
              label: 'cat ',
              value: '2',
              correct: false
            }
          ]
        };
        const newMarkup = `<div><p>The <span data-type="inline_dropdown" data-index="0" data-value="cow "></span> jumped <span data-type="inline_dropdown" data-index="1" data-value="over "></span> the <span data-type="inline_dropdown" data-index="2" data-value="moon "></span>.</p></div>`;

        w.instance().setState({ respAreaChoices: newChoices });
        w.instance().onChange(newMarkup);

        // TODO do we have to test what happens if clicking on OK/Cancel? How?
        expect(onModelChanged).not.toBeCalled();
      });


      it('New choice: slateMarkup and choices are updated', () => {
        const newChoices = {
          ...model.choices,
          '0': [
            ...model.choices['0'],
            {
              label: 'pet ',
              value: '3',
              correct: false
            }]
        };
        const newMarkup = `<div><p>The <span data-type="inline_dropdown" data-index="0" data-value="cow "></span> jumped <span data-type="inline_dropdown" data-index="1" data-value="over "></span> the <span data-type="inline_dropdown" data-index="2" data-value="moon "></span>.</p></div>`;

        w.instance().setState({ respAreaChoices: newChoices });
        w.instance().onChange(newMarkup);

        expect(onModelChanged).toBeCalledWith({
          ...prepareModel(model),
          slateMarkup: newMarkup,
          choices: newChoices
        });
      });

      it('New Response Area: slateMarkup and choices are updated', () => {
        const oldModel = w.instance().props.model;
        const newChoices = {
          ...model.choices,
          '3': [
            {
              label: 'A ',
              value: '0',
              correct: true
            },
            {
              label: 'B',
              value: '1',
              correct: false
            },
            {
              label: 'C ',
              value: '2',
              correct: false
            }
          ]
        };
        const newMarkup = `<div><p>The <span data-type="inline_dropdown" data-index="0" data-value="cow "></span> jumped <span data-type="inline_dropdown" data-index="1" data-value="over "></span> the <span data-type="inline_dropdown" data-index="2" data-value="moon "></span>, <span data-type="inline_dropdown" data-index="3" data-value="A"></span>.</p></div>`;

        w.instance().setState({ respAreaChoices: newChoices });
        w.instance().onChange(newMarkup);

        expect(onModelChanged).toBeCalledWith({
          ...oldModel,
          slateMarkup: newMarkup,
          choices: newChoices
        });
      });

      it('Removing choices (keeping at least 2): slateMarkup and choices are updated', () => {
        const oldModel = w.instance().props.model;
        const newChoices = {
          ...model.choices,
          '0': model.choices['0'].slice(0, 2)
        };
        const newMarkup = `<div><p>The <span data-type="inline_dropdown" data-index="0" data-value="cow "></span> jumped <span data-type="inline_dropdown" data-index="1" data-value="over "></span> the <span data-type="inline_dropdown" data-index="2" data-value="moon "></span>.</p></div>`;

        w.instance().setState({ respAreaChoices: newChoices });
        w.instance().onChange(newMarkup);

        expect(onModelChanged).toBeCalledWith({
          ...oldModel,
          slateMarkup: newMarkup,
          choices: newChoices
        });
      });
    });

    describe('onAddChoice', () => {
      beforeEach(() => {
        w.instance().setState({ respAreaChoices: model.choices });
      });

      it('Does not add duplicates', () => {
        w.instance().onAddChoice('0', 'cow');

        expect(onModelChanged).not.toBeCalled();

        w.instance().onAddChoice('1', 'over');

        expect(onModelChanged).not.toBeCalled();

        w.instance().onAddChoice('1', 'under');

        expect(onModelChanged).not.toBeCalled();
      });

      it('Adds a new choice', () => {
        const currentModel = cloneDeep(w.instance().props.model);

        w.instance().onAddChoice('0', 'bird');

        expect(onModelChanged).toBeCalledWith({
          ...currentModel,
          choices: {
            ...currentModel.choices,
            '0': [
              ...currentModel.choices['0'],
              { label: 'bird', value: '3', correct: false }
            ]
          }
        });

        w.instance().onAddChoice('2', 'star');
        expect(onModelChanged).toBeCalledWith({
          ...currentModel,
          choices: {
            ...currentModel.choices,
            '0': [
              ...currentModel.choices['0'],
              { label: 'bird', value: '3', correct: false }
            ],
            '2': [
              ...currentModel.choices['2'],
              { label: 'star', value: '4', correct: false }
            ]
          }
        });
      });
    });

    describe('onRemoveChoice', () => {
      beforeEach(() => {
        w.instance().setState({
          respAreaChoices: {
            '0': [
              { label: 'cow ', value: '0', correct: true },
              { label: 'dog ', value: '1', correct: false },
              { label: 'cat ', value: '2', correct: false }
            ]
          }
        });
      });

      it('Removes choices', () => {
        w.instance().onRemoveChoice(0, '0');

        expect(onModelChanged).toBeCalledWith(
          expect.objectContaining({
            choices: {
              '0': [
                { label: 'dog ', value: '1', correct: false },
                { label: 'cat ', value: '2', correct: false }
              ]
            }
          })
        );

        w.instance().onRemoveChoice(0, '0');

        expect(onModelChanged).toBeCalledWith(
          expect.objectContaining({
            choices: {
              '0': [
                { label: 'cat ', value: '2', correct: false }
              ]
            }
          })
        );

        w.instance().onRemoveChoice(0, '0');

        expect(onModelChanged).toBeCalledWith(
          expect.objectContaining({
            choices: {
              '0': []
            }
          })
        );
      });
    });

    describe('onSelectChoice', () => {
      beforeEach(() => {
        w.instance().setState({
          respAreaChoices: {
            '0': [
              { label: 'cow ', value: '0', correct: true },
              { label: 'dog ', value: '1', correct: false },
              { label: 'cat ', value: '2', correct: false }
            ]
          }
        });
      });

      it('Updates correct choice', () => {
        w.instance().onSelectChoice(0, 1);

        expect(onModelChanged).toBeCalledWith(
          expect.objectContaining({
            choices: {
              '0': [
                { label: 'cow ', value: '0', correct: false },
                { label: 'dog ', value: '1', correct: true },
                { label: 'cat ', value: '2', correct: false }
              ]
            }
          })
        );

        w.instance().onSelectChoice(0, 0);

        expect(onModelChanged).toBeCalledWith(
          expect.objectContaining({
            choices: {
              '0': [
                { label: 'cow ', value: '0', correct: true },
                { label: 'dog ', value: '1', correct: false },
                { label: 'cat ', value: '2', correct: false }
              ]
            }
          })
        );
      })
    });
  });
});
