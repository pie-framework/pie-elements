import { shallow } from 'enzyme';
import React from 'react';
import defaultValues from '../defaults';
import { ModelOptions } from '../model-options';
import CardBar from '../card-bar';
import { MiniField } from '../number-text-field';
import Select from '@material-ui/core/Select';
import { Checkbox } from '@pie-lib/pie-toolbox/config-ui';

jest.mock('@pie-lib/pie-toolbox/config-ui', () => ({
  Checkbox: (props) => <div {...props} />,
  layout: {
    ConfigLayout: (props) => <div>{props.children}</div>,
  },
}));

jest.mock('@pie-lib/pie-toolbox/editable-html', () => ({
  EditableHtml: (props) => <div {...props} />,
}));

jest.mock('@material-ui/core', () => ({
  Select: (props) => <div {...props} />,
}));

jest.mock('lodash/debounce', () => (fn) => fn);

export const defaultProps = {
  model: {
    correctResponse: [],
    title: '',
    question: '',
    modelTypeSelected: 'bar',
    maxModelSelected: 1,
    partsPerModel: 5,
    allowedStudentConfig: false,
    showGraphLabels: false,
  },
  modelOptions: defaultValues.configuration.modelOptions,
};

describe('Model Options', () => {
  let wrapper;
  let component;

  beforeEach(() => {
    wrapper = (props) => {
      const configProps = {
        classes: {},
        ...defaultProps,
        ...props,
      };
      return shallow(<ModelOptions {...configProps} />);
    };
  });

  it('snapshot renders', () => {
    const component = wrapper();
    expect(component).toMatchSnapshot();
  });

  it('renders correctly: Components mounted correctly', () => {
    component = wrapper();
    expect(component.find(CardBar).length).toEqual(1);
    expect(component.find(Select).length).toEqual(1);
    expect(component.find(MiniField).length).toEqual(2);
    expect(component.find(Checkbox).length).toEqual(1);
  });

  it('render correctly: update model type to Pie', () => {
    let onChange = jest.fn();

    component = wrapper({
      onChange,
    });

    component.instance().handleSelect({
      target: { value: 'pie' },
    });

    expect(onChange).toBeCalledWith(
      expect.objectContaining({ modelTypeSelected: 'pie' }),
      expect.objectContaining({ modelTypeSelected: 'pie' }),
      false,
    );
  });

  it('render correctly: update model type to Bar', () => {
    let onChange = jest.fn();

    component = wrapper({
      onChange,
    });

    component.instance().handleSelect({
      target: { value: 'bar' },
    });

    expect(onChange).toBeCalledWith(
      expect.objectContaining({ modelTypeSelected: 'bar' }),
      expect.objectContaining({ modelTypeSelected: 'bar' }),
      false,
    );
  });

  it('render correctly: update max no of model', () => {
    let onChange = jest.fn();

    component = wrapper({
      onChange,
    });

    component.instance().change('max', {}, 4);

    expect(onChange).toBeCalledWith(
      expect.objectContaining({ maxModelSelected: defaultProps.model.maxModelSelected }),
      expect.objectContaining({ maxModelSelected: 4 }),
      true,
    );
  });

  it('render correctly: update parts per model', () => {
    let onChange = jest.fn();

    component = wrapper({
      onChange,
    });

    component.instance().change('part', {}, 7);

    expect(onChange).toBeCalledWith(
      expect.objectContaining({ partsPerModel: defaultProps.model.partsPerModel }),
      expect.objectContaining({ partsPerModel: 7 }),
      true,
    );
  });

  it('render correctly: update student config checkbox', () => {
    let onChange = jest.fn();

    component = wrapper({
      onChange,
    });

    component.instance().change('student-config', {}, true);

    expect(onChange).toBeCalledWith(
      expect.objectContaining({ allowedStudentConfig: defaultProps.model.allowedStudentConfig }),
      expect.objectContaining({ allowedStudentConfig: true }),
      false,
    );
  });
});
