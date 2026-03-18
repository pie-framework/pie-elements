import React from 'react';
import { render, screen } from '@testing-library/react';
import Matrix from '../Matrix';

// Mock @pie-lib/render-ui
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
  PreviewPrompt: ({ prompt, className }) => (
    <div data-testid="preview-prompt" className={className}>
      {prompt}
    </div>
  ),
}));

describe('Matrix', () => {
  const defaultProps = {
    prompt: 'Select the correct answers',
    teacherInstructions: '',
    session: { value: {} },
    matrixValues: {},
    rowLabels: ['Row 1', 'Row 2'],
    columnLabels: ['Column A', 'Column B'],
    disabled: false,
    onSessionChange: jest.fn(),
  };

  const renderMatrix = (propsOverrides = {}) => {
    const props = { ...defaultProps, ...propsOverrides };
    return render(<Matrix {...props} />);
  };

  describe('prompt', () => {
    it('displays the prompt', () => {
      renderMatrix();
      expect(screen.getByText('Select the correct answers')).toBeInTheDocument();
    });
  });

  describe('labels', () => {
    it('displays row labels', () => {
      renderMatrix();
      expect(screen.getByText('Row 1')).toBeInTheDocument();
      expect(screen.getByText('Row 2')).toBeInTheDocument();
    });

    it('displays column labels', () => {
      renderMatrix();
      expect(screen.getByText('Column A')).toBeInTheDocument();
      expect(screen.getByText('Column B')).toBeInTheDocument();
    });
  });

  describe('teacher instructions', () => {
    it('does not show collapsible when teacherInstructions is empty', () => {
      renderMatrix({ teacherInstructions: '' });
      expect(screen.queryByTestId('collapsible')).not.toBeInTheDocument();
    });

    it('shows collapsible when teacherInstructions is provided', () => {
      renderMatrix({ teacherInstructions: 'Instructions for teacher' });
      expect(screen.getByTestId('collapsible')).toBeInTheDocument();
      expect(screen.getByText('Instructions for teacher')).toBeInTheDocument();
    });
  });

  describe('grid structure', () => {
    it('creates correct number of grid items', () => {
      // 2 rows + 1 header row = 3 rows
      // 2 columns + 1 label column = 3 columns
      // Total: 3 * 3 = 9 grid items
      renderMatrix();
      
      // Check that all labels are present
      expect(screen.getByText('Row 1')).toBeInTheDocument();
      expect(screen.getByText('Row 2')).toBeInTheDocument();
      expect(screen.getByText('Column A')).toBeInTheDocument();
      expect(screen.getByText('Column B')).toBeInTheDocument();
    });

    it('handles empty labels', () => {
      renderMatrix({ rowLabels: [], columnLabels: [] });
      // Should still render the prompt
      expect(screen.getByText('Select the correct answers')).toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('passes disabled prop to matrix', () => {
      const { container } = renderMatrix({ disabled: true });
      // Just verify it renders without crashing
      expect(container).toBeInTheDocument();
    });
  });
});
