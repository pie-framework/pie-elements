import { shallow } from 'enzyme';
import React from 'react';
import _ from 'lodash';

import { get, set } from 'nested-property';
import { Design } from '../design';
import defaultValues from '../defaults';

jest.mock('@pie-lib/config-ui', () => ({
  FeedbackConfig: props => (<div/>),
  FormSection: props => (<div/>),
  InputContainer: props => (<div/>),
  layout: {
    ConfigLayout: props => <div>{props.children}</div>
  },
  settings: {
    Panel: props => <div onChange={props.onChange} />,
    toggle: jest.fn(),
    radio: jest.fn()
  }
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

  describe('snapshot', () => {
    it ('renders all default items', () => {
      const wrapper = shallow(
        <Design
          model={model}
          configuration={configuration}
          classes={{}}
          className={'foo'}
          onModelChanged={onModelChanged}
          onConfigurationChanged={onConfigurationChanged}
        />
      );

      expect(wrapper).toMatchSnapshot();
    });

    it ('renders custom items', () => {
      configuration.prompt.settings = false;
      configuration.removeTilesAfterPlacing.settings = true;

      const wrapper = shallow(
        <Design
          model={model}
          configuration={configuration}
          classes={{}}
          className={'foo'}
          onModelChanged={onModelChanged}
          onConfigurationChanged={onConfigurationChanged}
        />
      );

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    let w;
    let modelFn;

    beforeEach(() => {
      const wrapper = (extras) => {
        const defaults = {
          classes: {},
          className: 'className',
          onModelChanged,
          onConfigurationChanged,
          model,
          configuration
        };
        const props = { ...defaults, ...extras };

        return shallow(<Design {...props} />);
      };

      w = wrapper();
    });
    
    describe('applyUpdate', () => {
      beforeEach(() => {
        modelFn = jest.fn().mockReturnValue({
          ...model,
          prompt: 'Updated Item Stem'
        });

        w.instance().applyUpdate(modelFn);
      });

      it('calls onModelChanged with updated item stem value', () => {
        expect(onModelChanged).toHaveBeenCalledWith({
          ...model,
          prompt: 'Updated Item Stem'
        });
      });
    });

    describe('changeHandler', () => {
      let change;

      beforeEach(() => {
        change = (modelPath, valuePath, value) => {
          const onChoiceAreaLabelChange = w.instance().changeHandler(modelPath, valuePath);

          onChoiceAreaLabelChange(value);
        }
      });

      it('calls onModelChanged with updated item stem', () => {
        const modelPath = 'prompt';
        const value = 'Updated Choice Area Label';

        change(modelPath, undefined, value);

        expect(onModelChanged).toHaveBeenCalledWith({
          ...model,
          [modelPath]: value
        });
      });

      it('calls onModelChanged with updated choice area label', () => {
        const modelPath = 'choiceLabel';
        const valuePath = 'value';
        const value = 'Updated Choice Area Label';

        change(modelPath, valuePath, { value });

        expect(onModelChanged).toHaveBeenCalledWith({
          ...model,
          [modelPath]: value
        });
      });

      it('calls onModelChanged with updated answer area label', () => {
        const modelPath = 'targetLabel';
        const valuePath = 'value';
        const value = 'Updated Answer Area Label';

        change(modelPath, valuePath, { value });

        expect(onModelChanged).toHaveBeenCalledWith({
          ...model,
          [modelPath]: value
        });
      });

      it('calls onModelChanged with updated feedback', () => {
        const modelPath = 'feedback';
        const value = {};

        change(modelPath, undefined, value);

        expect(onModelChanged).toHaveBeenCalledWith({
          ...model,
          [modelPath]: value
        });
      });
    });

    describe('onPromptChange', () => {
      it('calls update model when prompt changes', () => {
        let newItemStem = 'New item stem';

        w.instance().onPromptChange(newItemStem);

        expect(onModelChanged).toBeCalledWith({
          ...model,
          prompt: newItemStem
        });
      });
    });

    describe('onChoiceAreaLabelChange', () => {
      it('calls update model when choice area label changes', () => {
        let newChoiceAreaLabel = 'New Choice Area Label';

        w.instance().onChoiceAreaLabelChange(newChoiceAreaLabel);

        expect(onModelChanged).toBeCalledWith({
          ...model,
          choiceLabel: newChoiceAreaLabel
        });
      });
    });

    describe('onAnswerAreaLabelChange', () => {
      it('calls update model when answer area label changes', () => {
        let newAnswerAreaLabel = 'New Answer Area Label';

        w.instance().onAnswerAreaLabelChange(newAnswerAreaLabel);

        expect(onModelChanged).toBeCalledWith({
          ...model,
          targetLabel: newAnswerAreaLabel
        });
      });
    });

    describe('onFeedbackChange', () => {
      it('calls update model when feedback changes', () => {
        let newFeedback = {
          correct: {
            type: 'custom',
            custom: 'CORRECT'
          },
          incorrect: {
            type: 'custom',
            custom: 'INCORRECT'
          },
          partial: {
            type: 'custom',
            custom: 'PARTIAL'
          }
        };

        w.instance().onFeedbackChange(newFeedback);

        expect(onModelChanged).toBeCalledWith({
          ...model,
          feedback: newFeedback
        });
      });
    });

    describe('onChoiceEditorChange', () => {
      it('calls update model when choices array changes', () => {
        let choices = [
          { id: 'c1', label: 'Choice 1' },
          { id: 'c2', label: 'Choice 2' }
        ];
        let correctResponse = [
          { id: 'c2' },
          { id: 'c1' }
        ];

        w.instance().onChoiceEditorChange(choices, correctResponse);

        expect(onModelChanged).toBeCalledWith({
          ...model,
          choices,
          correctResponse
        });
      });
    });

    describe('onSettingsChange', () => {
      it('calls update model when settings call onChangeModel function', () => {
        w.find('ConfigLayout').props().settings.props.onChangeModel();

        expect(onModelChanged).toBeCalled();
      });

      it('calls onConfigurationChanged when settings call onChangeConfiguration function', () => {
        w.find('ConfigLayout').props().settings.props.onChangeConfiguration();

        expect(onConfigurationChanged).toBeCalled();
      });

    });
  })
});



