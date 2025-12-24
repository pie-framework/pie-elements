import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { Categories } from '../index';

jest.mock('../category', () => ({
  __esModule: true,
  default: (props) => <div {...props} />,
}));
jest.mock('../../header', () => ({
  __esModule: true,
  default: (props) => <div {...props} />,
}));

const theme = createTheme();

describe('Categories', () => {
  let onModelChanged;
  let renderCategories;

  beforeEach(() => {
    let model = {
      choices: [
        {
          id: '0',
          content: 'Choice 0',
          categoryCount: 0,
        },
        {
          id: '1',
          content: 'Choice 0',
          categoryCount: 0,
        },
        {
          id: '2',
          content: 'Choice 3',
          categoryCount: 0,
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
    };

    onModelChanged = jest.fn();
    renderCategories = (extras) => {
      model = { ...model, ...extras };
      const defaults = {
        classes: {
          categories: 'categories',
          categoriesHolder: 'categoriesHolder',
          row: 'row',
        },
        categories: [{ id: '1', label: 'foo', choices: [] }],
        className: 'className',
        model,
        configuration: { rowLabels: {}, baseInputConfiguration: {} },
        onModelChanged,
        extras,
      };

      const props = { ...defaults };
      return render(
        <ThemeProvider theme={theme}>
          <Categories {...props} />
        </ThemeProvider>
      );
    };
  });

  describe('renders', () => {
    it('renders without crashing', () => {
      const { container } = renderCategories();
      expect(container).toBeInTheDocument();
    });
  });
});
