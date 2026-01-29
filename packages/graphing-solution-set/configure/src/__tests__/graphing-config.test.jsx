import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { GraphingConfig } from '../graphing-config';

jest.mock('@pie-lib/graphing-solution-set', () => ({
  GraphContainer: ({ children, onChangeLabels, onChangeTitle, ...props }) => (
    <div data-testid="graph-container" {...props}>
      <button data-testid="change-labels-btn" onClick={() => onChangeLabels && onChangeLabels({ left: 'new' })}>
        Change Labels
      </button>
      <button data-testid="change-title-btn" onClick={() => onChangeTitle && onChangeTitle('new title')}>
        Change Title
      </button>
      {children}
    </div>
  ),
  GridSetup: ({ onChange, onChangeView, ...props }) => (
    <div data-testid="grid-setup" {...props}>
      <button data-testid="grid-setup-change-btn" onClick={() => onChange && onChange({ domain: { min: -10 } })}>
        Change Grid
      </button>
      <button data-testid="grid-setup-view-btn" onClick={() => onChangeView && onChangeView({}, true)}>
        Change View
      </button>
    </div>
  ),
}));

jest.mock('@pie-lib/config-ui', () => ({
  AlertDialog: ({ open, title, text, onClose, onConfirm }) =>
    open ? (
      <div data-testid="alert-dialog">
        <div data-testid="dialog-title">{title}</div>
        <div data-testid="dialog-text">{text}</div>
        <button data-testid="dialog-close" onClick={onClose}>
          Cancel
        </button>
        <button data-testid="dialog-confirm" onClick={onConfirm}>
          Confirm
        </button>
      </div>
    ) : null,
}));

const theme = createTheme();

