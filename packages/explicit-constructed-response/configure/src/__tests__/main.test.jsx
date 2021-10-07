import { shallow } from 'enzyme';
import React from 'react';

import { Main } from '../main';
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
  markup: '<p>The {{0}} jumped {{1}} the {{2}}</p>',
  disabled: false,
  choices: {
    0: [{ label: 'cow', value: '0' }, { label: 'cattle', value: '1' }, { label: 'calf', value: '2' }],
    1: [{ label: 'over', value: '0' }, { label: 'past', value: '1' }, { label: 'beyond', value: '2' }],
    2: [{ label: 'moon', value: '0' }]
  },
  maxChoicesLength: [6, 6, 4],
  prompt: 'Complete the sentence',
};

const prepareModel = (model = {}) => {
  const joinedObj = {
    ...sensibleDefaults.model,
    ...model,
  };
  const slateMarkup = joinedObj.slateMarkup || createSlateMarkup(joinedObj.markup, joinedObj.choices);
  const processedMarkup = processMarkup(slateMarkup);

  return {
    ...joinedObj,
    slateMarkup,
    markup: processedMarkup
  };
};

describe('Main', () => {
  let onModelChanged = jest.fn();
  let onConfigurationChanged = jest.fn();

  const wrapper = extras => {
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

    return shallow(<Main {...props} />);
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

    describe('onResponsesChanged', () => {
      it('changes choices and slateMarkup as well', () => {
        const newChoices = {
          0: [{ label: 'cow', value: '0' }, { label: 'cattle', value: '1' }, { label: 'calf', value: '2' }],
          1: [{ label: 'over', value: '0' }, { label: 'past', value: '1' }, { label: 'beyond', value: '2' }],
          2: [{ label: 'sun', value: '0' }]
        };

        w.instance().onResponsesChanged(newChoices);

        expect(onModelChanged).toBeCalledWith({
          ...prepareModel(model),
          choices: newChoices
        });
      });
    });

    describe('onChangeResponse', () => {
      it('with new area', () => {
        const wr = wrapper();

        wr.instance().onChangeResponse(3);

        expect(onModelChanged).toBeCalledWith({
          ...prepareModel(model),
          choices: {
            ...model.choices,
            3: [{ label: '', value: '0' }]
          }
        });
      });

      it('with existing area', () => {
        const wr = wrapper();

        wr.instance().onChangeResponse(1, 'under');

        expect(onModelChanged).toBeCalledWith(expect.objectContaining({
          choices: expect.objectContaining({
            1: [
              { label: 'under', value: '0' },
              { label: 'past', value: '1' },
              { label: 'beyond', value: '2' }
            ]
          })
        }));
      });
    });

    describe('onChange', () => {
      let wr;

      beforeEach(() => {
        wr = wrapper({
          choices: {
            0: [{label: 'cow', value: '0'}, {label: 'cattle', value: '1'}, {label: 'calf', value: '2'}],
            1: [{label: 'over', value: '0'}, {label: 'past', value: '1'}, {label: 'beyond', value: '2'}],
            2: [{label: 'moon', value: '0'}]
          },
        });
      });

      it('slateMarkup and choices are updated', () => {
        const newMarkup = `<p>The <span data-type="explicit_constructed_response" data-index="0" data-value="cow"></span> jumped <span data-type="explicit_constructed_response" data-index="1" data-value="over"></span> the <span data-type="explicit_constructed_response" data-index="2" data-value="moon"></span>and <span data-type="explicit_constructed_response" data-index="3"></span></p>`;

        wr.instance().onChange(newMarkup);

        expect(onModelChanged).toBeCalledWith({
          ...prepareModel(model),
          slateMarkup: newMarkup,
          choices: expect.objectContaining({
            3: [{ label: '', value: '0' }]
          })
        });
      });

      it('slateMarkup and choices are updated', () => {
        const newMarkup = `<p>The <span data-type="explicit_constructed_response" data-index="0" data-value="cow"></span> jumped <span data-type="explicit_constructed_response" data-index="1" data-value="over"></span> the <span data-type="explicit_constructed_response" data-index="2" data-value="moon"></span>and <span data-type="explicit_constructed_response" data-index="3" data-value="test"></span></p>`;
        wr.instance().onChange(newMarkup);

        setTimeout(() => expect(onModelChanged).toBeCalledWith({
          ...prepareModel(model),
          slateMarkup: newMarkup,
          choices: expect.objectContaining({
            3: [{ label: 'test', value: '0' }]
          })
        }) , 10);
      });

      it('slateMarkup and choices are updated', () => {
        const newMarkup = `<p>The <span data-type="explicit_constructed_response" data-index="0" data-value="rabbit"></span> jumped <span data-type="explicit_constructed_response" data-index="1" data-value="over"></span> the <span data-type="explicit_constructed_response" data-index="2" data-value="moon"></span>and <span data-type="explicit_constructed_response" data-index="3" data-value="test"></span></p>`;

        wr.instance().onChange(newMarkup);

        setTimeout(() => expect(onModelChanged).toBeCalledWith({
          ...prepareModel(model),
          slateMarkup: newMarkup,
          choices: expect.objectContaining({
            0: [{ label: 'rabbit', value: '0' }, { label: 'cattle', value: '1' }, { label: 'calf', value: '2' }]
          })
        }), 10);
      });
    });
  });
});
