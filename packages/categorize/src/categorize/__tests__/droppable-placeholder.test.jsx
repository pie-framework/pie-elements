import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import DroppablePlaceholder from '../droppable-placeholder';

jest.mock('../grid-content', () => ({
  GridContent: (props) => <div {...props} />,
}));

jest.mock('@dnd-kit/core', () => ({
  useDroppable: () => ({
    setNodeRef: jest.fn(),
    isOver: false,
  }),
}));

jest.mock('@pie-lib/drag', () => ({
  PlaceHolder: ({ children, isOver, disabled }) => (
    <div data-testid="placeholder" data-is-over={isOver} data-disabled={disabled}>
      {children}
    </div>
  ),
}));

const theme = createTheme();

describe('DroppablePlaceholder', () => {
  const renderPlaceholder = (extras) => {
    const defaults = {
      id: 'test-placeholder',
      classes: {},
    };
    const props = { ...defaults, ...extras };
    return render(
      <ThemeProvider theme={theme}>
        <DroppablePlaceholder {...props}>
          <span>Child Content</span>
        </DroppablePlaceholder>
      </ThemeProvider>
    );
  };

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderPlaceholder();
      expect(container).toBeInTheDocument();
    });

    it('renders children content', () => {
      renderPlaceholder();
      expect(screen.getByText('Child Content')).toBeInTheDocument();
    });

    it('renders the placeholder wrapper', () => {
      renderPlaceholder();
      expect(screen.getByTestId('placeholder')).toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('passes disabled prop to placeholder', () => {
      renderPlaceholder({ disabled: true });
      const placeholder = screen.getByTestId('placeholder');
      expect(placeholder).toHaveAttribute('data-disabled', 'true');
    });

    it('passes disabled=false when not disabled', () => {
      renderPlaceholder({ disabled: false });
      const placeholder = screen.getByTestId('placeholder');
      expect(placeholder).toHaveAttribute('data-disabled', 'false');
    });
  });

  describe('minRowHeight', () => {
    it('renders with default min height', () => {
      const { container } = renderPlaceholder();
      expect(container.firstChild).toHaveStyle({ minHeight: '80px' });
    });

    it('applies custom minRowHeight', () => {
      const { container } = renderPlaceholder({ minRowHeight: '120px' });
      expect(container.firstChild).toHaveStyle({ minHeight: '120px' });
    });
  });
});
