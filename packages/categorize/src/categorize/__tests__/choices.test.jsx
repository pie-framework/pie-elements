import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Choices } from '../choices';

jest.mock('../choice', () => ({
  __esModule: true,
  default: (props) => <div {...props} />,
  ChoiceType: {},
}));
jest.mock('@pie-lib/drag', () => ({
  DraggableChoice: (props) => <div {...props} />,
}));

const theme = createTheme();

describe('choices', () => {
  const renderChoices = (extras) => {
    const defaults = {
      classes: {},
      choices: [],
      onDropChoice: jest.fn(),
      onRemoveChoice: jest.fn(),
      id: '1',
      label: 'Category Label',
      grid: { columns: 1, rows: 1 },
    };

    const props = { ...defaults, ...extras };
    return render(
      <ThemeProvider theme={theme}>
        <Choices {...props} />
      </ThemeProvider>
    );
  };

  describe('renders', () => {
    it('renders without crashing', () => {
      const { container } = renderChoices();
      expect(container).toBeInTheDocument();
    });

    it('renders when disabled', () => {
      const { container } = renderChoices({ disabled: true });
      expect(container).toBeInTheDocument();
    });

    it('renders with choices', () => {
      const { container } = renderChoices({ choices: [{ id: '1', label: 'foo' }] });
      expect(container).toBeInTheDocument();
    });

    it('renders with empty choice', () => {
      const { container } = renderChoices({ choices: [{ empty: true }] });
      expect(container).toBeInTheDocument();
    });
  });
});
