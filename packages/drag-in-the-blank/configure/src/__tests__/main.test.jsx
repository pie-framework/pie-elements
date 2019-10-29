import { shallow } from 'enzyme';
import React from 'react';

import { Main } from '../main';
import sensibleDefaults from "../defaults";
import { createSlateMarkup, processMarkup } from "../markupUtils";

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
  markup: '{{0}} + {{1}} = 15',
  prompt: '<p>Solve the equation below.</p>',
  shuffle: true,
  choices: [
    { value: '<div>6</div>', id: '0' },
    { value: '<div>9</div>', id: '1' }
  ],
  choicesPosition: 'below',
  correctResponse: {
    '0': '0',
    '1': '1'
  },
  duplicates: true,
  alternateResponses: [
    ['1'],
    ['0']
  ],
  rationale: '<p>A correct response is shown below:</p><ul><li>2/6 = 1/3</li><li>4/8 = 1/2</li><li>6/10 = 3/5</li><li>9/12 = 3/4</li></ul>'
};

const prepareModel = (model = {}) => {
  const joinedObj = {
    ...sensibleDefaults.model,
    ...model
  };
  const slateMarkup = model.slateMarkup ||
    createSlateMarkup(joinedObj.markup, joinedObj.choices, joinedObj.correctResponse);
  const processedMarkup = processMarkup(slateMarkup);

  return {
    ...joinedObj,
    slateMarkup,
    markup: processedMarkup.markup,
    correctResponse: processedMarkup.correctResponse
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
        const slateMarkup = '<span data-type="drag_in_the_blank" data-index="0" data-id="0" data-value="&lt;div&gt;6&lt;/div&gt;"></span> + <span data-type="drag_in_the_blank" data-index="1" data-id="1" data-value="&lt;div&gt;9&lt;/div&gt;"></span> = 15eggs';

        w.instance().onMarkupChanged(slateMarkup);

        expect(onModelChanged).toBeCalledWith({
          ...prepareModel(model),
          slateMarkup
        });
      });
    });

    describe('onResponsesChanged', () => {
      it('changes choices and slateMarkup as well', () => {
        const newChoices = [
          { value: '<div>6</div>', id: '0' },
          { value: '<div>3^2</div>', id: '1' }
        ];

        w.instance().onResponsesChanged(newChoices);

        expect(onModelChanged).toBeCalledWith({
          ...prepareModel(model),
          slateMarkup: '<span data-type="drag_in_the_blank" data-index="0" data-id="0" data-value="&lt;div&gt;6&lt;/div&gt;"></span> + <span data-type="drag_in_the_blank" data-index="1" data-id="1" data-value="&lt;div&gt;3^2&lt;/div&gt;"></span> = 15',
          choices: newChoices
        });
      });
    });
  });
});
