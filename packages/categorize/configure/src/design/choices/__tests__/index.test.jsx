import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Choices } from '../index';

jest.mock('../../header', () => ({
  __esModule: true,
  default: (props) => <div {...props} />,
}));
jest.mock('../choice', () => ({
  __esModule: true,
  default: (props) => <div {...props} />,
}));
jest.mock('../config', () => ({
  __esModule: true,
  default: (props) => <div {...props} />,
}));

const theme = createTheme();

describe('choices', () => {
  let onModelChanged = jest.fn();
  let model = {
    choices: [
      {
        id: '0',
        content: 'Choice 0',
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
        choices: [],
      },
    ],
    rowLabels: [''],
    correctResponse: [],
    partialScoring: true,
    maxAnswerChoices: 3,
  };

  beforeEach(() => {
    onModelChanged = jest.fn();
  });

  const renderChoices = (extras) => {
    const props = {
      onModelChanged,
      model,
      configuration: {},
      classes: {},
      choices: [{ id: '0', content: 'Choice 0' }],
      ...extras,
    };
    return render(
      <ThemeProvider theme={theme}>
        <Choices {...props} />
      </ThemeProvider>
    );
  };

  describe('renders', () => {
    it('renders without crashing', () => {
      const { container } = renderChoices();
      expect(container).toBeInTheDocument();
    });
  });
});
