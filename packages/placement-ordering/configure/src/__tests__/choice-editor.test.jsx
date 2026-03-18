import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChoiceEditor from '../choice-editor';

// Mock dependencies
jest.mock('@pie-lib/render-ui', () => ({
  InputContainer: ({ label, children }) => (
    <div data-testid="input-container">
      {label && <div className="input-container-label">{label}</div>}
      {children}
    </div>
  ),
}));

jest.mock('@pie-lib/config-ui', () => ({
  AlertDialog: ({ open, title, text, onConfirm }) =>
    open ? (
      <div data-testid="alert-dialog">
        <div data-testid="alert-title">{title}</div>
        <div data-testid="alert-text">{text}</div>
        <button data-testid="alert-confirm" onClick={onConfirm}>
          Confirm
        </button>
      </div>
    ) : null,
}));

jest.mock('../choice-tile', () => ({
  __esModule: true,
  default: ({ choice, onDelete, onChoiceChange, error }) => (
    <div data-testid={`choice-tile-${choice.type}-${choice.id}`}>
      <div data-testid={`choice-label-${choice.type}-${choice.id}`}>{choice.label}</div>
      <button data-testid={`delete-${choice.type}-${choice.id}`} onClick={onDelete}>
        Delete
      </button>
      <button
        data-testid={`change-${choice.type}-${choice.id}`}
        onClick={() => onChoiceChange({ ...choice, label: 'Updated' })}
      >
        Change
      </button>
      {error && <div data-testid={`error-${choice.type}-${choice.id}`}>{error}</div>}
    </div>
  ),
}));

