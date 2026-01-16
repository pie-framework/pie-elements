import * as React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { GraphingConfig } from '../graphing-config';
import defaultValues from '../defaults';

jest.mock('@pie-lib/graphing', () => {
  const React = require('react');
  return {
    GraphContainer: (props) => React.createElement('div', { 'data-testid': 'graph-container', ...props }),
    GridSetup: (props) => React.createElement('div', { 'data-testid': 'grid-setup', ...props }),
  };
});

jest.mock('@pie-lib/config-ui', () => {
  const React = require('react');
  return {
    AlertDialog: (props) => React.createElement('div', { 'data-testid': 'alert-dialog', ...props }),
  };
});

const theme = createTheme();

describe('GraphingConfig', () => {
  let props;

  beforeEach(() => {
    props = {
      classes: {},
      model: defaultValues.model,
      onChange: jest.fn(),
      tools: [],
    };
  });

  const renderGraphingConfig = (newProps = {}) => {
    const configureProps = { ...props, ...newProps };

    return render(
      <ThemeProvider theme={theme}>
        <GraphingConfig {...configureProps} />
      </ThemeProvider>
    );
  };

  describe('logic', () => {
    it('changeBackgroundMarks calls onChange', () => {
      const onChange = jest.fn();
      const testInstance = new GraphingConfig({ ...props, onChange });
      const bM = [{ x: 1, y: 1, type: 'point' }];

      testInstance.changeBackgroundMarks(bM);

      expect(onChange).toBeCalledWith({
        ...defaultValues.model,
        backgroundMarks: bM,
      });
    });
  });
});
