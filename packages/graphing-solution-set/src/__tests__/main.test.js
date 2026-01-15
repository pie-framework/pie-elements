import * as React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Main } from '../main';

jest.mock('lodash/uniq', () => {
  return () => [];
});

jest.mock('@pie-lib/graphing-solution-set', () => {
  const React = require('react');
  return {
    GraphContainer: (props) => React.createElement('div', { 'data-testid': 'graph-container', ...props }),
    KeyLegend: (props) => React.createElement('div', { 'data-testid': 'key-legend', ...props }),
  };
});

jest.mock('@pie-lib/render-ui', () => {
  const React = require('react');
  return {
    color: {
      text: () => '#000',
      background: () => '#fff',
    },
    Collapsible: ({ children }) => React.createElement('div', { 'data-testid': 'collapsible' }, children),
    hasText: jest.fn(() => false),
    hasMedia: jest.fn(() => false),
    PreviewPrompt: ({ prompt }) => React.createElement('div', { 'data-testid': 'preview-prompt' }, prompt),
    UiLayout: ({ children }) => React.createElement('div', { 'data-testid': 'ui-layout' }, children),
  };
});

jest.mock('@pie-lib/correct-answer-toggle', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: (props) => React.createElement('div', { 'data-testid': 'correct-answer-toggle', ...props }),
  };
});

jest.mock('@pie-lib/config-ui', () => {
  const React = require('react');
  return {
    AlertDialog: (props) => React.createElement('div', { 'data-testid': 'alert-dialog', ...props }),
  };
});

const theme = createTheme();

describe('Main', () => {
  const defaultProps = {
    model: {
      backgroundMarks: [],
      correctMarks: [],
    },
    onSessionChange: jest.fn(),
    onAnswersChange: jest.fn(),
    session: {},
  };

  describe('render', () => {
    const renderMain = (props = {}) => {
      return render(
        <ThemeProvider theme={theme}>
          <Main {...defaultProps} {...props} />
        </ThemeProvider>
      );
    };

    it('snapshot', () => {
      const { container } = renderMain();
      expect(container).toMatchSnapshot();
    });
  });
});
