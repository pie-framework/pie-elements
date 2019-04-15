import { shallow } from 'enzyme';
import React from 'react';
import _ from 'lodash';

import {
  TwoChoice,
  FeedbackConfig,
  FormSection,
  InputCheckbox,
  InputContainer,
} from '@pie-lib/config-ui';
import { get, set } from 'nested-property';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Design } from '../design';
import defaultValues from '../defaults';
import { ChoiceType } from '../choice-type';

jest.mock('@pie-lib/config-ui', () => ({
  TwoChoice: props => (<div/>),
  FeedbackConfig: props => (<div/>),
  FormSection: props => (<div/>),
  InputCheckbox: props => (<div/>),
  InputContainer: props => (<div/>),
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
  let updateModel;
  let model;

  beforeEach(() => {
    updateModel = jest.fn();
    model = _.cloneDeep(defaultValues);
  });

  describe('snapshot', () => {
    it ('renders all default items', () => {
      const wrapper = shallow(
        <Design
          model={model}
          classes={{}}
          className={'foo'}
          updateModel={updateModel}
        />
      );

      expect(wrapper).toMatchSnapshot();
    });

    it ('renders custom items', () => {
      model.configure.editableItemStem = false;
      model.configure.settingsRemoveTileAfterPlacing = true;

      const wrapper = shallow(
        <Design
          model={model}
          classes={{}}
          className={'foo'}
          updateModel={updateModel}
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
          updateModel,
          model
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
          itemStem: 'Updated Item Stem'
        });

        w.instance().applyUpdate(modelFn);
      });

      it('calls updateModel with updated item stem value', () => {
        expect(updateModel).toHaveBeenCalledWith({
          ...model,
          itemStem: 'Updated Item Stem'
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

      it('calls updateModel with updated item stem', () => {
        const modelPath = 'itemStem';
        const value = 'Updated Choice Area Label';

        change(modelPath, undefined, value);

        expect(updateModel).toHaveBeenCalledWith({
          ...model,
          [modelPath]: value
        });
      });

      it('calls updateModel with updated choice area label', () => {
        const modelPath = 'choiceLabel';
        const valuePath = 'value';
        const value = 'Updated Choice Area Label';

        change(modelPath, valuePath, { value });

        expect(updateModel).toHaveBeenCalledWith({
          ...model,
          [modelPath]: value
        });
      });

      it('calls updateModel with updated answer area label', () => {
        const modelPath = 'targetLabel';
        const valuePath = 'value';
        const value = 'Updated Answer Area Label';

        change(modelPath, valuePath, { value });

        expect(updateModel).toHaveBeenCalledWith({
          ...model,
          [modelPath]: value
        });
      });

      it('calls updateModel with updated feedback', () => {
        const modelPath = 'feedback';
        const value = {};

        change(modelPath, undefined, value);

        expect(updateModel).toHaveBeenCalledWith({
          ...model,
          [modelPath]: value
        });
      });
    });

    describe('onPromptChange', () => {
      it('calls update model when prompt changes', () => {
        let newItemStem = 'New item stem';

        w.instance().onPromptChange(newItemStem);

        expect(updateModel).toBeCalledWith({
          ...model,
          itemStem: newItemStem
        });
      });
    });

    describe('onChoiceAreaLabelChange', () => {
      it('calls update model when choice area label changes', () => {
        let newChoiceAreaLabel = 'New Choice Area Label';

        w.instance().onChoiceAreaLabelChange(newChoiceAreaLabel);

        expect(updateModel).toBeCalledWith({
          ...model,
          choiceLabel: newChoiceAreaLabel
        });
      });
    });

    describe('onAnswerAreaLabelChange', () => {
      it('calls update model when answer area label changes', () => {
        let newAnswerAreaLabel = 'New Answer Area Label';

        w.instance().onAnswerAreaLabelChange(newAnswerAreaLabel);

        expect(updateModel).toBeCalledWith({
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

        expect(updateModel).toBeCalledWith({
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

        expect(updateModel).toBeCalledWith({
          ...model,
          choices,
          correctResponse
        });
      });
    });

    describe('onSettingsChange', () => {
      it('calls update model when settings switches are toggled', () => {
        const formControls = w.find(FormControlLabel);

        formControls.forEach(fC => {
          fC.props().control.props.onChange(fC.props());

          expect(updateModel).toBeCalled();
        });
      });

      it('calls update model when orientation setting is changed', () => {
        const choiceType = w.find(ChoiceType);
        choiceType.props().onChange('horizontal');

        expect(updateModel).toBeCalledWith({
          ...model,
          choicesOrientation: 'horizontal'
        });
      });
    });
  })
});



