import * as React from 'react';
import { shallow } from 'enzyme';

import { Configure } from '../configure';
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

