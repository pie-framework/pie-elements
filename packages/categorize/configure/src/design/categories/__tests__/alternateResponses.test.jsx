import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { AlternateResponses } from '../alternateResponses';

jest.mock('../category', () => (props) => <div {...props} />);

const theme = createTheme();

describe('AlternateResponses', () => {
  let onModelChanged = jest.fn();
  let model = {
    choices: [
      {
        id: '0',
        content: 'Choice 0',
        categoryCount: 0,
      },
      { id: '2', content: 'foo', categoryCount: 0 },
      { id: '3', content: 'foo1', categoryCount: 0 },
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
  };

  beforeEach(() => {
    onModelChanged = jest.fn();
  });

  const renderAlternateResponses = (extras) => {
    model = { ...model, ...extras };
    const defaults = {
      altIndex: 0,
      classes: {
        categories: 'categories',
        categoriesHolder: 'categoriesHolder',
        row: 'row',
      },
      categories: [{ id: '1', label: 'foo', choices: [] }],
      className: 'className',
      model: {
        ...model,
        choices: [
          { id: '1', categoryCount: 0 },
          { id: '2', categoryCount: 0 },
        ],
        correctResponse: [{ category: '0', choices: ['1'] }],
      },
      onModelChanged,
    };
    const props = { ...defaults, ...extras };

    return render(
      <ThemeProvider theme={theme}>
        <AlternateResponses {...props} />
      </ThemeProvider>
    );
  };

  describe('renders', () => {
    it('renders without crashing', () => {
      const { container } = renderAlternateResponses();
      expect(container).toBeInTheDocument();
    });
  });
});
