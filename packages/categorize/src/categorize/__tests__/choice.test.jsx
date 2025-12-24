import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Choice, Layout } from '../choice';

jest.mock('@pie-lib/render-ui', () => ({
  HtmlAndMath: (props) => <div>{props.text}</div>,
  color: {
    text: () => '#000',
    background: () => '#fff',
    white: () => '#fff',
    correct: () => '#00ff00',
  },
}));

const theme = createTheme();

describe('layout', () => {
  const renderLayout = (extras) => {
    const defaults = {
      classes: {},
      content: 'Foo',
    };
    const props = { ...defaults, ...extras };
    return render(
      <ThemeProvider theme={theme}>
        <Layout {...props} />
      </ThemeProvider>
    );
  };

  it('renders without crashing', () => {
    const { container } = renderLayout();
    expect(container).toBeInTheDocument();
  });

  it('renders when disabled', () => {
    const { container } = renderLayout({ disabled: true });
    expect(container).toBeInTheDocument();
  });

  it('renders when correct', () => {
    const { container } = renderLayout({ correct: true });
    expect(container).toBeInTheDocument();
  });

  it('renders when dragging', () => {
    const { container } = renderLayout({ isDragging: true });
    expect(container).toBeInTheDocument();
  });
});

