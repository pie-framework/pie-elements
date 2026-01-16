import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { Main } from '../main';

// Mock the Design component to avoid complex dependencies
jest.mock('../design', () => ({ model, configuration, onChange, title }) => (
  <div data-testid="design-component">
    <span data-testid="design-title">{title}</span>
    <span data-testid="categories-count">{model?.categories?.length || 0}</span>
    <span data-testid="choices-count">{model?.choices?.length || 0}</span>
  </div>
));

const theme = createTheme();

const createModel = (overrides = {}) => ({
  correctResponse: [],
  choices: [],
  categories: [],
  ...overrides,
});

describe('Main', () => {
  const onModelChanged = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderMain = (extras = {}) => {
    const defaults = {
      classes: {},
      className: 'className',
      onModelChanged,
      model: createModel(),
    };
    const props = { ...defaults, ...extras };

    return render(
      <ThemeProvider theme={theme}>
        <Main {...props} />
      </ThemeProvider>
    );
  };

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderMain();
      expect(container).toBeInTheDocument();
    });

    it('renders the Design component', () => {
      renderMain();
      expect(screen.getByTestId('design-component')).toBeInTheDocument();
    });

    it('passes "Design" as the title', () => {
      renderMain();
      expect(screen.getByTestId('design-title')).toHaveTextContent('Design');
    });
  });

  describe('model passing', () => {
    it('passes model with categories to Design', () => {
      renderMain({
        model: createModel({
          categories: [
            { id: '1', label: 'Category 1' },
            { id: '2', label: 'Category 2' },
          ],
        }),
      });
      expect(screen.getByTestId('categories-count')).toHaveTextContent('2');
    });

    it('passes model with choices to Design', () => {
      renderMain({
        model: createModel({
          choices: [
            { id: '1', content: 'Choice 1' },
            { id: '2', content: 'Choice 2' },
            { id: '3', content: 'Choice 3' },
          ],
        }),
      });
      expect(screen.getByTestId('choices-count')).toHaveTextContent('3');
    });
  });
});
