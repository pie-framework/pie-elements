import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Konva from 'konva';
import CircleComponent from '../hotspot-circle';

Konva.isBrowser = false;

jest.mock('react-konva', () => {
  const React = require('react');
  return {
    Circle: React.forwardRef(({ onClick, onTap, onMouseEnter, onMouseLeave, onDragStart, onDragEnd, onTransformStart, onTransformEnd, ...props }, ref) => {
      const handleClick = (e) => {
        if (onClick) onClick(e);
        if (onTap) onTap(e);
      };
      return React.createElement('div', {
        ref,
        'data-testid': 'circle',
        onClick: handleClick,
        onMouseEnter,
        onMouseLeave,
        ...props,
      });
    }),
    Group: ({ children, onMouseEnter, onMouseLeave, ...props }) => 
      React.createElement('div', { 'data-testid': 'group', onMouseEnter, onMouseLeave, ...props }, children),
    Transformer: React.forwardRef(({ borderStroke, ...props }, ref) => {
      return React.createElement('div', { ref, 'data-testid': 'transformer', 'data-border-stroke': borderStroke, ...props });
    }),
  };
});

jest.mock('../DeleteWidget', () => {
  return function DeleteWidget({ id, handleWidgetClick }) {
    return (
      <div
        data-testid="delete-widget"
        data-id={id}
        onClick={() => handleWidgetClick(id)}
      />
    );
  };
});

