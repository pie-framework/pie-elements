import { shallow } from 'enzyme';
import React from 'react';
import lodash from 'lodash';

import Design from '../design';
import defaultValues from '../defaultConfiguration';

import { shallowChild } from '@pie-lib/test-utils';
import { TwoChoice, FeedbackConfig, FormSection, InputCheckbox, InputContainer} from '@pie-lib/config-ui';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { ChoiceType } from '../choice-type';

jest.mock('@pie-lib/config-ui', () => {
  return {
    TwoChoice: props => (<div/>),
    FeedbackConfig: props => (<div/>),
    FormSection: props => (<div/>),
    InputCheckbox: props => (<div/>),
    InputContainer: props => (<div/>),
  };
});

describe('rendering', () => {
  let onChange;
  let onModelChange;
  let model;
  let props;

  beforeEach(() => {
    onChange = jest.fn();
    onModelChange = jest.fn();
    model = lodash.cloneDeep(defaultValues);

    props = (model) => ({
      model,
      config: defaultValues.configure,
      onChange: jest.fn(),
      onModelChange: jest.fn()
    });

  });

  describe('renders settings', () => {
    it('renders all', () => {
      const wrapper = shallowChild(Design, props(model), 1)();

      expect(wrapper.find(InputContainer).length).toEqual(3);
      expect(wrapper.find(FormControlLabel).length).toEqual(6);
      expect(wrapper.find(ChoiceType).length).toEqual(1);

      expect(wrapper.find(FeedbackConfig).length).toEqual(1);
    });

    it('does not render item stem input', () => {
      model.configure.settingsItemStemChange = false;
      const wrapper = shallowChild(Design, props(model), 1)();

      expect(wrapper.find(InputContainer).length).toEqual(2);
    });

    it('renders choice label input', () => {
      model.configure.editableChoiceLabel = true;
      const wrapper = shallowChild(Design, props(model), 1)();

      expect(wrapper.find(InputContainer).length).toEqual(4);

    });

    it('does not render answer label input', () => {
      model.configure.settingsPlacementAreaLabel = false;
      const wrapper = shallowChild(Design, props(model), 1)();

      expect(wrapper.find(InputContainer).length).toEqual(2);
    });

    it('does not render choices inputs', () => {
      model.configure.settingsChoicesLabel = false;
      const wrapper = shallowChild(Design, props(model), 1)();

      expect(wrapper.find(InputContainer).length).toEqual(2);
    });

    it('does not render choice label switch', () => {
      model.configure.settingsChoiceLabel = false;
      const wrapper = shallowChild(Design, props(model), 1)();

      expect(wrapper.find(FormControlLabel).length).toEqual(5);
    });

    it('does not render shuffle switch', () => {
      model.configure.settingsShuffle = false;
      const wrapper = shallowChild(Design, props(model), 1)();

      expect(wrapper.find(FormControlLabel).length).toEqual(5);
    });

    it('does not render placement area switch', () => {
      model.configure.settingsPlacementArea = false;
      const wrapper = shallowChild(Design, props(model), 1)();

      expect(wrapper.find(FormControlLabel).length).toEqual(5);
    });

    it('does not render numbered guides switch because of placement area', () => {
      model.placementArea = false;
      const wrapper = shallowChild(Design, props(model), 1)();

      expect(wrapper.find(FormControlLabel).length).toEqual(5);
    });

    it('does not render numbered guides switch', () => {
      model.configure.settingsNumberedGuides = false;
      const wrapper = shallowChild(Design, props(model), 1)();

      expect(wrapper.find(FormControlLabel).length).toEqual(5);
    });

    it('does not render enable images switch', () => {
      model.configure.settingsEnableImages = false;
      const wrapper = shallowChild(Design, props(model), 1)();

      expect(wrapper.find(FormControlLabel).length).toEqual(5);
    });

    it('does not render remove tiles after placing switch', () => {
      model.configure.settingsRemoveTileAfterPlacing = true;
      const wrapper = shallowChild(Design, props(model), 1)();

      expect(wrapper.find(FormControlLabel).length).toEqual(7);
    });

    it('does not render partial scoring guides switch', () => {
      model.configure.settingsPartialScoring = false;
      const wrapper = shallowChild(Design, props(model), 1)();

      expect(wrapper.find(FormControlLabel).length).toEqual(5);
    });

    it('does not render orientation', () => {
      model.configure.settingsOrientation = false;
      const wrapper = shallowChild(Design, props(model), 1)();

      expect(wrapper.find(ChoiceType).length).toEqual(0);
    });
  });
});


describe('design', () => {
  let w;
  let onChange;
  let onModelChange;

  const getModel = () => Object.assign({}, defaultValues);

  beforeEach(() => {
    onChange = jest.fn();
    onModelChange = jest.fn();
    w = shallow(
      <Design
        model={getModel()}
        classes={{}}
        className={'foo'}
        onChange={onChange}
        onModelChange={onModelChange}
      />
    );
  });

  describe('snapshot', () => {
    it('renders all items with defaultProps', () => {
      expect(w).toMatchSnapshot();
    });

    it('renders all items except feedback', () => {
      const defaultModel = getModel();

      defaultModel.configure.settingsFeedback = false;

      const wrapper = shallow(
        <Design
          model={defaultModel}
          classes={{}}
          className={'foo'}
          onChange={onChange}
          onModelChange={onModelChange}
        />
      );

      expect(wrapper).toMatchSnapshot();
    });

    it('renders all items except the item stem input', () => {
      const defaultModel = getModel();

      defaultModel.configure.settingsItemStemChange = false;

      const wrapper = shallow(
        <Design
          model={defaultModel}
          classes={{}}
          className={'foo'}
          onChange={onChange}
          onModelChange={onModelChange}
        />
      );

      expect(wrapper).toMatchSnapshot();
    });
  });
});

