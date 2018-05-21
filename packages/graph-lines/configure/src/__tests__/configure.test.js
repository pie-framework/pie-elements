import * as React from 'react';
import Configure from '../configure';
import GeneralConfigBlock from '../general-config-block';
import PartialScoringConfig from '@pie-lib/scoring-config';
import Input from 'material-ui/Input';
import Button from 'material-ui/Button';
import { InputRadio, InputCheckbox, InputContainer } from '@pie-lib/config-ui';
import { FeedbackConfig } from '@pie-lib/config-ui';
import PointConfig from '../point-config';
import Box from '../box';
import DeleteControl from '../delete';
import AddControl from '../add-point';
import { shallowChild } from '@pie-lib/test-utils';

const defaultProps = {
  model: {
    id: '1',
    element: 'graph-lines',
    //below is the legacy corespring point intercept model...
    minimumWidth: 500,
    correctResponse: ['0,0', '1,1', '2,2', '3,3'],
    partialScoring: [],
    feedback: {
      correctFeedbackType: 'none',
      correctFeedbackValue: '',
      partialFeedbackType: 'none',
      partialFeedbackValue: '',
      incorrectFeedbackType: 'none',
      incorrectFeedbackValue: '',
    },
    model: {
      config: {
        graphTitle: '',
        graphWidth: 500,
        graphHeight: 500,
        maxPoints: '',
        labelsType: 'present',
        pointLabels: ['A', 'B', 'C', 'D'],
        domainLabel: '',
        domainMin: -10,
        domainMax: 10,
        domainStepValue: 1,
        domainSnapValue: 1,
        domainLabelFrequency: 1,
        domainGraphPadding: 50,
        rangeLabel: '',
        rangeMin: -10,
        rangeMax: 10,
        rangeStepValue: 1,
        rangeSnapValue: 1,
        rangeLabelFrequency: 1,
        rangeGraphPadding: 50,
        sigfigs: -1,
        allowPartialScoring: false,
        pointsMustMatchLabels: false,
        showCoordinates: false,
        showPointLabels: true,
        showInputs: true,
        showAxisLabels: true,
        showFeedback: true
      }
    }
  }
};

describe('Configure', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowChild(Configure, defaultProps, 2);
  });

  it('renders correctly', () => {
    const component = wrapper();

    expect(component.find(DisplayConfig).length).toEqual(1);
    expect(component.find(GeneralConfigBlock).length).toEqual(1);
    expect(component.find(GraphAttributeConfig).length).toEqual(1);
    expect(component.find(PointConfig).length).toEqual(1);
    expect(component.find(PartialScoringConfig).length).toEqual(1);
    expect(component.find(FeedbackConfig).length).toEqual(1);
  });

  it('restores default model correctly', () => {
    const onModelChanged = jest.fn();
    const component = wrapper({ onModelChanged });

    component.setProps({ ...defaultProps, model: { ...defaultProps.model, correctResponse: ['0,0'] }});

    component.instance().resetToDefaults();

    expect(onModelChanged).toBeCalledWith(expect.objectContaining(defaultProps.model));
  });

  it('updates grid parameter min/max values accordingly', () => {
    const onModelChanged = jest.fn();
    const component = wrapper({ onModelChanged });

    component.instance().onGridParameterChange('domainMin')({ target: { value: 3 }});

    expect(onModelChanged).toBeCalledWith(expect.objectContaining({
      ...defaultProps.model,
      correctResponse: ['3,0', '3,1', '3,2', '3,3'],
    }));
  });
});

describe('GeneralConfigBlock', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      config: defaultProps.model.model.config,
      onToggleWithLabels: jest.fn(),
      onModelConfigChange: jest.fn()
    };

    wrapper = shallowChild(GeneralConfigBlock, props, 1);
  });

  it('renders correctly', () => {
    const component = wrapper();

    expect(component.find(InputCheckbox).length).toEqual(1);
    expect(component.find(InputRadio).length).toEqual(2);
  });
});

describe('PointConfig', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      model: defaultProps.model,
      config: defaultProps.model.model.config,
      addPoint: jest.fn(),
      onMaxPointsChange: jest.fn(),
      deletePoint: jest.fn(),
      onPointValueChange: jest.fn(),
      onPointLabelChange: jest.fn()
    };

    wrapper = shallowChild(PointConfig, props, 1);
  });

  it('renders correctly', () => {
    const component = wrapper();

    expect(component.find(DeleteControl).length).toEqual(4);
    expect(component.find(AddControl).length).toEqual(1);
    expect(component.find(Input).length).toBeGreaterThan(8);
  });
});