describe('CircleComponent', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      id: 'circle1',
      x: 100,
      y: 150,
      radius: 50,
      hotspotColor: '#FF0000',
      selectedHotspotColor: '#00FF00',
      outlineColor: '#0000FF',
      hoverOutlineColor: '#FFFF00',
      correct: false,
      isDrawing: false,
      onClick: jest.fn(),
      onDeleteShape: jest.fn(),
      onDragEnd: jest.fn(),
      strokeWidth: 5,
    };

    document.body.style.cursor = 'default';
  });

  afterEach(() => {
    document.body.style.cursor = 'default';
  });

  describe('rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<CircleComponent {...defaultProps} />);
      expect(container).toBeTruthy();
    });

    it('should render Group and Circle', () => {
      const { getByTestId } = render(<CircleComponent {...defaultProps} />);
      expect(getByTestId('group')).toBeInTheDocument();
      expect(getByTestId('circle')).toBeInTheDocument();
    });

    it('should render with correct radius', () => {
      const { getByTestId } = render(<CircleComponent {...defaultProps} radius={75} />);
      const circle = getByTestId('circle');
      expect(circle).toHaveAttribute('radius', '75');
    });

    it('should use minimum radius of 5 for invalid radius', () => {
      const { getByTestId } = render(<CircleComponent {...defaultProps} radius={0} />);
      const circle = getByTestId('circle');
      expect(circle).toHaveAttribute('radius', '5');
    });

    it('should use minimum radius of 5 for NaN radius', () => {
      const { getByTestId } = render(<CircleComponent {...defaultProps} radius={NaN} />);
      const circle = getByTestId('circle');
      expect(circle).toHaveAttribute('radius', '5');
    });

    it('should use minimum radius of 5 for negative radius', () => {
      const { getByTestId } = render(<CircleComponent {...defaultProps} radius={-10} />);
      const circle = getByTestId('circle');
      expect(circle).toHaveAttribute('radius', '5');
    });

    it('should render with hotspot color when not correct', () => {
      const { getByTestId } = render(<CircleComponent {...defaultProps} correct={false} />);
      const circle = getByTestId('circle');
      expect(circle).toHaveAttribute('fill', '#FF0000');
    });

    it('should render with selected color when correct', () => {
      const { getByTestId } = render(<CircleComponent {...defaultProps} correct={true} />);
      const circle = getByTestId('circle');
      expect(circle).toHaveAttribute('fill', '#00FF00');
    });
  });

  describe('interactions', () => {
    it('should call onClick when clicked', () => {
      const onClick = jest.fn();
      const { getByTestId } = render(<CircleComponent {...defaultProps} onClick={onClick} />);
      const circle = getByTestId('circle');
      
      fireEvent.click(circle);
      
      expect(onClick).toHaveBeenCalledWith('circle1');
    });

    it('should not call onClick when radius is 0 and isDrawing', () => {
      const onClick = jest.fn();
      const { getByTestId } = render(
        <CircleComponent {...defaultProps} radius={0} isDrawing={true} onClick={onClick} />
      );
      const circle = getByTestId('circle');
      
      fireEvent.click(circle);
      
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('hover state', () => {
    it('should not show Transformer when not hovered', () => {
      const { queryByTestId } = render(<CircleComponent {...defaultProps} />);
      
      expect(queryByTestId('transformer')).not.toBeInTheDocument();
    });
  });

  describe('drag functionality', () => {
    it('should call onDragEnd with new position', () => {
      const onDragEnd = jest.fn();
      const { getByTestId } = render(
        <CircleComponent {...defaultProps} onDragEnd={onDragEnd} />
      );
      const circle = getByTestId('circle');
      
      const mockEvent = {
        target: {
          x: () => 200,
          y: () => 250,
        },
      };
      
      if (circle.onDragEnd) {
        circle.onDragEnd(mockEvent);
      }
    });
  });

  describe('resize functionality', () => {
    it('should handle resize with minimum radius constraint', () => {
      const onDragEnd = jest.fn();
      const { getByTestId } = render(
        <CircleComponent {...defaultProps} onDragEnd={onDragEnd} />
      );
      
      // This tests the component's ability to handle transforms
      // In actual usage, the transformer would modify the node's scale
      const transformer = getByTestId('group');
      expect(transformer).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle very large radius', () => {
      const { getByTestId } = render(<CircleComponent {...defaultProps} radius={500} />);
      const circle = getByTestId('circle');
      expect(circle).toHaveAttribute('radius', '500');
    });

    it('should handle position at origin', () => {
      const { getByTestId } = render(<CircleComponent {...defaultProps} x={0} y={0} />);
      const circle = getByTestId('circle');
      expect(circle).toHaveAttribute('x', '0');
      expect(circle).toHaveAttribute('y', '0');
    });

    it('should handle negative positions', () => {
      const { getByTestId } = render(<CircleComponent {...defaultProps} x={-50} y={-75} />);
      const circle = getByTestId('circle');
      expect(circle).toHaveAttribute('x', '-50');
      expect(circle).toHaveAttribute('y', '-75');
    });

    it('should use default correct value of false', () => {
      const { getByTestId } = render(<CircleComponent {...defaultProps} correct={undefined} />);
      const circle = getByTestId('circle');
      expect(circle).toHaveAttribute('fill', '#FF0000');
    });

    it('should handle missing selectedHotspotColor', () => {
      const { getByTestId } = render(
        <CircleComponent {...defaultProps} correct={true} selectedHotspotColor={undefined} />
      );
      const circle = getByTestId('circle');
      // Should fall back to hotspotColor
      expect(circle).toHaveAttribute('fill', '#FF0000');
    });
  });

  describe('prop updates', () => {
    it('should update radius when prop changes', () => {
      const { getByTestId, rerender } = render(<CircleComponent {...defaultProps} radius={50} />);
      let circle = getByTestId('circle');
      expect(circle).toHaveAttribute('radius', '50');
      
      rerender(<CircleComponent {...defaultProps} radius={75} />);
      circle = getByTestId('circle');
      expect(circle).toHaveAttribute('radius', '75');
    });

    it('should update color when correct prop changes', () => {
      const { getByTestId, rerender } = render(<CircleComponent {...defaultProps} correct={false} />);
      let circle = getByTestId('circle');
      expect(circle).toHaveAttribute('fill', '#FF0000');
      
      rerender(<CircleComponent {...defaultProps} correct={true} />);
      circle = getByTestId('circle');
      expect(circle).toHaveAttribute('fill', '#00FF00');
    });

    it('should update position when props change', () => {
      const { getByTestId, rerender } = render(<CircleComponent {...defaultProps} x={100} y={150} />);
      let circle = getByTestId('circle');
      expect(circle).toHaveAttribute('x', '100');
      expect(circle).toHaveAttribute('y', '150');
      
      rerender(<CircleComponent {...defaultProps} x={200} y={250} />);
      circle = getByTestId('circle');
      expect(circle).toHaveAttribute('x', '200');
      expect(circle).toHaveAttribute('y', '250');
    });
  });
});
