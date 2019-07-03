import * as React from 'react';
import { shallow } from 'enzyme';

import { Configure } from '../configure';
import { GraphingConfig } from '../graphing-config';
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

jest.mock('@pie-lib/graphing', () => ({
  GraphContainer: props => <div>{props.children}</div>,
  tools: {
    point: () => ({
      Component: () => <div />,
      type: 'point'
    }),
    circle: () => ({
      Component: () => <div />,
      type: 'circle'
    }),
    polygon: () => ({
      Component: () => <div />,
      type: 'polygon'
    }),
    segment: () => ({
      Component: () => <div />,
      type: 'segment'
    }),
    vector: () => ({
      Component: () => <div />,
      type: 'vector'
    }),
    ray: () => ({
      Component: () => <div />,
      type: 'ray'
    }),
    line: () => ({
      Component: () => <div />,
      type: 'line'
    }),
    sine: () => ({
      Component: () => <div />,
      type: 'sine'
    }),
    parabola: () => ({
      Component: () => <div />,
      type: 'parabola'
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
      tools: []
    };

    wrapper = newProps => {
      const configureProps = { ...props, newProps };

      return shallow(<GraphingConfig { ...configureProps } />);
    };
  });

  describe('renders', () => {
    it('snapshot', () => {
      expect(wrapper()).toMatchSnapshot();
    })
  });

  describe('logic', () => {
    it('changeBackgroundMarks calls onChange', () => {
      const component = wrapper();
      const bM = [{ x: 1, y: 1, type: 'point'}];

      component.instance().changeBackgroundMarks(bM);

      expect(component.instance().props.onChange).toBeCalledWith({
        ...defaultValues.model,
        backgroundMarks: bM
      });
    });

    it('onChangeInputValue calls onChange', () => {
      const component = wrapper();
      component.instance().onChangeInputValue('domain.min', 20);

      expect(component.instance().props.model.domain.min).toEqual(20);
      expect(component.instance().props.onChange).toHaveBeenCalledWith({
        ...defaultValues.model,
        domain: {
          ...defaultValues.model.domain,
          min: 20
        }
      })
    });
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
    it('changeMarks calls onChange', () => {
      const component = wrapper();
      const marks = [{ x: 1, y: 1, type: 'point'}];

      component.instance().changeMarks('alternateTest', marks);

      expect(component.instance().props.onChange).toBeCalledWith({
        ...defaultValues.model,
        answers: {
          ...defaultValues.model.answers,
          alternateTest: {
            marks
          }
        }
      });
    });

    it('changeToolbarTools calls onChange', () => {
      const component = wrapper();
      component.instance().changeToolbarTools([]);

      expect(component.instance().props.model.toolbarTools).toEqual([]);
      expect(component.instance().props.onChange).toHaveBeenCalledWith({
        ...defaultValues.model,
        toolbarTools: []
      })
    });
  });
});

