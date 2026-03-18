import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Main from '../main';

// Mock utility functions
jest.mock('../utils', () => ({
  findSectionsInSolutionSet: jest.fn((gssData) => ({ ...gssData, sections: [] })),
  pointInsidePolygon: jest.fn(() => true),
  checkIfLinesAreAdded: jest.fn(() => true),
}));

// Mock the dependencies
jest.mock('@pie-lib/graphing-solution-set', () => ({
  GraphContainer: ({ children, onChangeMarks, onChangeGssLineData, onSolutionSetSelected, onCustomReset, ...props }) => (
    <div data-testid="graph-container" {...props}>
      <button
        data-testid="change-marks-btn"
        onClick={() => onChangeMarks && onChangeMarks([{ type: 'line', x: 1, y: 1 }])}
      >
        Change Marks
      </button>
      <button
        data-testid="change-gss-btn"
        onClick={() => onChangeGssLineData && onChangeGssLineData({ selectedTool: 'lineB' }, 'lineA')}
      >
        Change GSS Line Data
      </button>
      <button
        data-testid="solution-set-btn"
        onClick={() => onSolutionSetSelected && onSolutionSetSelected({ x: 1, y: 1 })}
      >
        Select Solution Set
      </button>
      <button data-testid="reset-btn" onClick={() => onCustomReset && onCustomReset()}>
        Reset
      </button>
      {children}
    </div>
  ),
}));

jest.mock('@pie-lib/render-ui', () => ({
  color: {
    text: () => '#000',
    background: () => '#fff',
  },
  Collapsible: ({ children, labels }) => (
    <div data-testid="collapsible">
      <button>{labels.hidden}</button>
      {children}
    </div>
  ),
  hasText: (text) => !!text && text.trim().length > 0,
  hasMedia: () => false,
  PreviewPrompt: ({ prompt }) => <div data-testid="preview-prompt">{prompt}</div>,
  UiLayout: ({ children }) => <div data-testid="ui-layout">{children}</div>,
}));

jest.mock('@pie-lib/correct-answer-toggle', () => {
  return function CorrectAnswerToggle({ show, toggled, onToggle }) {
    return show ? (
      <button data-testid="correct-answer-toggle" onClick={() => onToggle(!toggled)}>
        {toggled ? 'Hide Correct Answer' : 'Show Correct Answer'}
      </button>
    ) : null;
  };
});

jest.mock('@pie-lib/config-ui', () => ({
  AlertDialog: ({ open, title, text, onClose, onConfirm, onConfirmText }) =>
    open ? (
      <div data-testid="alert-dialog">
        <div data-testid="dialog-title">{title}</div>
        <div data-testid="dialog-text">{text}</div>
        <button data-testid="dialog-close" onClick={onClose}>
          Cancel
        </button>
        <button data-testid="dialog-confirm" onClick={onConfirm}>
          {onConfirmText || 'OK'}
        </button>
      </div>
    ) : null,
}));

