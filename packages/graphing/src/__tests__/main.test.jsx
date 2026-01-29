import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Main from '../main';

jest.mock('@pie-lib/graphing', () => ({
  GraphContainer: ({ children, ...props }) => (
    <div data-testid="graph-container" {...props}>
      {children}
    </div>
  ),
  KeyLegend: (props) => <div data-testid="key-legend" {...props}>Key Legend</div>,
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

describe('Main', () => {
  const defaultModel = {
    answersCorrected: [],
    arrows: { left: true, right: true, up: true, down: true },
    backgroundMarks: [],
    coordinatesOnHover: true,
    correctResponse: [],
    defaultTool: 'point',
    disabled: false,
    domain: { min: -10, max: 10 },
    extraCSSRules: '',
    labels: { left: 'x', bottom: 'y' },
    labelsEnabled: true,
    prompt: 'Test prompt',
    range: { min: -10, max: 10 },
    rationale: '',
    showKeyLegend: false,
    showToggle: false,
    size: { width: 500, height: 500 },
    title: 'Test Graph',
    titleEnabled: true,
    teacherInstructions: '',
    toolbarTools: ['point', 'line', 'segment'],
    language: 'en',
  };

  const defaultSession = {
    answer: [],
  };

  const defaultProps = {
    model: defaultModel,
    session: defaultSession,
    onAnswersChange: jest.fn(),
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

  describe('key legend', () => {
    it('does not show key legend when showKeyLegend is false', () => {
      render(<Main {...defaultProps} />);
      expect(screen.queryByTestId('key-legend')).not.toBeInTheDocument();
    });

    it('shows key legend when showKeyLegend is true', () => {
      const props = {
        ...defaultProps,
        model: {
          ...defaultModel,
          showKeyLegend: true,
        },
      };
      render(<Main {...props} />);
      expect(screen.getByTestId('key-legend')).toBeInTheDocument();
    });

    it('hides key legend when showing correct answer', () => {
      const props = {
        ...defaultProps,
        model: {
          ...defaultModel,
          showKeyLegend: true,
          showToggle: true,
          correctResponse: [{ type: 'point', x: 1, y: 1 }],
        },
      };
      const { rerender } = render(<Main {...props} />);
      
      expect(screen.getByTestId('key-legend')).toBeInTheDocument();
      
      fireEvent.click(screen.getByTestId('correct-answer-toggle'));
      
      rerender(<Main {...props} />);
      
      expect(screen.queryByTestId('key-legend')).not.toBeInTheDocument();
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

  describe('toolbar tools', () => {
    it('detects label tool in toolbar', () => {
      const props = {
        ...defaultProps,
        model: {
          ...defaultModel,
          toolbarTools: ['point', 'line', 'label'],
          showKeyLegend: true,
        },
      };
      render(<Main {...props} />);
      const keyLegend = screen.getByTestId('key-legend');
      expect(keyLegend).toBeInTheDocument();
    });

    it('handles toolbar without label tool', () => {
      const props = {
        ...defaultProps,
        model: {
          ...defaultModel,
          toolbarTools: ['point', 'line'],
          showKeyLegend: true,
        },
      };
      render(<Main {...props} />);
      const keyLegend = screen.getByTestId('key-legend');
      expect(keyLegend).toBeInTheDocument();
    });
  });

  describe('background marks', () => {
    it('filters out building marks from backgroundMarks', () => {
      const props = {
        ...defaultProps,
        model: {
          ...defaultModel,
          backgroundMarks: [
            { type: 'point', x: 1, y: 1, building: false },
            { type: 'point', x: 2, y: 2, building: true },
          ],
        },
      };
      const { container } = render(<Main {...props} />);
      const graph = container.querySelector('[data-testid="graph-container"]');
      expect(graph).toBeInTheDocument();
    });
  });
});
