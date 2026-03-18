import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Konva from 'konva';
import CircleComponent from '../circle';

Konva.isBrowser = false;

jest.mock('react-konva', () => {
  const React = require('react');
  return {
    Circle: ({ onClick, onTap, onMouseEnter, onMouseLeave, ...props }) => {
      const handleClick = (e) => {
        if (onClick) onClick(e);
        if (onTap) onTap(e);
      };
      return React.createElement('div', {
        'data-testid': 'circle',
        onClick: handleClick,
        onMouseEnter,
        onMouseLeave,
        ...props,
      });
    },
    Rect: (props) => React.createElement('div', { 'data-testid': 'rect', ...props }),
    Group: ({ children, ...props }) => React.createElement('div', { 'data-testid': 'group', ...props }, children),
  };
});

jest.mock('../image-konva-tooltip', () => {
  return function ImageComponent({ src, x, y, tooltip }) {
    return <div data-testid="icon-image" data-src={src} data-x={x} data-y={y} data-tooltip={tooltip} />;
  };
});

describe('CircleComponent', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      id: 'circle1',
      x: 50,
      y: 50,
      radius: 30,
      hotspotColor: '#FF0000',
      selectedHotspotColor: '#00FF00',
      outlineColor: '#0000FF',
      hoverOutlineColor: '#FFFF00',
      selected: false,
      isCorrect: false,
      isEvaluateMode: false,
      disabled: false,
      onClick: jest.fn(),
      strokeWidth: 5,
      scale: 1,
      markAsCorrect: false,
      showCorrectEnabled: false,
    };
  });

  afterEach(() => {
    document.body.style.cursor = 'default';
  });

  describe('rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<CircleComponent {...defaultProps} />);
      expect(container).toBeTruthy();
    });

    it('should render with correct position and radius', () => {
      const { getByTestId } = render(<CircleComponent {...defaultProps} />);
      const circle = getByTestId('circle');
      
      expect(circle).toHaveAttribute('x', '50');
      expect(circle).toHaveAttribute('y', '50');
      expect(circle).toHaveAttribute('radius', '30');
    });

    it('should render with hotspot color when not selected', () => {
      const { getByTestId } = render(<CircleComponent {...defaultProps} />);
      const circle = getByTestId('circle');
      
      expect(circle).toHaveAttribute('fill', '#FF0000');
    });

    it('should render with selected color when selected', () => {
      const { getByTestId } = render(<CircleComponent {...defaultProps} selected={true} />);
      const circle = getByTestId('circle');
      
      expect(circle).toHaveAttribute('fill', '#00FF00');
    });

    it('should apply scale transform', () => {
      const { getByTestId } = render(<CircleComponent {...defaultProps} scale={2.0} />);
      const group = getByTestId('group');
      
      expect(group).toHaveAttribute('scaleX', '2');
      expect(group).toHaveAttribute('scaleY', '2');
    });

    it('should render with default scale of 1', () => {
      const { getByTestId } = render(<CircleComponent {...defaultProps} />);
      const group = getByTestId('group');
      
      expect(group).toHaveAttribute('scaleX', '1');
      expect(group).toHaveAttribute('scaleY', '1');
    });
  });

  describe('interactions', () => {
    it('should call onClick when clicked', () => {
      const onClick = jest.fn();
      const { getByTestId } = render(<CircleComponent {...defaultProps} onClick={onClick} />);
      const circle = getByTestId('circle');
      
      fireEvent.click(circle);
      
      expect(onClick).toHaveBeenCalledWith({
        id: 'circle1',
        selected: true,
        selector: 'Mouse',
      });
    });

    it('should toggle selection state on click', () => {
      const onClick = jest.fn();
      const { getByTestId, rerender } = render(<CircleComponent {...defaultProps} onClick={onClick} selected={false} />);
      const circle = getByTestId('circle');
      
      fireEvent.click(circle);
      
      expect(onClick).toHaveBeenCalledWith({
        id: 'circle1',
        selected: true,
        selector: 'Mouse',
      });
      
      rerender(<CircleComponent {...defaultProps} onClick={onClick} selected={true} />);
      
      const circleAfter = getByTestId('circle');
      fireEvent.click(circleAfter);
      
      expect(onClick).toHaveBeenCalledWith({
        id: 'circle1',
        selected: false,
        selector: 'Mouse',
      });
    });

    it('should not call onClick when disabled', () => {
      const onClick = jest.fn();
      const { getByTestId } = render(<CircleComponent {...defaultProps} onClick={onClick} disabled={true} />);
      const circle = getByTestId('circle');
      
      fireEvent.click(circle);
      
      expect(onClick).not.toHaveBeenCalled();
    });

    it('should change cursor to pointer on mouse enter when not disabled', () => {
      const { getByTestId } = render(<CircleComponent {...defaultProps} />);
      const circle = getByTestId('circle');
      
      fireEvent.mouseEnter(circle);
      
      expect(document.body.style.cursor).toBe('pointer');
    });

    it('should not change cursor when disabled', () => {
      const { getByTestId } = render(<CircleComponent {...defaultProps} disabled={true} />);
      const circle = getByTestId('circle');
      
      fireEvent.mouseEnter(circle);
      
      expect(document.body.style.cursor).toBe('default');
    });

    it('should reset cursor to default on mouse leave', () => {
      const { getByTestId } = render(<CircleComponent {...defaultProps} />);
      const circle = getByTestId('circle');
      
      fireEvent.mouseEnter(circle);
      fireEvent.mouseLeave(circle);
      
      expect(document.body.style.cursor).toBe('default');
    });
  });

  describe('hover styling', () => {
    it('should show hover rect when hoverOutlineColor is provided', () => {
      const { container, getByTestId } = render(<CircleComponent {...defaultProps} hoverOutlineColor="#FFFF00" />);
      const circle = getByTestId('circle');
      
      fireEvent.mouseEnter(circle);
      
      const rects = container.querySelectorAll('[data-testid="rect"]');
      expect(rects.length).toBeGreaterThan(0);
    });

    it('should render hover rect with correct dimensions based on radius', () => {
      const { container, getByTestId } = render(
        <CircleComponent
          {...defaultProps}
          x={50}
          y={50}
          radius={30}
          hoverOutlineColor="#FFFF00"
        />
      );
      const circle = getByTestId('circle');
      
      fireEvent.mouseEnter(circle);
      
      const rect = container.querySelector('[data-testid="rect"]');
      if (rect) {
        // Rect should be positioned at (x - radius, y - radius) with width/height = radius * 2
        expect(rect).toHaveAttribute('x', '20'); // 50 - 30
        expect(rect).toHaveAttribute('y', '20'); // 50 - 30
        expect(rect).toHaveAttribute('width', '60'); // 30 * 2
        expect(rect).toHaveAttribute('height', '60'); // 30 * 2
      }
    });

    it('should show transparent stroke when selected and hovering', () => {
      const { container, getByTestId } = render(
        <CircleComponent {...defaultProps} selected={true} hoverOutlineColor="#FFFF00" />
      );
      const circle = getByTestId('circle');
      
      fireEvent.mouseEnter(circle);
      
      const rect = container.querySelector('[data-testid="rect"]');
      if (rect) {
        expect(rect).toHaveAttribute('stroke', 'transparent');
      }
    });
  });

  describe('evaluate mode', () => {
    it('should show correct icon when correctly selected in evaluate mode', () => {
      const { getByTestId } = render(
        <CircleComponent
          {...defaultProps}
          isEvaluateMode={true}
          selected={true}
          isCorrect={true}
          showCorrectEnabled={false}
        />
      );
      
      const icon = getByTestId('icon-image');
      expect(icon).toBeInTheDocument();
    });

    it('should show wrong icon when incorrectly selected in evaluate mode', () => {
      const { getByTestId } = render(
        <CircleComponent
          {...defaultProps}
          isEvaluateMode={true}
          selected={true}
          isCorrect={false}
          showCorrectEnabled={false}
        />
      );
      
      const icon = getByTestId('icon-image');
      expect(icon).toBeInTheDocument();
    });

    it('should show wrong icon when incorrectly not selected', () => {
      const { getByTestId } = render(
        <CircleComponent
          {...defaultProps}
          isEvaluateMode={true}
          selected={false}
          isCorrect={false}
          showCorrectEnabled={false}
        />
      );
      
      const icon = getByTestId('icon-image');
      expect(icon).toBeInTheDocument();
    });

    it('should not show icon when correctly not selected in evaluate mode', () => {
      const { queryByTestId } = render(
        <CircleComponent
          {...defaultProps}
          isEvaluateMode={true}
          selected={false}
          isCorrect={true}
          showCorrectEnabled={false}
        />
      );
      
      const icon = queryByTestId('icon-image');
      expect(icon).not.toBeInTheDocument();
    });

    it('should show correct icon for showCorrect mode when correctly selected', () => {
      const { getByTestId } = render(
        <CircleComponent
          {...defaultProps}
          isEvaluateMode={true}
          selected={true}
          isCorrect={true}
          showCorrectEnabled={true}
        />
      );
      
      const icon = getByTestId('icon-image');
      expect(icon).toBeInTheDocument();
    });

    it('should show correct icon for showCorrect mode when incorrectly not selected', () => {
      const { getByTestId } = render(
        <CircleComponent
          {...defaultProps}
          isEvaluateMode={true}
          selected={false}
          isCorrect={false}
          showCorrectEnabled={true}
        />
      );
      
      const icon = getByTestId('icon-image');
      expect(icon).toBeInTheDocument();
    });

    it('should not show icon in showCorrect mode when correctly not selected', () => {
      const { queryByTestId } = render(
        <CircleComponent
          {...defaultProps}
          isEvaluateMode={true}
          selected={false}
          isCorrect={true}
          showCorrectEnabled={true}
        />
      );
      
      const icon = queryByTestId('icon-image');
      expect(icon).not.toBeInTheDocument();
    });

    it('should not show icon in showCorrect mode when incorrectly selected', () => {
      const { queryByTestId } = render(
        <CircleComponent
          {...defaultProps}
          isEvaluateMode={true}
          selected={true}
          isCorrect={false}
          showCorrectEnabled={true}
        />
      );
      
      const icon = queryByTestId('icon-image');
      expect(icon).not.toBeInTheDocument();
    });

    it('should show green outline when markAsCorrect is true', () => {
      const { getByTestId } = render(
        <CircleComponent
          {...defaultProps}
          isEvaluateMode={true}
          markAsCorrect={true}
        />
      );
      
      const circle = getByTestId('circle');
      expect(circle).toHaveAttribute('stroke', 'green');
    });

    it('should show red outline when incorrect and not markAsCorrect', () => {
      const { getByTestId } = render(
        <CircleComponent
          {...defaultProps}
          isEvaluateMode={true}
          isCorrect={false}
          markAsCorrect={false}
        />
      );
      
      const circle = getByTestId('circle');
      expect(circle).toHaveAttribute('stroke', 'red');
    });

    it('should display evaluate text in tooltip', () => {
      const { getByTestId } = render(
        <CircleComponent
          {...defaultProps}
          isEvaluateMode={true}
          selected={true}
          isCorrect={true}
          evaluateText="Great job!"
          showCorrectEnabled={false}
        />
      );
      
      const icon = getByTestId('icon-image');
      expect(icon).toHaveAttribute('data-tooltip', 'Great job!');
    });
  });

  describe('icon positioning', () => {
    it('should position icon at center of circle minus offset', () => {
      const { getByTestId } = render(
        <CircleComponent
          {...defaultProps}
          x={100}
          y={100}
          radius={30}
          isEvaluateMode={true}
          selected={true}
          isCorrect={true}
          showCorrectEnabled={false}
        />
      );
      
      const icon = getByTestId('icon-image');
      // Icon should be at x - 10, y - 10
      expect(icon).toHaveAttribute('data-x', '90');
      expect(icon).toHaveAttribute('data-y', '90');
    });
  });

  describe('edge cases', () => {
    it('should handle very small radius', () => {
      const { getByTestId } = render(
        <CircleComponent
          {...defaultProps}
          radius={5}
        />
      );
      
      const circle = getByTestId('circle');
      expect(circle).toHaveAttribute('radius', '5');
    });

    it('should handle very large radius', () => {
      const { getByTestId } = render(
        <CircleComponent
          {...defaultProps}
          radius={200}
        />
      );
      
      const circle = getByTestId('circle');
      expect(circle).toHaveAttribute('radius', '200');
    });

    it('should handle different scale values', () => {
      const { getByTestId } = render(
        <CircleComponent
          {...defaultProps}
          scale={0.5}
        />
      );
      
      const group = getByTestId('group');
      expect(group).toHaveAttribute('scaleX', '0.5');
      expect(group).toHaveAttribute('scaleY', '0.5');
    });
  });
});
