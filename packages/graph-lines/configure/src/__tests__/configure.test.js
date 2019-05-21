import * as React from 'react';
import { shallow } from 'enzyme';

import { Configure } from '../configure';
import StyledGeneralConfigBlock, { GeneralConfigBlock } from '../general-config-block';
import PartialScoringConfig from '@pie-lib/scoring-config';
import { InputContainer, InputCheckbox } from '@pie-lib/config-ui';

import {
  FeedbackConfig,
} from '@pie-lib/config-ui';
import defaultValues from '../defaults';

jest.mock('@pie-lib/config-ui', () => ({
  InputContainer: props => <div>{props.children}</div>,
  InputCheckbox: props => <div>{props.children}</div>,
  FeedbackConfig: props => <div>{props.children}</div>,
  layout: {
    ConfigLayout: props => <div>{props.children}</div>
  },
  settings: {
    Panel: props => <div onChange={props.onChange} />,
    toggle: jest.fn(),
    radio: jest.fn()
  }
}));

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
    graph: {
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
    },
  },
  configuration: defaultValues.configuration,
};

describe('Configure', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = props => {
      const configureProps = { ...defaultProps, ...props };

      return shallow(<Configure { ...configureProps } />);
    };
  });

  it('renders correctly', () => {
    const component = wrapper();

    expect(component.find(StyledGeneralConfigBlock).length).toEqual(1);
    expect(component.find(PartialScoringConfig).length).toEqual(1);
    expect(component.find(FeedbackConfig).length).toEqual(1);
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
        graph: {
          lines: [{
            from: { x: 0, y: 0 },
            to: { x: 1, y: 1 },
          }, {
            from: { x: -2, y: -2 },
            to: { x: 3, y: 4 },
          }]

        }
      }
    });

    component.instance().onMultipleToggle({ target: { checked: false } });

    expect(onModelChanged).toBeCalledWith({
      ...defaultProps.model,
      graph: { lines: [{ 'from': { 'x': 0, 'y': 0 }, 'to': { 'x': 1, 'y': 1 } }] },
    });
  });

  it('adds a new line correctly', () => {
    const onModelChanged = jest.fn();
    const component = wrapper({ onModelChanged });

    component.instance().onAddLine();

    expect(onModelChanged).toBeCalledWith(expect.objectContaining({
      ...defaultProps.model,
      graph: {
        ...defaultProps.model.graph,
        lines: [{
          correctLine: '3x+2',
          initialView: '3x+3',
          label: 'Line One' },
          {
            correctLine: '',
            initialView: '',
            label: ''
          }]
      },
    }));
  });

  it('updates rationale', () => {
    const onModelChanged = jest.fn();
    const component = wrapper({ onModelChanged });

    component.instance().onRationaleChange('New Rationale');

    expect(onModelChanged).toBeCalledWith(expect.objectContaining({
      ...defaultProps.model,
      rationale: 'New Rationale',
    }));
  });

});

describe('GeneralConfigBlock', () => {
  let wrapper;
  let props;
  let component;

  beforeEach(() => {
    props = {
      classes: {},
      config: defaultProps.model.graph,
      configuration: defaultProps.configuration,
      onModelChanged: jest.fn(),
      onMultipleToggle: jest.fn(),
      multiple: false,
    };

    wrapper = newProps => {
      const configureProps = { ...props, newProps };

      return shallow(<GeneralConfigBlock { ...configureProps } />);
    };
  });

  it('renders correctly', () => {
    component = wrapper();

    expect(component.find(InputCheckbox).length).toBeGreaterThan(1);
    expect(component.find(InputContainer).length).toBeGreaterThan(3);

    component = wrapper({ graph: { ...props.graph, exhibitOnly: true } });

    expect(component.find(InputCheckbox).length).toEqual(2);
    expect(component.find(InputContainer).length).toBeGreaterThan(2);
  });
});
