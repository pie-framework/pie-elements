import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { GridContent } from '../grid-content';

const theme = createTheme();

describe('grid-content', () => {
  const renderGridContent = (extras) => {
    const defaults = {
      classes: {},
      columns: 2,
    };

    const props = { ...defaults, ...extras };
    return render(
      <ThemeProvider theme={theme}>
        <GridContent {...props}>content</GridContent>
      </ThemeProvider>
    );
  };

  describe('renders', () => {
    it('renders without crashing', () => {
      const { container } = renderGridContent();
      expect(container).toBeInTheDocument();
    });

    it('renders with different columns', () => {
      const { container } = renderGridContent({ columns: 3 });
      expect(container).toBeInTheDocument();
    });
    it('renders with className', () => {
      const { container } = renderGridContent({ className: 'foo' });
      expect(container).toBeInTheDocument();
    });
  });
});
