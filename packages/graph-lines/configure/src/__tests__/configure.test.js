import * as React from 'react';
import Configure from '../configure';
import GeneralConfigBlock from '../general-config-block';
import PartialScoringConfig from '@pie-lib/scoring-config';
import SwipeableViews from 'react-swipeable-views';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { InputContainer, InputCheckbox } from '@pie-lib/config-ui';
import { FeedbackConfig } from '@pie-lib/config-ui';
import { shallowChild } from '@pie-lib/test-utils';

const defaultProps = {
  model: {
    id: '1',
    element: 'graph-lines',
    minimumWidth: 500,
    multiple: false,
    partialScoring: [],
    feedback: {
      correct: {
        type: 'none',
        default: 'Correct'
      },
      partial: {
        type: 'none',
        default: 'Nearly'
      },
      incorrect: {
        type: 'none',
        default: 'Incorrect'
      }
    },
    model: {
      config: {
        lines: [{
          label: 'Line One',
          correctLine: '3x+2',
          initialView: '3x+3'
        }],
        graphTitle: '',
        graphWidth: 500,
        graphHeight: 500,
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

    expect(component.find(GeneralConfigBlock).length).toEqual(1);
    expect(component.find(PartialScoringConfig).length).toEqual(1);
    expect(component.find(FeedbackConfig).length).toEqual(1);
    expect(component.find(SwipeableViews).length).toEqual(1);
    expect(component.find(Tabs).length).toEqual(1);
    expect(component.find(Tab).length).toEqual(2);
  });

  it('restores default model correctly', () => {
    const onModelChanged = jest.fn();
    const component = wrapper({ onModelChanged });

    component.setProps({ ...defaultProps, model: { ...defaultProps.model, multiple: true } });

    component.instance().resetToDefaults();

    expect(onModelChanged).toBeCalledWith(expect.objectContaining(defaultProps.model));
  });

  it('updates multiple line graph correctly', () => {
    const onModelChanged = jest.fn();
    const component = wrapper({
      ...defaultProps,
      onModelChanged,
      multiple: true,
      model: {
        ...defaultProps.model,
        model: {
          ...defaultProps.model.model,
          config: {
            ...defaultProps.model.config,
            lines: [{
              from: { x: 0, y: 0 },
              to: { x: 1, y: 1 },
            }, {
              from: { x: -2, y: -2 },
              to: { x: 3, y: 4 },
            }]
          }
        }
      }
    });

    component.instance().onMultipleToggle({ target: { checked: false } });

    expect(onModelChanged).toBeCalledWith({
      ...defaultProps.model,
      model: { config: { lines: [{ 'from': { 'x': 0, 'y': 0 }, 'to': { 'x': 1, 'y': 1 } }] } },
    });
  });

  it('adds a new line correctly', () => {
    const onModelChanged = jest.fn();
    const component = wrapper({ onModelChanged });

    component.instance().onAddLine();

    expect(onModelChanged).toBeCalledWith(expect.objectContaining({
      ...defaultProps.model,
      model: {
        ...defaultProps.model.model,
        config: {
          ...defaultProps.model.model.config,
          lines: [{
            correctLine: '3x+2',
            initialView: '3x+3',
            label: 'Line One' },
          {
            correctLine: '',
            initialView: '',
            label: ''
          }],
        }
      },
    }));
  });
});

describe('GeneralConfigBlock', () => {
  let wrapper;
  let props;
  let component;

  beforeEach(() => {
    props = {
      config: defaultProps.model.model.config,
      onChange: jest.fn(),
      onMultipleToggle: jest.fn(),
      multiple: false,
    };

    wrapper = shallowChild(GeneralConfigBlock, props, 1);
  });

  it('renders correctly', () => {
    component = wrapper();

    expect(component.find(InputCheckbox).length).toBeGreaterThan(1);
    expect(component.find(InputContainer).length).toBeGreaterThan(3);

    component = wrapper({ config: { ...props.config, exhibitOnly: true } });

    expect(component.find(InputCheckbox).length).toEqual(2);
    expect(component.find(InputContainer).length).toBeGreaterThan(2);
  });
});