describe('Main', () => {
  const defaultModel = {
    answersCorrected: [],
    arrows: { left: true, right: true, up: true, down: true },
    coordinatesOnHover: true,
    correctResponse: [],
    defaultTool: 'line',
    disabled: false,
    domain: { min: -10, max: 10 },
    extraCSSRules: '',
    labels: { left: 'x', bottom: 'y' },
    labelsEnabled: true,
    prompt: 'Test prompt',
    range: { min: -10, max: 10 },
    rationale: '',
    showToggle: false,
    size: { width: 500, height: 500 },
    title: 'Test Graph',
    titleEnabled: true,
    teacherInstructions: '',
    language: 'en',
    gssLineData: {
      selectedTool: 'lineA',
      lineA: { lineType: 'Solid' },
      lineB: { lineType: 'Solid' },
      sections: [],
    },
    gssData: {
      selectedTool: 'lineA',
      lineA: { lineType: 'Solid' },
      lineB: { lineType: 'Solid' },
      sections: [],
    },
  };

  const defaultSession = {
    answer: [],
  };

  const defaultProps = {
    model: defaultModel,
    session: defaultSession,
    onAnswersChange: jest.fn(),
    setGssData: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(<Main {...defaultProps} />);
      expect(container).toBeInTheDocument();
    });

    it('renders the prompt when provided', () => {
      render(<Main {...defaultProps} />);
      expect(screen.getByText('Test prompt')).toBeInTheDocument();
    });

    it('does not render prompt when not provided', () => {
      const props = {
        ...defaultProps,
        model: { ...defaultModel, prompt: '' },
      };
      render(<Main {...props} />);
      expect(screen.queryByText('Test prompt')).not.toBeInTheDocument();
    });

    it('renders the graph container', () => {
      render(<Main {...defaultProps} />);
      expect(screen.getByTestId('graph-container')).toBeInTheDocument();
    });

    it('renders teacher instructions when provided', () => {
      const props = {
        ...defaultProps,
        model: {
          ...defaultModel,
          teacherInstructions: 'Instructions for teachers',
        },
      };
      render(<Main {...props} />);
      expect(screen.getByText('Instructions for teachers')).toBeInTheDocument();
    });

    it('does not render teacher instructions when empty', () => {
      render(<Main {...defaultProps} />);
      expect(screen.queryByText('Show Teacher Instructions')).not.toBeInTheDocument();
    });

    it('renders rationale when provided', () => {
      const props = {
        ...defaultProps,
        model: {
          ...defaultModel,
          rationale: 'This is the rationale',
        },
      };
      render(<Main {...props} />);
      expect(screen.getByText('This is the rationale')).toBeInTheDocument();
    });

    it('does not render rationale when empty', () => {
      render(<Main {...defaultProps} />);
      expect(screen.queryByText('Show Rationale')).not.toBeInTheDocument();
    });
  });

  describe('correct answer toggle', () => {
    it('does not show toggle when showToggle is false', () => {
      render(<Main {...defaultProps} />);
      expect(screen.queryByTestId('correct-answer-toggle')).not.toBeInTheDocument();
    });

    it('shows toggle when showToggle is true', () => {
      const props = {
        ...defaultProps,
        model: {
          ...defaultModel,
          showToggle: true,
          correctResponse: [{ type: 'point', x: 1, y: 1 }],
        },
      };
      render(<Main {...props} />);
      expect(screen.getByTestId('correct-answer-toggle')).toBeInTheDocument();
    });

    it('toggles between student and correct answer view', () => {
      const props = {
        ...defaultProps,
        model: {
          ...defaultModel,
          showToggle: true,
          correctResponse: [{ type: 'point', x: 1, y: 1 }],
        },
      };
      render(<Main {...props} />);

      const toggleButton = screen.getByTestId('correct-answer-toggle');
      expect(toggleButton).toHaveTextContent('Show Correct Answer');

      fireEvent.click(toggleButton);
      expect(toggleButton).toHaveTextContent('Hide Correct Answer');
    });
  });

  describe('GSS functionality', () => {
    it('handles GSS line data changes', () => {
      const setGssData = jest.fn();
      const props = {
        ...defaultProps,
        setGssData,
      };

      render(<Main {...props} />);
      const changeGssBtn = screen.getByTestId('change-gss-btn');

      fireEvent.click(changeGssBtn);

      // The function should process the GSS data change
      expect(props.setGssData).toHaveBeenCalled();
    });

    it('handles solution set selection', () => {
      const setGssData = jest.fn();
      const props = {
        ...defaultProps,
        setGssData,
        model: {
          ...defaultModel,
          gssData: {
            ...defaultModel.gssData,
            sections: [
              [
                { x: 0, y: 0 },
                { x: 5, y: 0 },
                { x: 5, y: 5 },
                { x: 0, y: 5 },
              ],
            ],
          },
        },
      };

      render(<Main {...props} />);
      const solutionSetBtn = screen.getByTestId('solution-set-btn');

      fireEvent.click(solutionSetBtn);

      expect(setGssData).toHaveBeenCalled();
    });

    it('handles reset functionality', () => {
      render(<Main {...defaultProps} />);
      const resetBtn = screen.getByTestId('reset-btn');

      fireEvent.click(resetBtn);

      expect(screen.getByTestId('alert-dialog')).toBeInTheDocument();
      expect(screen.getByText('Warning')).toBeInTheDocument();
    });

    it('does not allow changes when disabled', () => {
      const setGssData = jest.fn();
      const props = {
        ...defaultProps,
        setGssData,
        model: {
          ...defaultModel,
          disabled: true,
        },
      };

      render(<Main {...props} />);
      const solutionSetBtn = screen.getByTestId('solution-set-btn');

      fireEvent.click(solutionSetBtn);

      // Should not call setGssData when disabled
      expect(setGssData).not.toHaveBeenCalled();
    });
  });

  describe('session handling', () => {
    it('uses session.answer for marks when available', () => {
      const props = {
        ...defaultProps,
        session: {
          answer: [{ type: 'point', x: 2, y: 3 }],
        },
      };
      render(<Main {...props} />);
      const graph = screen.getByTestId('graph-container');
      expect(graph).toBeInTheDocument();
    });

    it('uses answersCorrected when available', () => {
      const props = {
        ...defaultProps,
        model: {
          ...defaultModel,
          answersCorrected: [{ type: 'point', x: 5, y: 5, correctness: 'correct' }],
        },
      };
      render(<Main {...props} />);
      const graph = screen.getByTestId('graph-container');
      expect(graph).toBeInTheDocument();
    });

    it('handles empty session gracefully', () => {
      const props = {
        ...defaultProps,
        session: {},
      };
      const { container } = render(<Main {...props} />);
      expect(container).toBeInTheDocument();
    });
  });

  describe('alert dialog', () => {
    it('does not show alert dialog by default', () => {
      render(<Main {...defaultProps} />);
      expect(screen.queryByTestId('alert-dialog')).not.toBeInTheDocument();
    });

    it('shows alert dialog when reset button is clicked', () => {
      render(<Main {...defaultProps} />);
      const resetBtn = screen.getByTestId('reset-btn');

      fireEvent.click(resetBtn);

      expect(screen.getByTestId('alert-dialog')).toBeInTheDocument();
      expect(screen.getByTestId('dialog-title')).toHaveTextContent('Warning');
    });

    it('closes alert dialog when cancel is clicked', () => {
      render(<Main {...defaultProps} />);
      const resetBtn = screen.getByTestId('reset-btn');

      fireEvent.click(resetBtn);
      expect(screen.getByTestId('alert-dialog')).toBeInTheDocument();

      const cancelBtn = screen.getByTestId('dialog-close');
      fireEvent.click(cancelBtn);

      expect(screen.queryByTestId('alert-dialog')).not.toBeInTheDocument();
    });

    it('confirms reset and calls setGssData', () => {
      const setGssData = jest.fn();
      const props = {
        ...defaultProps,
        setGssData,
        session: {
          answer: [{ type: 'line', x: 1, y: 1 }],
        },
      };

      render(<Main {...props} />);
      const resetBtn = screen.getByTestId('reset-btn');

      fireEvent.click(resetBtn);

      const confirmBtn = screen.getByTestId('dialog-confirm');
      fireEvent.click(confirmBtn);

      expect(setGssData).toHaveBeenCalled();
      expect(screen.queryByTestId('alert-dialog')).not.toBeInTheDocument();
    });
  });

  describe('GSS Line Data handling', () => {
    it('renders with gssLineData and gssData', () => {
      const setGssData = jest.fn();
      const props = {
        ...defaultProps,
        setGssData,
        session: {
          answer: [{ type: 'line', x: 1, y: 1 }],
        },
        model: {
          ...defaultModel,
          gssData: {
            selectedTool: 'lineA',
            lineA: { lineType: 'Dashed' },
            sections: [],
          },
        },
      };

      const { container } = render(<Main {...props} />);
      expect(container).toBeInTheDocument();
      expect(screen.getByTestId('graph-container')).toBeInTheDocument();
    });

    it('handles GSS line data change button click', () => {
      const setGssData = jest.fn();
      const props = {
        ...defaultProps,
        setGssData,
        session: {
          answer: [{ type: 'line', x: 1, y: 1 }],
        },
      };

      render(<Main {...props} />);
      const changeGssBtn = screen.getByTestId('change-gss-btn');

      fireEvent.click(changeGssBtn);

      // The component should handle the GSS data change
      expect(setGssData).toHaveBeenCalled();
    });
  });
});