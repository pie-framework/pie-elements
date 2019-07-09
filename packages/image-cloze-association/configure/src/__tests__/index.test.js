import { shallow } from 'enzyme';
import ReactDOM from 'react-dom';

import * as React from 'react';
import defaultValues from '../defaults';
import { Root } from '../root';


jest.mock('react-dom', () => ({
  render: jest.fn()
}));

jest.mock('@pie-lib/config-ui', () => ({
  FeedbackConfig: props => (<div/>),
  InputCheckbox: props => (<div/>),
  layout: {
    ConfigLayout: props => <div>{props.children}</div>
  },
  settings: {
    Panel: props => <div onChange={props.onChange} />,
    toggle: jest.fn(),
  }
}));

export const defaultProps = {
  classes: {},
  model: {},
  configuration: defaultValues.configuration
};

describe('Root', () => {
  let wrapper;
  let component;

  beforeEach(() => {
    wrapper = props => {
      const configProps = {
        ...defaultProps,
        ...props
      };

      return shallow(<Root { ...configProps } />);
    };
  });

  it('renders correctly', () => {
    component = wrapper();
  });

  it('updates teacher instructions correctly', () => {
    let onModelChanged = jest.fn();

    component = wrapper({
      onModelChanged
    });

    component.instance().onTeacherInstructionsChanged('New Teacher Instructions');

    expect(onModelChanged).toBeCalledWith(
      expect.objectContaining({ teacherInstructions: 'New Teacher Instructions' })
    );
  });
});

describe('index', () => {
  let Def;
  let el;
  let onModelChanged = jest.fn();
  let initialModel = {};

  beforeAll(() => {
    Def = require('../index').default;
  });

  beforeEach(() => {
    el = new Def();
    el.model = initialModel;
    el.onModelChanged = onModelChanged;
  });

  describe('set model', () => {
    it('calls ReactDOM.render', () => {
      expect(ReactDOM.render).toHaveBeenCalled();
    });
  });
});
