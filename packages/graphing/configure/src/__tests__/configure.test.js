import * as React from 'react';
import { shallow } from 'enzyme';

import { Configure } from '../configure';
import StyledGraphingConfig, { GraphingConfig } from '../graphing-config';
import StyledCorrectResponse, { CorrectResponse } from '../correct-response';
import { InputContainer } from '@pie-lib/config-ui';
import defaultValues from '../defaults';
import { GraphContainer , tools } from '@pie-lib/graphing';

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

jest.mock('@pie-lib/graphing', () => ({
  GraphContainer: props => <div>{props.children}</div>,
  tools: {
    point: () => <div />,
    circle: () => <div />,
    polygon: () => <div />,
    segment: () => <div />,
    vector: () => <div />,
    ray: () => <div />,
    line: () => <div />,
    sine: () => <div />,
    parabola: () => <div />,
    label: () => <div />,
  }
}));

const defaultProps = {
  model: {
    id: '1',
    element: 'graphing',
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
      domain: 600,
      range: 600
    },
    domain: {
      min: -10,
      max: 10,
      padding: 0,
      step: 1,
      labelStep: 1
    },
    range: {
      min: -5,
      max: 5,
      padding: 0,
      step: 1,
      labelStep: 1
    },
    backgroundMarks: [],
    marks: {
      correctAnswer: {
        name: 'Correct Answer',
        marks: []
      }
    },
    xAxisLabel: 'x',
    yAxisLabel: 'y',
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

    expect(component.find(StyledGraphingConfig).length).toEqual(1);
    expect(component.find(StyledCorrectResponse).length).toEqual(1);
    expect(component.find(InputContainer).length).toEqual(2);
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

  it('updates prompt', () => {
    const onModelChanged = jest.fn();
    const component = wrapper({ onModelChanged });

    component.instance().onPromptChange('New Prompt');

    expect(onModelChanged).toBeCalledWith(expect.objectContaining({
      ...defaultProps.model,
      prompt: 'New Prompt',
    }));
  });
});

describe('GraphingConfig', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      classes: {},
      model: defaultValues.model,
      onChange: jest.fn(),
    };

    wrapper = newProps => {
      const configureProps = { ...props, newProps };

      return shallow(<GraphingConfig { ...configureProps } />);
    };
  });
});


describe('CorrectResponse', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      classes: {},
      model: defaultValues.model,
      onChange: jest.fn(),
    };

    wrapper = newProps => {
      const configureProps = { ...props, newProps };

      return shallow(<CorrectResponse { ...configureProps } />);
    };
  });
});

