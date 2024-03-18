import * as React from 'react';
import { shallow } from 'enzyme';
import { Configure } from '../configure';
import defaultValues from '../defaults';

jest.mock('@pie-lib/pie-toolbox/config-ui', () => ({
  InputContainer: (props) => <div>{props.children}</div>,
  InputCheckbox: (props) => <div>{props.children}</div>,
  FeedbackConfig: (props) => <div>{props.children}</div>,
  layout: {
    ConfigLayout: (props) => <div>{props.children}</div>,
  },
  settings: {
    Panel: (props) => <div onChange={props.onChange} />,
    toggle: jest.fn(),
    radio: jest.fn(),
    numberFields: jest.fn(),
    checkboxes: jest.fn(),
    textField: jest.fn(),
  },
}));

jest.mock('@pie-lib/pie-toolbox/graphing-solution-set', () => ({
  GraphContainer: (props) => <div>{props.children}</div>,
  tools: {
    polygon: () => ({
      Component: () => <div />,
      type: 'polygon',
    }),
    line: () => ({
      Component: () => <div />,
      type: 'line',
    }),
  },
}));

describe('Configure', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = (props) => {
      const configureProps = { ...defaultValues, ...props };

      return shallow(<Configure {...configureProps} />);
    };
  });

  describe('renders', () => {
    it('snapshot', () => {
      expect(wrapper()).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    it('updates rationale', () => {
      const onModelChanged = jest.fn();
      const component = wrapper({ onModelChanged });

      component.instance().onRationaleChange('New Rationale');

      expect(onModelChanged).toBeCalledWith(
        expect.objectContaining({
          ...defaultValues.model,
          rationale: 'New Rationale',
        }),
      );
    });

    it('updates prompt', () => {
      const onModelChanged = jest.fn();
      const component = wrapper({ onModelChanged });

      component.instance().onPromptChange('New Prompt');

      expect(onModelChanged).toBeCalledWith(
        expect.objectContaining({
          ...defaultValues.model,
          prompt: 'New Prompt',
        }),
      );
    });

    it('updates teacher instructions', () => {
      const onModelChanged = jest.fn();
      const component = wrapper({ onModelChanged });

      component.instance().onTeacherInstructionsChange('New Teacher Instructions');

      expect(onModelChanged).toBeCalledWith(
        expect.objectContaining({
          ...defaultValues.model,
          teacherInstructions: 'New Teacher Instructions',
        }),
      );
    });
  });
});
