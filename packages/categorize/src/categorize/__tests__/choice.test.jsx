import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Layout } from '../choice';

jest.mock('@pie-lib/render-ui', () => ({
  HtmlAndMath: (props) => <div>{props.text}</div>,
  color: {
    text: () => '#000',
    background: () => '#fff',
    white: () => '#fff',
    correct: () => '#00ff00',
    incorrect: () => '#ff0000',
  },
}));

const theme = createTheme();

describe('Layout', () => {
  const renderLayout = (extras) => {
    const defaults = {
      classes: {},
      content: 'Choice Content',
    };
    const props = { ...defaults, ...extras };
    return render(
      <ThemeProvider theme={theme}>
        <Layout {...props} />
      </ThemeProvider>
    );
  };

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderLayout();
      expect(container).toBeInTheDocument();
    });

    it('renders the choice content', () => {
      renderLayout({ content: 'Test Choice Text' });
      expect(screen.getByText('Test Choice Text')).toBeInTheDocument();
    });

    it('renders HTML content', () => {
      renderLayout({ content: '<strong>Bold Text</strong>' });
      expect(screen.getByText('Bold Text')).toBeInTheDocument();
    });
  });

  describe('states', () => {
    it('renders when disabled', () => {
      const { container } = renderLayout({ disabled: true });
      expect(container).toBeInTheDocument();
    });

    it('renders when correct', () => {
      const { container } = renderLayout({ correct: true });
      expect(container).toBeInTheDocument();
    });

    it('renders when incorrect', () => {
      const { container } = renderLayout({ correct: false });
      expect(container).toBeInTheDocument();
    });

    it('renders when dragging', () => {
      const { container } = renderLayout({ isDragging: true });
      expect(container).toBeInTheDocument();
    });
  });
});

