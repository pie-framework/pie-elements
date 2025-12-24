import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Categories } from '../categories';

jest.mock('../category', () => ({
  __esModule: true,
  default: (props) => <div {...props} />,
  CategoryType: {},
}));

const theme = createTheme();

describe('categories', () => {
  const renderCategories = (extras) => {
    const defaults = {
      classes: {},
      categories: [{ choices: [], id: '1', label: 'category label' }],
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

  describe('renders', () => {
    it('renders without crashing', () => {
      const { container } = renderCategories();
      expect(container).toBeInTheDocument();
    });

    it('renders when disabled', () => {
      const { container } = renderCategories({ disabled: true });
      expect(container).toBeInTheDocument();
    });
  });
});
