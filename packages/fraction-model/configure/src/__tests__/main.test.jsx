import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';
import { Main } from '../main';
import defaultValues from '../defaults';

jest.mock('@pie-lib/config-ui', () => {
  const React = require('react');
  return {
    layout: {
      ConfigLayout: (props) => React.createElement('div', { 'data-testid': 'config-layout' }, props.children),
    },
    FormSection: (props) => React.createElement('div', { 'data-testid': 'form-section', ...props }),
    AlertDialog: (props) => React.createElement('div', { 'data-testid': 'alert-dialog', ...props }),
  };
});

jest.mock('@pie-element/fraction-model', () => {
  const React = require('react');
  return {
    FractionModelChart: (props) => React.createElement('div', { 'data-testid': 'fraction-model-chart', ...props }),
  };
});

jest.mock('../model-options', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: (props) => React.createElement('div', { 'data-testid': 'model-options', ...props }),
  };
});

jest.mock('../card-bar', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: (props) => React.createElement('div', { 'data-testid': 'card-bar', ...props }),
  };
});

jest.mock('@pie-lib/editable-html', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ markup, onChange }) => React.createElement('div', { 'data-testid': 'editable-html', onClick: () => onChange && onChange('test') }, markup),
    ALL_PLUGINS: [],
  };
});

const theme = createTheme();

jest.mock('lodash/debounce', () => (fn) => fn);

jest.spyOn(Math, 'random').mockReturnValue(0);

const defaultProps = {
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
  configuration: defaultValues.configuration,
};

describe('Main', () => {
  let onChange;
  let onConfigurationChanged;
  let uploadSoundSupport;
  let imageSupport;

  beforeEach(() => {
    onChange = jest.fn();
    onConfigurationChanged = jest.fn();
    uploadSoundSupport = jest.mock();
    imageSupport = jest.mock();
  });

  const renderMain = (props = {}) => {
    return render(
      <ThemeProvider theme={theme}>
        <Main
          classes={{}}
          onChange={onChange}
          onConfigurationChanged={onConfigurationChanged}
          model={defaultProps.model}
          configuration={defaultProps.configuration}
          uploadSoundSupport={uploadSoundSupport}
          imageSupport={imageSupport}
          {...props}
        />
      </ThemeProvider>
    );
  };

  it('renders correctly', () => {
    renderMain();
    expect(screen.getAllByTestId('card-bar').length).toEqual(2);
    expect(screen.getByTestId('model-options')).toBeInTheDocument();
    expect(screen.getAllByTestId('form-section').length).toEqual(4);
    expect(screen.getAllByTestId('editable-html').length).toEqual(2);
  });
});
