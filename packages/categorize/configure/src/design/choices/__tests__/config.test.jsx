import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { Config } from '../config';

jest.mock('@pie-lib/config-ui', () => ({
  settings: {
    Panel: (props) => <div>{props.children}</div>,
    toggle: jest.fn(() => (props) => <div {...props} />),
    radio: jest.fn(() => (props) => <div {...props} />),
  },
  layout: {
    ConfigLayout: (props) => <div>{props.children}</div>,
  },
}));

const theme = createTheme();

describe('config', () => {
  let onModelChanged;
  let allChoicesHaveCount;
  let config;

  beforeEach(() => {
    onModelChanged = jest.fn();
    allChoicesHaveCount = jest.fn();
    config = {
      choices: [
        {
          id: '0',
          content: 'Choice 0'
        },
      ],
      choicesPosition: 'below',
      choicesLabel: '',
      lockChoiceOrder: true,
      categoriesPerRow: 2,
      categories: [
        {
          id: '0',
          label: 'Category 0',
          choices: []
        },
      ],
      rowLabels: [''],
      correctResponse: [],
      partialScoring: true,
    };
  });

  const renderConfig = extras => {
    const props = { classes: {}, onModelChanged, allChoicesHaveCount, config, ...extras };
    return render(
      <ThemeProvider theme={theme}>
        <Config {...props} />
      </ThemeProvider>
    );
  };

  describe('renders', () => {
    it('renders without crashing', () => {
      const { container } = renderConfig();
      expect(container).toBeInTheDocument();
    });
  });
});