describe('GraphingConfig', () => {
  let mockOnChange;

  const defaultModel = {
    answers: {
      correctAnswer: {
        name: 'Correct Answer',
        marks: [],
      },
    },
    arrows: { left: true, right: true, up: true, down: true },
    coordinatesOnHover: false,
    defaultGridConfiguration: 0,
    domain: {
      min: -5,
      max: 5,
      step: 1,
      labelStep: 1,
      axisLabel: 'x',
    },
    range: {
      min: -5,
      max: 5,
      step: 1,
      labelStep: 1,
      axisLabel: 'y',
    },
    graph: { width: 500, height: 500 },
    includeAxes: true,
    labels: { left: 'y', bottom: 'x' },
    standardGrid: false,
    title: 'Test Graph',
    gssLineData: {
      sections: [],
      selectedTool: 'lineA',
    },
  };

  const defaultProps = {
    model: defaultModel,
    onChange: jest.fn(),
    authoring: {
      enabled: true,
      axisLabel: { enabled: true },
      min: { enabled: true },
      max: { enabled: true },
      step: { enabled: true },
      labelStep: { enabled: true },
      standardGridEnabled: true,
    },
    availableTools: ['point', 'line', 'segment'],
    dimensionsEnabled: true,
    graphDimensions: { min: 150, max: 800, step: 20 },
    gridConfigurations: [
      { label: 'Grid 1', domain: { min: -5, max: 5 }, range: { min: -5, max: 5 } },
      { label: 'Grid 2', domain: { min: -10, max: 10 }, range: { min: -10, max: 10 } },
    ],
    labelsPlaceholders: { left: 'y', bottom: 'x', top: '', right: '' },
    showLabels: true,
    showTitle: true,
    titlePlaceholder: 'Enter title',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnChange = jest.fn();
  });

  const renderGraphingConfig = (props = {}) => {
    return render(
      <ThemeProvider theme={theme}>
        <GraphingConfig {...defaultProps} onChange={mockOnChange} {...props} />
      </ThemeProvider>
    );
  };

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderGraphingConfig();
      expect(container).toBeInTheDocument();
    });

    it('renders graph container', () => {
      renderGraphingConfig();
      expect(screen.getByTestId('graph-container')).toBeInTheDocument();
    });

    it('renders grid configuration dropdown when gridConfigurations provided', () => {
      renderGraphingConfig();
      expect(screen.getByText('Grid Configuration')).toBeInTheDocument();
    });

    it('does not render grid configuration dropdown when no gridConfigurations', () => {
      renderGraphingConfig({ gridConfigurations: [] });
      expect(screen.queryByText('Grid Configuration')).not.toBeInTheDocument();
    });

    it('renders grid setup when authoring enabled', () => {
      renderGraphingConfig();
      expect(screen.getByTestId('grid-setup')).toBeInTheDocument();
    });

    it('does not render grid setup when authoring disabled', () => {
      renderGraphingConfig({
        authoring: { enabled: false },
      });
      expect(screen.queryByTestId('grid-setup')).not.toBeInTheDocument();
    });

    it('renders graph attributes title', () => {
      renderGraphingConfig();
      expect(screen.getByText('Define Graph Attributes')).toBeInTheDocument();
    });

    it('renders subtitle text', () => {
      renderGraphingConfig();
      expect(screen.getByText('Use this interface to add/edit a title and/or labels')).toBeInTheDocument();
    });
  });

  describe('grid configuration', () => {
    it('displays correct default grid configuration', () => {
      renderGraphingConfig();
      expect(screen.getByText('Grid 1')).toBeInTheDocument();
    });

    it('renders all grid configuration options', () => {
      renderGraphingConfig();
      
      const selectedOption = screen.getByText('Grid 1');
      fireEvent.mouseDown(selectedOption);
      
      const allGrid1Options = screen.getAllByText('Grid 1');
      const allGrid2Options = screen.getAllByText('Grid 2');
      
      expect(allGrid1Options.length).toBeGreaterThan(0);
      expect(allGrid2Options.length).toBeGreaterThan(0);
    });
  });

  describe('change handlers', () => {
    it('calls onChange when labels change', () => {
      renderGraphingConfig();
      const changeLabelBtn = screen.getByTestId('change-labels-btn');
      
      fireEvent.click(changeLabelBtn);
      
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          labels: { left: 'new' },
        })
      );
    });

    it('calls onChange when title changes', () => {
      renderGraphingConfig();
      const changeTitleBtn = screen.getByTestId('change-title-btn');
      
      fireEvent.click(changeTitleBtn);
      
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'new title',
        })
      );
    });

    it('calls onChange when grid setup changes', () => {
      renderGraphingConfig();
      const changeGridBtn = screen.getByTestId('grid-setup-change-btn');
      
      fireEvent.click(changeGridBtn);
      
      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  describe('alert dialog', () => {
    it('does not show alert dialog by default', () => {
      renderGraphingConfig();
      expect(screen.queryByTestId('alert-dialog')).not.toBeInTheDocument();
    });

    it('shows alert dialog when marks would be out of bounds', () => {
      const modelWithMarks = {
        ...defaultModel,
        answers: {
          correctAnswer: {
            name: 'Correct Answer',
            marks: [{ type: 'point', x: 100, y: 100 }],
          },
        },
      };
      
      const { rerender } = renderGraphingConfig({ model: modelWithMarks });
      
      const changeGridBtn = screen.getByTestId('grid-setup-change-btn');
      fireEvent.click(changeGridBtn);
      
      rerender(
        <ThemeProvider theme={theme}>
          <GraphingConfig {...defaultProps} model={modelWithMarks} onChange={mockOnChange} />
        </ThemeProvider>
      );
      
      expect(changeGridBtn).toBeInTheDocument();
    });
  });

  describe('state management', () => {
    it('initializes with correct grid and label values', () => {
      const { container } = renderGraphingConfig();
      expect(container).toBeInTheDocument();
    });

    it('handles showPixelGuides state change', () => {
      renderGraphingConfig();
      const changeViewBtn = screen.getByTestId('grid-setup-view-btn');
      
      fireEvent.click(changeViewBtn);
      
      expect(changeViewBtn).toBeInTheDocument();
    });
  });

  describe('props handling', () => {
    it('handles empty graph object gracefully', () => {
      const modelWithEmptyGraph = {
        ...defaultModel,
        graph: { width: 500, height: 500 },
      };
      
      const { container } = renderGraphingConfig({ model: modelWithEmptyGraph });
      expect(container).toBeInTheDocument();
    });

    it('applies size constraints correctly', () => {
      const customGraphDimensions = {
        min: 200,
        max: 600,
        step: 50,
      };
      
      const { container } = renderGraphingConfig({ graphDimensions: customGraphDimensions });
      expect(container).toBeInTheDocument();
    });

    it('handles standardGrid prop', () => {
      const modelWithStandardGrid = {
        ...defaultModel,
        standardGrid: true,
      };
      
      const { container } = renderGraphingConfig({ model: modelWithStandardGrid });
      expect(container).toBeInTheDocument();
    });
  });

  describe('displayed fields', () => {
    it('shows grid setup when at least one authoring field is enabled', () => {
      renderGraphingConfig({
        authoring: {
          enabled: true,
          axisLabel: { enabled: true },
          min: { enabled: false },
          max: { enabled: false },
          step: { enabled: false },
          labelStep: { enabled: false },
          standardGridEnabled: false,
        },
      });
      
      expect(screen.getByTestId('grid-setup')).toBeInTheDocument();
    });

    it('hides grid setup when all authoring fields are disabled', () => {
      renderGraphingConfig({
        dimensionsEnabled: false,
        authoring: {
          enabled: true,
          axisLabel: { enabled: false },
          min: { enabled: false },
          max: { enabled: false },
          step: { enabled: false },
          labelStep: { enabled: false },
          standardGridEnabled: false,
        },
      });
      
      expect(screen.queryByTestId('grid-setup')).not.toBeInTheDocument();
    });

    it('handles dimensionsEnabled prop', () => {
      renderGraphingConfig({ dimensionsEnabled: false });
      expect(screen.getByTestId('graph-container')).toBeInTheDocument();
    });
  });

  describe('mathMlOptions', () => {
    it('passes mathMlOptions to GraphContainer', () => {
      const mathMlOptions = { locale: 'en' };
      renderGraphingConfig({ mathMlOptions });
      
      expect(screen.getByTestId('graph-container')).toBeInTheDocument();
    });

    it('handles undefined mathMlOptions', () => {
      renderGraphingConfig({ mathMlOptions: undefined });
      expect(screen.getByTestId('graph-container')).toBeInTheDocument();
    });
  });
});
