import { render, shallow } from 'enzyme';
import React from 'react';
import lodash from 'lodash';

import Design from '../design';
import defaultValues from '../defaultConfiguration';

jest.mock('@material-ui/core/FormControlLabel', () => {
  return props => (
    <div
      className="formControlLabel"
      style={props.style}
      label={props.label}
    />
  );
});

jest.mock('@pie-lib/config-ui', () => {
  return {
    TwoChoice: props => (
      <div
        className="twoChoice"
        style={props.style}
      />
    ),
    FeedbackConfig: props => (
      <div
        className="feedbackConfig"
        style={props.style}
      />
    ),
    FormSection: props => (
      <div
        className="formSection"
        style={props.style}
        {...props}
      />
    ),
    InputCheckbox: props => (
      <div
        className="inputCheckbox"
        style={props.style}
      />
    ),
    InputContainer: props => (
      <div
        className="inputContainer"
        style={props.style}
        label={props.label}
      />
    ),
  };
});

describe('rendering', () => {
  let onChange;
  let onModelChange;
  let model;
  let renderWrapper;

  beforeEach(() => {
    onChange = jest.fn();
    onModelChange = jest.fn();
    model = lodash.cloneDeep(defaultValues);

    renderWrapper = model => render(
      <Design
        model={model}
        classes={{}}
        className={'foo'}
        onChange={onChange}
        onModelChange={onModelChange}
      />
    )
  });

  describe('renders settings', () => {
    it('renders all', () => {
      const wrapper = renderWrapper(model);

      expect(wrapper.find('.inputContainer[label="ITEM STEM"]').length).toEqual(1);
      expect(wrapper.find('.inputContainer[label="CHOICE LABEL"]').length).toEqual(0);
      expect(wrapper.find('.inputContainer[label="ANSWER LABEL"]').length).toEqual(1);
      expect(wrapper.find('.inputContainer[label="CHOICES"]').length).toEqual(1);
      expect(wrapper.find('.feedbackConfig').length).toEqual(1);


      expect(wrapper.find('.formControlLabel[label="Choice label"]').length).toEqual(1);
      expect(wrapper.find('.formControlLabel[label="Shuffle Choices"]').length).toEqual(1);
      expect(wrapper.find('.formControlLabel[label="Placement Area"]').length).toEqual(1);
      expect(wrapper.find('.formControlLabel[label="Numbered Guides"]').length).toEqual(1);
      expect(wrapper.find('.formControlLabel[label="Enable Images"]').length).toEqual(1);
      expect(wrapper.find('.formControlLabel[label="Remove tiles after placing"]').length).toEqual(0);
      expect(wrapper.find('.twoChoice').length).toEqual(1);

      expect(wrapper.find('.formControlLabel[label="Partial Scoring"]').length).toEqual(1);
    });

    it('does not render item stem input', () => {
      model.configure.settingsItemStemChange = false;
      const wrapper = renderWrapper(model);

      expect(wrapper.find('.inputContainer[label="ITEM STEM"]').length).toEqual(0);
    });

    it('renders choice label input', () => {
      model.configure.editableChoiceLabel = true;
      const wrapper = renderWrapper(model);

      expect(wrapper.find('.inputContainer[label="CHOICE LABEL"]').length).toEqual(1);

    });

    it('does not render answer label input', () => {
      model.configure.settingsPlacementAreaLabel = false;
      const wrapper = renderWrapper(model);

      expect(wrapper.find('.inputContainer[label="ANSWER LABEL"]').length).toEqual(0);
    });

    it('does not render choices inputs', () => {
      model.configure.settingsChoicesLabel = false;
      const wrapper = renderWrapper(model);

      expect(wrapper.find('.inputContainer[label="CHOICES"]').length).toEqual(0);
    });

    it('does not render choice label switch', () => {
      model.configure.settingsChoiceLabel = false;
      const wrapper = renderWrapper(model);

      expect(wrapper.find('.formControlLabel[label="Choice label"]').length).toEqual(0);
    });

    it('does not render shuffle switch', () => {
      model.configure.settingsShuffle = false;
      const wrapper = renderWrapper(model);

      expect(wrapper.find('.formControlLabel[label="Shuffle Choices"]').length).toEqual(0);
    });

    it('does not render placement area switch', () => {
      model.configure.settingsPlacementArea = false;
      const wrapper = renderWrapper(model);

      expect(wrapper.find('.formControlLabel[label="Placement Area"]').length).toEqual(0);
    });

    it('does not render numbered guides switch because of placement area', () => {
      model.placementArea = false;
      const wrapper = renderWrapper(model);

      expect(wrapper.find('.formControlLabel[label="Numbered Guides"]').length).toEqual(0);
    });

    it('does not render numbered guides switch', () => {
      model.configure.settingsNumberedGuides = false;
      const wrapper = renderWrapper(model);

      expect(wrapper.find('.formControlLabel[label="Numbered Guides"]').length).toEqual(0);
    });

    it('does not render enable images switch', () => {
      model.configure.settingsEnableImages = false;
      const wrapper = renderWrapper(model);

      expect(wrapper.find('.formControlLabel[label="Enable Images"]').length).toEqual(0);
    });

    it('does not render remove tiles after placing switch', () => {
      model.configure.settingsRemoveTileAfterPlacing = true;
      const wrapper = renderWrapper(model);

      expect(wrapper.find('.formControlLabel[label="Remove tiles after placing"]').length).toEqual(1);
    });

    it('does not render partial scoring guides switch', () => {
      model.configure.settingsPartialScoring = false;
      const wrapper = renderWrapper(model);

      expect(wrapper.find('.formControlLabel[label="Partial Scoring"]').length).toEqual(0);
    });

    it('does not render orientation', () => {
      model.configure.settingsOrientation = false;
      const wrapper = renderWrapper(model);

      expect(wrapper.find('.twoChoice').length).toEqual(0);
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
