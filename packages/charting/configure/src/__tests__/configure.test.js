import * as React from 'react';
import { shallow } from 'enzyme';

import { Configure } from '../configure';
import { ChartingConfig } from '../charting-config';
import ChartType from '../chart-type';
import { CorrectResponse } from '../correct-response';
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
    radio: jest.fn(),
    numberFields: jest.fn()
  }
}));

jest.mock('@pie-lib/charting', () => ({
  Chart: () => <div />,
  chartTypes: {
    Bar: () => ({
      Component: () => <div />,
      type: 'bar'
    }),
    Histogram: () => ({
      Component: () => <div />,
      type: 'histogram'
    }),
    LineDot: () => ({
      Component: () => <div />,
      type: 'lineDot'
    }),
    LineCross: () => ({
      Component: () => <div />,
      type: 'lineCross'
    }),
    DotPlot: () => ({
      Component: () => <div />,
      type: 'dotPlot'
    }),
    LinePlot: () => ({
      Component: () => <div />,
      type: 'linePlot'
    }),
  }
}));

describe('Configure', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = props => {
      const configureProps = { ...defaultValues, ...props };

      return shallow(<Configure { ...configureProps } />);
    };
  });

  describe('renders', () => {
    it('snapshot', () => {
      expect(wrapper()).toMatchSnapshot();
    })
  });

  describe('logic', () => {
    it('updates rationale', () => {
      const onModelChanged = jest.fn();
      const component = wrapper({ onModelChanged });

      component.instance().onRationaleChange('New Rationale');

      expect(onModelChanged).toBeCalledWith(expect.objectContaining({
        ...defaultValues.model,
        rationale: 'New Rationale',
      }));
    });

    it('updates prompt', () => {
      const onModelChanged = jest.fn();
      const component = wrapper({ onModelChanged });

      component.instance().onPromptChange('New Prompt');

      expect(onModelChanged).toBeCalledWith(expect.objectContaining({
        ...defaultValues.model,
        prompt: 'New Prompt',
      }));
    });

    it('updates teacher instructions', () => {
      const onModelChanged = jest.fn();
      const component = wrapper({ onModelChanged });

      component.instance().onTeacherInstructionsChange('New Teacher Instructions');

      expect(onModelChanged).toBeCalledWith(expect.objectContaining({
        ...defaultValues.model,
        teacherInstructions: 'New Teacher Instructions',
      }));
    });

    it('updates chart type', () => {
      const onModelChanged = jest.fn();
      const component = wrapper({ onModelChanged });

      component.instance().onChartTypeChange('histogram');

      expect(onModelChanged).toBeCalledWith(expect.objectContaining({
        ...defaultValues.model,
        chartType: 'histogram',
      }));
    });
  });
});


describe('CorrectResponse', () => {
  let wrapper;
  let props;
  const onChange = jest.fn();

  beforeEach(() => {
    props = {
      classes: {},
      model: defaultValues.model,
      onChange,
      tools: []
    };

    wrapper = newProps => {
      const configureProps = { ...props, newProps };

      return shallow(<CorrectResponse { ...configureProps } />);
    };
  });

  describe('renders', () => {
    it('snapshot', () => {
      expect(wrapper()).toMatchSnapshot();
    })
  });

  describe('logic', () => {
    let w;

    beforeEach(() => {
        w = wrapper();
    });

    it('changes correctAnswer data', () => {
      w.instance().changeData([]);

      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
        correctAnswer: expect.objectContaining({
          data: []
        })
      }));

      const wrap = wrapper({
        ...defaultValues,
        correctAnswer: {
          data: []
        }
      });
      wrap.instance().changeData([{ value: 2, label: 'A' }]);

      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
        correctAnswer: expect.objectContaining({
          data: [{ value: 2, label: 'A' }]
        })
      }));
    });
  });
});

describe('ChartingConfig', () => {
  let wrapper;
  let props;
  const onChange = jest.fn();

  beforeEach(() => {
    props = {
      classes: {},
      model: defaultValues.model,
      onChange,
      tools: []
    };

    wrapper = newProps => {
      const configureProps = { ...props, newProps };

      return shallow(<ChartingConfig { ...configureProps } />);
    };
  });

  describe('renders', () => {
    it('snapshot', () => {
      expect(wrapper()).toMatchSnapshot();
    })
  });

  describe('logic', () => {
    it('changeData calls onChange', () => {
      wrapper().instance().changeData([{ value: 2, label: 'A' }]);

      expect(onChange).toBeCalledWith(expect.objectContaining({
          data: [{ value: 2, label: 'A' }]
        }));
    })
  });
});

describe('ChartType', () => {
  let wrapper;
  let props;
  const onChange = jest.fn();

  beforeEach(() => {
    props = {
      classes: {},
      value: 'bar',
      onChange
    };

    wrapper = newProps => {
      const configureProps = { ...props, newProps };

      return shallow(<ChartType { ...configureProps } />);
    };
  });

  describe('renders', () => {
    it('snapshot', () => {
      expect(wrapper()).toMatchSnapshot();
    })
  });
});

