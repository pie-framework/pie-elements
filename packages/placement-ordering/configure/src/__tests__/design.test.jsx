import { render } from '@testing-library/react';
import React from 'react';
import _ from 'lodash';

import { get, set } from 'nested-property';
import { Design } from '../design';
import defaultValues from '../defaults';

jest.mock('@pie-lib/config-ui', () => ({
  FeedbackConfig: (props) => <div data-testid="feedback-config" />,
  FormSection: (props) => <div data-testid="form-section" />,
  InputContainer: (props) => <div data-testid="input-container" />,
  layout: {
    ConfigLayout: (props) => <div data-testid="config-layout">{props.children}</div>,
  },
  settings: {
    Panel: (props) => <div data-testid="settings-panel" onChange={props.onChange} />,
    toggle: jest.fn(),
    radio: jest.fn(),
    dropdown: jest.fn(),
  },
}));

jest.mock('nested-property', () => ({
  set: jest.fn((model, modelPath, v) => {
    model[modelPath] = v;

    return model;
  }),
  get: jest.fn((value, valuePath) => {
    switch (valuePath) {
      case 'value':
        return value[valuePath];
      case 'taget.value':
        return value.target.value;
      default:
        return value;
    }
  }),
}));

describe('Placement Ordering', () => {
  let onModelChanged;
  let onConfigurationChanged;
  let model;
  let configuration;

  beforeEach(() => {
    onModelChanged = jest.fn();
    onConfigurationChanged = jest.fn();
    model = _.cloneDeep(defaultValues.model);
    configuration = _.cloneDeep(defaultValues.configuration);
  });

  describe('logic', () => {
    let instance;
    let modelFn;

    const createInstance = (extras = {}) => {
      const defaults = {
        classes: {},
        className: 'className',
        onModelChanged,
        onConfigurationChanged,
        model,
        configuration,
      };
      const props = { ...defaults, ...extras };
      const inst = new Design(props);
      inst.setState = jest.fn((state, callback) => {
        Object.assign(inst.state, typeof state === 'function' ? state(inst.state) : state);
        if (callback) callback();
      });
      return inst;
    };

    beforeEach(() => {
      instance = createInstance();
    });

    describe('applyUpdate', () => {
      beforeEach(() => {
        modelFn = jest.fn().mockReturnValue({
          ...model,
          prompt: 'Updated Item Stem',
        });

        instance.applyUpdate(modelFn);
      });

      it('calls onModelChanged with updated item stem value', () => {
        expect(onModelChanged).toHaveBeenCalledWith({
          ...model,
          prompt: 'Updated Item Stem',
        });
      });
    });

    describe('changeHandler', () => {
      let change;

      beforeEach(() => {
        change = (modelPath, valuePath, value) => {
          const onChoiceAreaLabelChange = instance.changeHandler(modelPath, valuePath);

          onChoiceAreaLabelChange(value);
        };
      });

      it('calls onModelChanged with updated item stem', () => {
        const modelPath = 'prompt';
        const value = 'Updated Choice Area Label';

        change(modelPath, undefined, value);

        expect(onModelChanged).toHaveBeenCalledWith({
          ...model,
          [modelPath]: value,
        });
      });

      it('calls onModelChanged with updated item stem', () => {
        const modelPath = 'teacherInstructions';
        const value = 'Updated Choice Area Label';

        change(modelPath, undefined, value);

        expect(onModelChanged).toHaveBeenCalledWith({
          ...model,
          [modelPath]: value,
        });
      });

      it('calls onModelChanged with updated choice area label', () => {
        const modelPath = 'choiceLabel';
        const valuePath = 'value';
        const value = 'Updated Choice Area Label';

        change(modelPath, valuePath, { value });

        expect(onModelChanged).toHaveBeenCalledWith({
          ...model,
          [modelPath]: value,
        });
      });

      it('calls onModelChanged with updated answer area label', () => {
        const modelPath = 'targetLabel';
        const valuePath = 'value';
        const value = 'Updated Answer Area Label';

        change(modelPath, valuePath, { value });

        expect(onModelChanged).toHaveBeenCalledWith({
          ...model,
          [modelPath]: value,
        });
      });

      it('calls onModelChanged with updated feedback', () => {
        const modelPath = 'feedback';
        const value = {};

        change(modelPath, undefined, value);

        expect(onModelChanged).toHaveBeenCalledWith({
          ...model,
          [modelPath]: value,
        });
      });
    });

    describe('onPromptChange', () => {
      it('calls update model when prompt changes', () => {
        let newItemStem = 'New item stem';

        instance.onPromptChange(newItemStem);

        expect(onModelChanged).toBeCalledWith({
          ...model,
          prompt: newItemStem,
        });
      });
    });

    describe('onRationaleChange', () => {
      it('calls update model when prompt changes', () => {
        let newRationale = 'New Rationale';

        instance.onRationaleChange(newRationale);

        expect(onModelChanged).toBeCalledWith({
          ...model,
          rationale: newRationale,
        });
      });
    });

    describe('onChoiceAreaLabelChange', () => {
      it('calls update model when choice area label changes', () => {
        let newChoiceAreaLabel = 'New Choice Area Label';

        instance.onChoiceAreaLabelChange(newChoiceAreaLabel);

        expect(onModelChanged).toBeCalledWith({
          ...model,
          choiceLabel: newChoiceAreaLabel,
        });
      });
    });

    describe('onAnswerAreaLabelChange', () => {
      it('calls update model when answer area label changes', () => {
        let newAnswerAreaLabel = 'New Answer Area Label';

        instance.onAnswerAreaLabelChange(newAnswerAreaLabel);

        expect(onModelChanged).toBeCalledWith({
          ...model,
          targetLabel: newAnswerAreaLabel,
        });
      });
    });

    describe('onFeedbackChange', () => {
      it('calls update model when feedback changes', () => {
        let newFeedback = {
          correct: {
            type: 'custom',
            custom: 'CORRECT',
          },
          incorrect: {
            type: 'custom',
            custom: 'INCORRECT',
          },
          partial: {
            type: 'custom',
            custom: 'PARTIAL',
          },
        };

        instance.onFeedbackChange(newFeedback);

        expect(onModelChanged).toBeCalledWith({
          ...model,
          feedback: newFeedback,
        });
      });
    });

    describe('onChoiceEditorChange', () => {
      it('calls update model when choices array changes', () => {
        let choices = [
          { id: 'c1', label: 'Choice 1' },
          { id: 'c2', label: 'Choice 2' },
        ];
        let correctResponse = [{ id: 'c2' }, { id: 'c1' }];

        instance.onChoiceEditorChange(choices, correctResponse);

        expect(onModelChanged).toBeCalledWith({
          ...model,
          choices,
          correctResponse,
        });
      });
    });

    describe('onSettingsChange', () => {
      it('renders with config layout', () => {
        const { container } = render(
          <Design
            model={model}
            configuration={configuration}
            classes={{}}
            className={'className'}
            onModelChanged={onModelChanged}
            onConfigurationChanged={onConfigurationChanged}
          />,
        );

        // Check that ConfigLayout renders
        const configLayout = container.querySelector('[data-testid="config-layout"]');
        expect(configLayout).toBeInTheDocument();
      });
    });
  });
});
