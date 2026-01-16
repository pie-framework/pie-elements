import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Choices } from '../choices';

jest.mock('../choice', () => ({
  __esModule: true,
  default: ({ label, id }) => <div data-testid={`choice-${id}`}>{label}</div>,
  ChoiceType: {},
}));
jest.mock('@pie-lib/drag', () => ({
  DraggableChoice: (props) => <div {...props} />,
  PlaceHolder: ({ children }) => <div>{children}</div>,
  uid: {
    withUid: jest.fn((input) => input),
    generateUid: jest.fn().mockReturnValue('1'),
  },
}));

const theme = createTheme();

describe('Choices', () => {
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

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderChoices();
      expect(container).toBeInTheDocument();
    });

    it('renders when disabled', () => {
      const { container } = renderChoices({ disabled: true });
      expect(container).toBeInTheDocument();
    });

    it('renders choices with their labels', () => {
      renderChoices({
        choices: [
          { id: '1', label: 'Choice One' },
          { id: '2', label: 'Choice Two' },
        ],
      });
      expect(screen.getByTestId('choice-1')).toBeInTheDocument();
      expect(screen.getByTestId('choice-2')).toBeInTheDocument();
      expect(screen.getByText('Choice One')).toBeInTheDocument();
      expect(screen.getByText('Choice Two')).toBeInTheDocument();
    });

    it('does not render empty choices as visible elements', () => {
      const { container } = renderChoices({
        choices: [{ empty: true }, { id: '1', label: 'Visible Choice' }],
      });
      expect(screen.getByText('Visible Choice')).toBeInTheDocument();
      // Empty choice renders as empty div
      expect(container.querySelectorAll('[data-testid^="choice-"]').length).toBe(1);
    });
  });

  describe('choices label', () => {
    it('displays choices label when provided', () => {
      renderChoices({
        model: { choicesLabel: 'Available Choices', categoriesPerRow: 1 },
      });
      expect(screen.getByText('Available Choices')).toBeInTheDocument();
    });

    it('does not display label when choicesLabel is empty', () => {
      renderChoices({
        model: { choicesLabel: '', categoriesPerRow: 1 },
      });
      expect(screen.queryByText('Available Choices')).not.toBeInTheDocument();
    });
  });
});
