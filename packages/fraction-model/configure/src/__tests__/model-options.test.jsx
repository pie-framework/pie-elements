import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';
import defaultValues from '../defaults';
import { ModelOptions } from '../model-options';

jest.mock('@pie-lib/config-ui', () => {
  const React = require('react');
  return {
    Checkbox: (props) => React.createElement('div', { 'data-testid': 'checkbox', ...props }),
    layout: {
      ConfigLayout: (props) => React.createElement('div', null, props.children),
    },
  };
});

jest.mock('@pie-lib/editable-html', () => {
  const React = require('react');
  return {
    EditableHtml: (props) => React.createElement('div', { ...props }),
  };
});

jest.mock('@mui/material', () => {
  const React = require('react');
  const actualMui = jest.requireActual('@mui/material');
  return {
    ...actualMui,
    Select: (props) => React.createElement('div', { 'data-testid': 'select', ...props }),
  };
});

jest.mock('../card-bar', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: (props) => React.createElement('div', { 'data-testid': 'card-bar', ...props }),
  };
});

jest.mock('../number-text-field', () => {
  const React = require('react');
  return {
    MiniField: (props) => React.createElement('div', { 'data-testid': 'mini-field', ...props }),
  };
});

const theme = createTheme();

jest.mock('lodash/debounce', () => (fn) => fn);

export const defaultProps = {
  model: {
    correctResponse: [],
    title: '',
    prompt: '',
    modelTypeSelected: 'bar',
    maxModelSelected: 1,
    partsPerModel: 5,
    allowedStudentConfig: false,
    showGraphLabels: false,
  },
  modelOptions: defaultValues.configuration.modelOptions,
};

describe('Model Options', () => {
  const renderModelOptions = (props = {}) => {
    const configProps = {
      classes: {},
      ...defaultProps,
      ...props,
    };
    return render(
      <ThemeProvider theme={theme}>
        <ModelOptions {...configProps} />
      </ThemeProvider>
    );
  };

  it('renders correctly: Components mounted correctly', () => {
    renderModelOptions();
    expect(screen.getByTestId('card-bar')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument(); // MUI Select renders as combobox
    expect(screen.getAllByTestId('mini-field').length).toEqual(2);
    expect(screen.getByTestId('checkbox')).toBeInTheDocument();
  });

  it('render correctly: update model type to Pie', () => {
    let onChange = jest.fn();

    const testInstance = new ModelOptions({
      classes: {},
      ...defaultProps,
      onChange,
    });

    testInstance.handleSelect({
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

    const testInstance = new ModelOptions({
      classes: {},
      ...defaultProps,
      onChange,
    });

    testInstance.handleSelect({
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

    const testInstance = new ModelOptions({
      classes: {},
      ...defaultProps,
      onChange,
    });

    testInstance.change('max', {}, 4);

    expect(onChange).toBeCalledWith(
      expect.objectContaining({ maxModelSelected: defaultProps.model.maxModelSelected }),
      expect.objectContaining({ maxModelSelected: 4 }),
      true,
    );
  });

  it('render correctly: update parts per model', () => {
    let onChange = jest.fn();

    const testInstance = new ModelOptions({
      classes: {},
      ...defaultProps,
      onChange,
    });

    testInstance.change('part', {}, 7);

    expect(onChange).toBeCalledWith(
      expect.objectContaining({ partsPerModel: defaultProps.model.partsPerModel }),
      expect.objectContaining({ partsPerModel: 7 }),
      true,
    );
  });

  it('render correctly: update student config checkbox', () => {
    let onChange = jest.fn();

    const testInstance = new ModelOptions({
      classes: {},
      ...defaultProps,
      onChange,
    });

    testInstance.change('student-config', {}, true);

    expect(onChange).toBeCalledWith(
      expect.objectContaining({ allowedStudentConfig: defaultProps.model.allowedStudentConfig }),
      expect.objectContaining({ allowedStudentConfig: true }),
      false,
    );
  });
});
