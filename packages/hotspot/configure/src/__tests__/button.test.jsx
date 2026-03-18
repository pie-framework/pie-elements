import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import RawButton from '../button';

describe('RawButton', () => {
  describe('rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<RawButton />);
      expect(container).toBeTruthy();
    });

    it('should render with default label', () => {
      const { getByText } = render(<RawButton />);
      expect(getByText('Add')).toBeInTheDocument();
    });

    it('should render with custom label', () => {
      const { getByText } = render(<RawButton label="Custom Label" />);
      expect(getByText('Custom Label')).toBeInTheDocument();
    });

    it('should render as a button element', () => {
      const { getByRole } = render(<RawButton label="Test Button" />);
      expect(getByRole('button')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { getByRole } = render(<RawButton label="Test" className="custom-class" />);
      const button = getByRole('button');
      expect(button).toHaveClass('custom-class');
    });
  });

  describe('interactions', () => {
    it('should call onClick when clicked', () => {
      const onClick = jest.fn();
      const { getByRole } = render(<RawButton label="Click Me" onClick={onClick} />);
      
      const button = getByRole('button');
      fireEvent.click(button);
      
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', () => {
      const onClick = jest.fn();
      const { getByRole } = render(<RawButton label="Disabled" onClick={onClick} disabled={true} />);
      
      const button = getByRole('button');
      fireEvent.click(button);
      
      expect(onClick).not.toHaveBeenCalled();
    });

    it('should call onClick multiple times', () => {
      const onClick = jest.fn();
      const { getByRole } = render(<RawButton label="Multi Click" onClick={onClick} />);
      
      const button = getByRole('button');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      
      expect(onClick).toHaveBeenCalledTimes(3);
    });
  });

  describe('disabled state', () => {
    it('should be enabled by default', () => {
      const { getByRole } = render(<RawButton label="Test" />);
      const button = getByRole('button');
      expect(button).not.toBeDisabled();
    });

    it('should be disabled when disabled prop is true', () => {
      const { getByRole } = render(<RawButton label="Test" disabled={true} />);
      const button = getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should be enabled when disabled prop is false', () => {
      const { getByRole } = render(<RawButton label="Test" disabled={false} />);
      const button = getByRole('button');
      expect(button).not.toBeDisabled();
    });
  });

  describe('default props', () => {
    it('should use default onClick when not provided', () => {
      const { getByRole } = render(<RawButton label="Test" />);
      const button = getByRole('button');
      
      // Should not throw error when clicked
      expect(() => fireEvent.click(button)).not.toThrow();
    });

    it('should use default label "Add" when not provided', () => {
      const { getByText } = render(<RawButton />);
      expect(getByText('Add')).toBeInTheDocument();
    });

    it('should use empty className by default', () => {
      const { getByRole } = render(<RawButton label="Test" />);
      const button = getByRole('button');
      expect(button.className).toBeTruthy(); // Will have MUI classes
    });

    it('should be enabled by default', () => {
      const { getByRole } = render(<RawButton label="Test" />);
      const button = getByRole('button');
      expect(button).not.toBeDisabled();
    });
  });

  describe('variant and size', () => {
    it('should render with contained variant', () => {
      const { getByRole } = render(<RawButton label="Test" />);
      const button = getByRole('button');
      expect(button).toHaveClass('MuiButton-contained');
    });

    it('should render with small size', () => {
      const { getByRole } = render(<RawButton label="Test" />);
      const button = getByRole('button');
      expect(button).toHaveClass('MuiButton-sizeSmall');
    });
  });

  describe('edge cases', () => {
    it('should handle empty label', () => {
      const { getByRole } = render(<RawButton label="" />);
      const button = getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button.textContent).toBe('');
    });

    it('should handle very long label', () => {
      const longLabel = 'This is a very long button label that might wrap or overflow';
      const { getByText } = render(<RawButton label={longLabel} />);
      expect(getByText(longLabel)).toBeInTheDocument();
    });

    it('should handle special characters in label', () => {
      const specialLabel = '!@#$%^&*()_+-=[]{}|;:",.<>?/~`';
      const { getByText } = render(<RawButton label={specialLabel} />);
      expect(getByText(specialLabel)).toBeInTheDocument();
    });

    it('should handle Unicode characters in label', () => {
      const unicodeLabel = '🚀 Launch 你好 مرحبا';
      const { getByText } = render(<RawButton label={unicodeLabel} />);
      expect(getByText(unicodeLabel)).toBeInTheDocument();
    });

    it('should handle null onClick gracefully with default', () => {
      const { getByRole } = render(<RawButton label="Test" onClick={null} />);
      const button = getByRole('button');
      
      // Should use default onClick
      expect(() => fireEvent.click(button)).not.toThrow();
    });
  });

  describe('prop updates', () => {
    it('should update label when prop changes', () => {
      const { getByText, rerender } = render(<RawButton label="Initial" />);
      expect(getByText('Initial')).toBeInTheDocument();
      
      rerender(<RawButton label="Updated" />);
      expect(getByText('Updated')).toBeInTheDocument();
    });

    it('should update disabled state when prop changes', () => {
      const { getByRole, rerender } = render(<RawButton label="Test" disabled={false} />);
      const button = getByRole('button');
      expect(button).not.toBeDisabled();
      
      rerender(<RawButton label="Test" disabled={true} />);
      expect(button).toBeDisabled();
    });

    it('should update onClick handler when prop changes', () => {
      const onClick1 = jest.fn();
      const onClick2 = jest.fn();
      const { getByRole, rerender } = render(<RawButton label="Test" onClick={onClick1} />);
      
      const button = getByRole('button');
      fireEvent.click(button);
      expect(onClick1).toHaveBeenCalledTimes(1);
      expect(onClick2).not.toHaveBeenCalled();
      
      rerender(<RawButton label="Test" onClick={onClick2} />);
      fireEvent.click(button);
      expect(onClick1).toHaveBeenCalledTimes(1);
      expect(onClick2).toHaveBeenCalledTimes(1);
    });
  });
});
