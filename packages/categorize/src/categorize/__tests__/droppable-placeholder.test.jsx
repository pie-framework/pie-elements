import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import DroppablePlaceholder from '../droppable-placeholder';

jest.mock('../grid-content', () => ({
  GridContent: (props) => <div {...props} />,
}));

const theme = createTheme();

describe('droppable-placeholder', () => {
  const renderPlaceholder = (extras) => {
    const defaults = {
      classes: {},
      connectDropTarget: jest.fn((n) => n),
    };
    const props = { ...defaults, ...extras };
    return render(
      <ThemeProvider theme={theme}>
        <DroppablePlaceholder {...props}>content</DroppablePlaceholder>
      </ThemeProvider>
    );
  };

  describe('renders', () => {
    it('renders without crashing', () => {
      const { container } = renderPlaceholder();
      expect(container).toBeInTheDocument();
    });
    it('renders with className', () => {
      const { container } = renderPlaceholder({ className: 'foo' });
      expect(container).toBeInTheDocument();
    });
    it('renders when disabled', () => {
      const { container } = renderPlaceholder({ disabled: true });
      expect(container).toBeInTheDocument();
    });
    it('renders with grid', () => {
      const { container } = renderPlaceholder({ grid: { columns: 2 } });
      expect(container).toBeInTheDocument();
    });
  });
});
