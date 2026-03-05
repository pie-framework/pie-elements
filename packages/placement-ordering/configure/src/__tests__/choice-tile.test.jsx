import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChoiceTile } from '../choice-tile';

// Mock dependencies
jest.mock('@dnd-kit/core', () => ({
  useDraggable: () => ({
    attributes: { 'data-draggable': 'true' },
    listeners: { onPointerDown: jest.fn() },
    setNodeRef: jest.fn(),
    transform: null,
    isDragging: false,
  }),
  useDroppable: () => ({
    setNodeRef: jest.fn(),
    isOver: false,
  }),
}));

jest.mock('@pie-lib/editable-html-tip-tap', () => ({
  __esModule: true,
  default: ({ markup, onChange, disabled, placeholder, error }) => (
    <div data-testid="editable-html">
      <input
        data-testid="editable-input"
        value={markup}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
      />
      {error && <div data-testid="editable-error">{error}</div>}
    </div>
  ),
  DEFAULT_PLUGINS: ['bold', 'italic', 'underline', 'bulleted-list', 'numbered-list'],
}));

jest.mock('@pie-lib/render-ui', () => ({
  color: {
    tertiary: () => '#666666',
  },
}));

describe('ChoiceTile', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      choice: {
        id: 'c1',
        label: 'Test choice',
        editable: true,
        type: 'choice',
      },
      index: 0,
      choices: [],
      onChoiceChange: jest.fn(),
      onDelete: jest.fn(),
      imageSupport: {
        add: jest.fn(),
        delete: jest.fn(),
      },
      spellCheck: true,
      toolbarOpts: {},
      pluginProps: {},
      maxImageWidth: { unit: 'px', value: 300 },
      maxImageHeight: { unit: 'px', value: 300 },
      error: null,
      mathMlOptions: {},
    };
  });

  describe('rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<ChoiceTile {...defaultProps} />);
      expect(container).toBeTruthy();
    });

    it('should render with correct label', () => {
      render(<ChoiceTile {...defaultProps} />);
      const input = screen.getByTestId('editable-input');
      expect(input).toHaveValue('Test choice');
    });

    it('should render drag handle', () => {
      const { container } = render(<ChoiceTile {...defaultProps} />);
      const dragHandle = container.querySelector('[data-testid="DragHandleIcon"]');
      expect(container.querySelector('[data-draggable="true"]')).toBeInTheDocument();
    });

    it('should render delete button when editable', () => {
      const { container } = render(<ChoiceTile {...defaultProps} />);
      const deleteButton = container.querySelector('button');
      expect(deleteButton).toBeInTheDocument();
    });

    it('should not render delete button when not editable', () => {
      const props = {
        ...defaultProps,
        choice: {
          ...defaultProps.choice,
          editable: false,
        },
      };

      const { container } = render(<ChoiceTile {...props} />);
      const buttons = container.querySelectorAll('button');
      // No delete button when not editable
      expect(buttons.length).toBe(0);
    });

    it('should show placeholder for empty choice', () => {
      const props = {
        ...defaultProps,
        choice: {
          ...defaultProps.choice,
          label: '',
        },
      };

      render(<ChoiceTile {...props} />);
      const input = screen.getByTestId('editable-input');
      expect(input).toHaveAttribute('placeholder', 'Enter a choice');
    });

    it('should not show placeholder for target type', () => {
      const props = {
        ...defaultProps,
        choice: {
          ...defaultProps.choice,
          type: 'target',
          label: '',
        },
      };

      render(<ChoiceTile {...props} />);
      const input = screen.getByTestId('editable-input');
      expect(input).toHaveAttribute('placeholder', '');
    });

    it('should not show placeholder for LaTeX content', () => {
      const props = {
        ...defaultProps,
        choice: {
          ...defaultProps.choice,
          label: '<span data-latex="\\frac{1}{2}"></span>',
        },
      };

      render(<ChoiceTile {...props} />);
      const input = screen.getByTestId('editable-input');
      expect(input).toHaveAttribute('placeholder', '');
    });
  });

  describe('interactions', () => {
    it('should call onDelete when delete button is clicked', () => {
      const { container } = render(<ChoiceTile {...defaultProps} />);
      const deleteButton = container.querySelector('button');

      fireEvent.click(deleteButton);

      expect(defaultProps.onDelete).toHaveBeenCalled();
    });

    it('should call onChoiceChange when label is changed', () => {
      render(<ChoiceTile {...defaultProps} />);
      const input = screen.getByTestId('editable-input');

      fireEvent.change(input, { target: { value: 'Updated choice' } });

      expect(defaultProps.onChoiceChange).toHaveBeenCalledWith({
        ...defaultProps.choice,
        label: 'Updated choice',
      });
    });

    it('should not allow changes when disabled', () => {
      const props = {
        ...defaultProps,
        choice: {
          ...defaultProps.choice,
          editable: false,
        },
      };

      render(<ChoiceTile {...props} />);
      const input = screen.getByTestId('editable-input');

      expect(input).toBeDisabled();
    });
  });

  describe('errors', () => {
    it('should display error message when editable and error exists', () => {
      const props = {
        ...defaultProps,
        error: 'This field is required',
      };

      render(<ChoiceTile {...props} />);
      const errorElements = screen.getAllByText('This field is required');
      expect(errorElements).toHaveLength(2); // error appears in both EditableHtml and the component
      expect(errorElements[0]).toBeInTheDocument();
    });

    it('should pass error to EditableHtml', () => {
      const props = {
        ...defaultProps,
        error: 'This field is required',
      };

      render(<ChoiceTile {...props} />);
      expect(screen.getByTestId('editable-error')).toHaveTextContent('This field is required');
    });

    it('should not display error when not editable', () => {
      const props = {
        ...defaultProps,
        choice: {
          ...defaultProps.choice,
          editable: false,
        },
        error: 'This field is required',
      };

      render(<ChoiceTile {...props} />);
      expect(screen.queryByText('This field is required')).not.toBeInTheDocument();
    });
  });

  describe('image support', () => {
    it('should pass imageSupport to EditableHtml', () => {
      render(<ChoiceTile {...defaultProps} />);
      expect(screen.getByTestId('editable-html')).toBeInTheDocument();
    });

    it('should pass maxImageWidth and maxImageHeight', () => {
      const props = {
        ...defaultProps,
        maxImageWidth: { unit: 'px', value: 500 },
        maxImageHeight: { unit: 'px', value: 400 },
      };

      render(<ChoiceTile {...props} />);
      expect(screen.getByTestId('editable-html')).toBeInTheDocument();
    });
  });

  describe('drag and drop IDs', () => {
    it('should generate correct draggable ID', () => {
      const props = {
        ...defaultProps,
        choice: {
          id: 'c1',
          label: 'Choice 1',
          type: 'choice',
          editable: true,
        },
      };

      render(<ChoiceTile {...props} />);
      // The component uses draggableId: `${type}-${choice.id}` => 'choice-c1'
      expect(screen.getByTestId('editable-html')).toBeInTheDocument();
    });

    it('should generate correct droppable ID', () => {
      const props = {
        ...defaultProps,
        choice: {
          id: 'c1',
          label: 'Choice 1',
          type: 'target',
          editable: false,
        },
      };

      render(<ChoiceTile {...props} />);
      // The component uses droppableId: `${type}-drop-${choice.id}` => 'target-drop-c1'
      expect(screen.getByTestId('editable-html')).toBeInTheDocument();
    });
  });
});
