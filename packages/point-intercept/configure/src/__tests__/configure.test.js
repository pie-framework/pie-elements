import * as React from 'react';
import Configure from '../configure';
import DisplayConfig from '../display-config';
import GeneralConfigBlock from '../general-config-block';
import GraphAttributeConfig from '../graph-attribute-config';
import PartialScoringConfig from '@pie-lib/scoring-config';
import { FeedbackConfig } from '@pie-lib/config-ui';
import PointConfig from '../point-config';
import { shallowChild } from '@pie-lib/test-utils';

describe('Configure', () => {
  const defaultProps = {
    model: {
      id: '1',
      element: 'point-intercept',
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
