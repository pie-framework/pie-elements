import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Category } from '../category';

jest.mock('../droppable-placeholder', () => ({
  __esModule: true,
  default: (props) => <div {...props} />,
}));
jest.mock('../choice', () => ({
  __esModule: true,
  default: (props) => <div {...props} />,
}));

const theme = createTheme();

describe('category', () => {
  const renderCategory = (extras) => {
    const defaults = {
      classes: {
        label: 'label',
        incorrect: 'incorrect',
        placeholder: 'placeholder',
        category: 'category',
      },
      choices: [],
      id: '1',
      label: 'Category Label',
      grid: { columns: 1, rows: 1 },
    };

    const props = { ...defaults, ...extras };
    return render(
      <ThemeProvider theme={theme}>
        <Category {...props} />
      </ThemeProvider>
    );
  };

  describe('renders', () => {
    it('renders without crashing', () => {
      const { container } = renderCategory();
      expect(container).toBeInTheDocument();
    });

    it('renders when disabled', () => {
      const { container } = renderCategory({ disabled: true });
      expect(container).toBeInTheDocument();
    });

    it('renders when incorrect', () => {
      const { container } = renderCategory({ choices: [{ correct: false }] });
      expect(container).toBeInTheDocument();
    });
  });
});