describe('ChoiceEditor', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      choices: [
        { id: 'c1', label: 'Choice 1' },
        { id: 'c2', label: 'Choice 2' },
        { id: 'c3', label: 'Choice 3' },
      ],
      correctResponse: [
        { id: 'c1', weight: 0 },
        { id: 'c2', weight: 0 },
        { id: 'c3', weight: 0 },
      ],
      onChange: jest.fn(),
      imageSupport: {
        add: jest.fn(),
        delete: jest.fn(),
      },
      singularChoiceLabel: 'choice',
      pluralChoiceLabel: 'choices',
      choicesLabel: 'Choices',
      ordering: {
        tiles: [
          { id: 'c1', label: 'Choice 1', type: 'choice' },
          { id: 'c2', label: 'Choice 2', type: 'choice' },
          { id: 'c3', label: 'Choice 3', type: 'choice' },
          { id: 'c1', label: 'Choice 1', type: 'target' },
          { id: 'c2', label: 'Choice 2', type: 'target' },
          { id: 'c3', label: 'Choice 3', type: 'target' },
        ],
      },
      errors: {},
    };
  });

  describe('rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<ChoiceEditor {...defaultProps} />);
      expect(container).toBeTruthy();
    });

    it('should render column labels', () => {
      render(<ChoiceEditor {...defaultProps} />);
      expect(screen.getByText('Student Choices')).toBeInTheDocument();
      expect(screen.getByText('Correct Order')).toBeInTheDocument();
    });

    it('should render all choice tiles', () => {
      render(<ChoiceEditor {...defaultProps} />);
      expect(screen.getByTestId('choice-tile-choice-c1')).toBeInTheDocument();
      expect(screen.getByTestId('choice-tile-choice-c2')).toBeInTheDocument();
      expect(screen.getByTestId('choice-tile-choice-c3')).toBeInTheDocument();
      expect(screen.getByTestId('choice-tile-target-c1')).toBeInTheDocument();
      expect(screen.getByTestId('choice-tile-target-c2')).toBeInTheDocument();
      expect(screen.getByTestId('choice-tile-target-c3')).toBeInTheDocument();
    });

    it('should render shuffle button', () => {
      render(<ChoiceEditor {...defaultProps} />);
      expect(screen.getByText('SHUFFLE CHOICES')).toBeInTheDocument();
    });

    it('should render add button', () => {
      render(<ChoiceEditor {...defaultProps} />);
      expect(screen.getByText('ADD CHOICE')).toBeInTheDocument();
    });

    it('should use custom choice labels', () => {
      const props = {
        ...defaultProps,
        singularChoiceLabel: 'item',
        pluralChoiceLabel: 'items',
        choicesLabel: 'Items',
      };
      render(<ChoiceEditor {...props} />);
      expect(screen.getByText('SHUFFLE ITEMS')).toBeInTheDocument();
      expect(screen.getByText('ADD ITEM')).toBeInTheDocument();
      expect(screen.getByText('Student Items')).toBeInTheDocument();
    });
  });

  describe('adding choices', () => {
    it('should add a new choice when add button is clicked', () => {
      render(<ChoiceEditor {...defaultProps} />);
      const addButton = screen.getByText('ADD CHOICE');

      fireEvent.click(addButton);

      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          ...defaultProps.choices,
          { id: 'c4', label: '' },
        ]),
        expect.arrayContaining([
          ...defaultProps.correctResponse,
          { id: 'c4', weight: 0 },
        ]),
      );
    });

    it('should show warning when trying to add more than 10 choices', () => {
      const props = {
        ...defaultProps,
        choices: Array.from({ length: 10 }, (_, i) => ({
          id: `c${i + 1}`,
          label: `Choice ${i + 1}`,
        })),
        ordering: {
          tiles: Array.from({ length: 10 }, (_, i) => ({
            id: `c${i + 1}`,
            label: `Choice ${i + 1}`,
            type: 'choice',
          })),
        },
      };

      render(<ChoiceEditor {...props} />);
      const addButton = screen.getByText('ADD CHOICE');

      fireEvent.click(addButton);

      expect(screen.getByTestId('alert-dialog')).toBeInTheDocument();
      expect(screen.getByText('There can be maximum 10 Choices.')).toBeInTheDocument();
    });

    it('should find free slot when adding choice', () => {
      const props = {
        ...defaultProps,
        choices: [
          { id: 'c1', label: 'Choice 1' },
          { id: 'c3', label: 'Choice 3' },
        ],
        correctResponse: [
          { id: 'c1', weight: 0 },
          { id: 'c3', weight: 0 },
        ],
        ordering: {
          tiles: [
            { id: 'c1', label: 'Choice 1', type: 'choice' },
            { id: 'c3', label: 'Choice 3', type: 'choice' },
          ],
        },
      };

      render(<ChoiceEditor {...props} />);
      const addButton = screen.getByText('ADD CHOICE');

      fireEvent.click(addButton);

      expect(props.onChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          ...props.choices,
          { id: 'c2', label: '' },
        ]),
        expect.anything(),
      );
    });
  });

  describe('deleting choices', () => {
    it('should show warning when trying to delete with only 3 choices', () => {
      render(<ChoiceEditor {...defaultProps} />);
      const deleteButton = screen.getByTestId('delete-choice-c1');

      fireEvent.click(deleteButton);

      expect(screen.getByTestId('alert-dialog')).toBeInTheDocument();
      expect(screen.getByText('There have to be at least 3 Choices.')).toBeInTheDocument();
    });

    it('should allow deletion when more than 3 choices exist', () => {
      const props = {
        ...defaultProps,
        choices: [
          { id: 'c1', label: 'Choice 1' },
          { id: 'c2', label: 'Choice 2' },
          { id: 'c3', label: 'Choice 3' },
          { id: 'c4', label: 'Choice 4' },
        ],
        ordering: {
          tiles: [
            { id: 'c1', label: 'Choice 1', type: 'choice' },
            { id: 'c2', label: 'Choice 2', type: 'choice' },
            { id: 'c3', label: 'Choice 3', type: 'choice' },
            { id: 'c4', label: 'Choice 4', type: 'choice' },
          ],
        },
      };

      render(<ChoiceEditor {...props} />);
      const deleteButton = screen.getByTestId('delete-choice-c1');

      fireEvent.click(deleteButton);

      expect(props.onChange).toHaveBeenCalled();
      expect(screen.queryByTestId('alert-dialog')).not.toBeInTheDocument();
    });
  });

  describe('changing choices', () => {
    it('should update choice label when changed', () => {
      render(<ChoiceEditor {...defaultProps} />);
      const changeButton = screen.getByTestId('change-choice-c1');

      fireEvent.click(changeButton);

      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          { id: 'c1', label: 'Updated' },
          { id: 'c2', label: 'Choice 2' },
          { id: 'c3', label: 'Choice 3' },
        ]),
        defaultProps.correctResponse,
      );
    });
  });

  describe('shuffling choices', () => {
    it('should shuffle choices when shuffle button is clicked', () => {
      render(<ChoiceEditor {...defaultProps} />);
      const shuffleButton = screen.getByText('SHUFFLE CHOICES');

      fireEvent.click(shuffleButton);

      expect(defaultProps.onChange).toHaveBeenCalled();
      const [shuffledChoices] = defaultProps.onChange.mock.calls[0];
      expect(shuffledChoices).toHaveLength(3);
      expect(shuffledChoices.map((c) => c.id).sort()).toEqual(['c1', 'c2', 'c3']);
    });

    it('should shuffle again if result matches correct order when placementArea is disabled', () => {
      const props = {
        ...defaultProps,
        placementArea: false,
      };

      // Mock shuffle to return the same order first time
      const originalMath = Math.random;
      let callCount = 0;
      Math.random = () => {
        callCount++;
        // First call returns ordered, second returns shuffled
        return callCount === 1 ? 0.1 : 0.9;
      };

      render(<ChoiceEditor {...props} />);
      const shuffleButton = screen.getByText('SHUFFLE CHOICES');

      fireEvent.click(shuffleButton);

      expect(props.onChange).toHaveBeenCalled();

      Math.random = originalMath;
    });
  });

  describe('alert dialog', () => {
    it('should close warning dialog when confirm is clicked', () => {
      render(<ChoiceEditor {...defaultProps} />);
      const deleteButton = screen.getByTestId('delete-choice-c1');

      fireEvent.click(deleteButton);
      expect(screen.getByTestId('alert-dialog')).toBeInTheDocument();

      const confirmButton = screen.getByTestId('alert-confirm');
      fireEvent.click(confirmButton);

      expect(screen.queryByTestId('alert-dialog')).not.toBeInTheDocument();
    });
  });

  describe('errors', () => {
    it('should display choice errors', () => {
      const props = {
        ...defaultProps,
        errors: {
          choicesErrors: {
            c1: 'Choice is required',
          },
        },
      };

      render(<ChoiceEditor {...props} />);
      // Error appears on both choice and target tiles for the same id
      expect(screen.getAllByTestId(/error-.*-c1/)[0]).toHaveTextContent('Choice is required');
    });

    it('should display order error', () => {
      const props = {
        ...defaultProps,
        errors: {
          orderError: 'Order must be different',
        },
      };

      render(<ChoiceEditor {...props} />);
      expect(screen.getByText('Order must be different')).toBeInTheDocument();
    });
  });
});
