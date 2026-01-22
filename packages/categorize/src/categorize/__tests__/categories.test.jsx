import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Categories } from '../categories';

jest.mock('../category', () => ({
  __esModule: true,
  default: ({ id, label }) => <div data-testid={`category-${id}`}>{label}</div>,
  CategoryType: {},
}));

jest.mock('../grid-content', () => ({
  __esModule: true,
  default: ({ children, columns }) => (
    <div data-testid="grid-content" data-columns={columns}>
      {children}
    </div>
  ),
}));

const theme = createTheme();

describe('Categories', () => {
  const renderCategories = (extras) => {
    const defaults = {
      classes: {},
      categories: [{ choices: [], id: '1', label: 'Category One' }],
      onDropChoice: jest.fn(),
      onRemoveChoice: jest.fn(),
      id: '1',
      label: 'Category Label',
      grid: { columns: 1, rows: 1 },
    };

    const props = { ...defaults, ...extras };
    return render(
      <ThemeProvider theme={theme}>
        <Categories {...props} />
      </ThemeProvider>
    );
  };

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderCategories();
      expect(container).toBeInTheDocument();
    });

    it('renders when disabled', () => {
      const { container } = renderCategories({ disabled: true });
      expect(container).toBeInTheDocument();
    });

    it('renders the grid content wrapper', () => {
      renderCategories();
      expect(screen.getByTestId('grid-content')).toBeInTheDocument();
    });
  });

  describe('category labels', () => {
    it('displays category labels', () => {
      renderCategories({
        categories: [
          { id: '1', label: 'First Category', choices: [] },
          { id: '2', label: 'Second Category', choices: [] },
        ],
      });
      // Multiple elements may contain the same text (label + category mock)
      expect(screen.getAllByText('First Category').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Second Category').length).toBeGreaterThan(0);
    });
  });

  describe('categories per row', () => {
    it('respects categoriesPerRow setting', () => {
      renderCategories({
        categories: [
          { id: '1', label: 'Cat 1', choices: [] },
          { id: '2', label: 'Cat 2', choices: [] },
        ],
        model: { categoriesPerRow: 2 },
      });
      const grid = screen.getByTestId('grid-content');
      expect(grid).toHaveAttribute('data-columns', '2');
    });
  });

  describe('row labels', () => {
    it('renders row labels when provided', () => {
      renderCategories({
        categories: [{ id: '1', label: 'Category', choices: [] }],
        rowLabels: ['Row 1 Label'],
      });
      expect(screen.getByText('Row 1 Label')).toBeInTheDocument();
    });

    it('does not render row labels when empty', () => {
      renderCategories({
        categories: [{ id: '1', label: 'Category', choices: [] }],
        rowLabels: [],
      });
      expect(screen.queryByText('Row 1 Label')).not.toBeInTheDocument();
    });
  });
});
