import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Konva from 'konva';
import RectComponent from '../rectangle';

Konva.isBrowser = false;

jest.mock('react-konva', () => {
  const React = require('react');
  return {
    Rect: ({ onClick, onTap, onMouseEnter, onMouseLeave, ...props }) => {
      const handleClick = (e) => {
        if (onClick) onClick(e);
        if (onTap) onTap(e);
      };
      return React.createElement('div', {
        'data-testid': 'rect',
        onClick: handleClick,
        onMouseEnter,
        onMouseLeave,
        ...props,
      });
    },
    Group: ({ children, ...props }) => React.createElement('div', { 'data-testid': 'group', ...props }, children),
  };
});

jest.mock('../image-konva-tooltip', () => {
  return function ImageComponent({ src, x, y, tooltip }) {
    return <div data-testid="icon-image" data-src={src} data-x={x} data-y={y} data-tooltip={tooltip} />;
  };
});

describe('RectComponent', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      id: 'rect1',
      x: 10,
      y: 20,
      width: 100,
      height: 80,
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
      const { container } = render(<RectComponent {...defaultProps} />);
      expect(container).toBeTruthy();
    });

    it('should render with correct dimensions', () => {
      const { container } = render(<RectComponent {...defaultProps} />);
      const rects = container.querySelectorAll('[data-testid="rect"]');
      const mainRect = rects[rects.length - 1];
      
      expect(mainRect).toHaveAttribute('x', '10');
      expect(mainRect).toHaveAttribute('y', '20');
      expect(mainRect).toHaveAttribute('width', '100');
      expect(mainRect).toHaveAttribute('height', '80');
    });

    it('should render with hotspot color when not selected', () => {
      const { container } = render(<RectComponent {...defaultProps} />);
      const rects = container.querySelectorAll('[data-testid="rect"]');
      const mainRect = rects[rects.length - 1];
      
      expect(mainRect).toHaveAttribute('fill', '#FF0000');
    });

    it('should render with selected color when selected', () => {
      const { container } = render(<RectComponent {...defaultProps} selected={true} />);
      const rects = container.querySelectorAll('[data-testid="rect"]');
      const mainRect = rects[rects.length - 1];
      
      expect(mainRect).toHaveAttribute('fill', '#00FF00');
    });

    it('should apply scale transform', () => {
      const { getByTestId } = render(<RectComponent {...defaultProps} scale={1.5} />);
      const group = getByTestId('group');
      
      expect(group).toHaveAttribute('scaleX', '1.5');
      expect(group).toHaveAttribute('scaleY', '1.5');
    });

    it('should render with default scale of 1', () => {
      const { getByTestId } = render(<RectComponent {...defaultProps} />);
      const group = getByTestId('group');
      
      expect(group).toHaveAttribute('scaleX', '1');
      expect(group).toHaveAttribute('scaleY', '1');
    });
  });

  describe('interactions', () => {
    it('should call onClick when clicked', () => {
      const onClick = jest.fn();
      const { container } = render(<RectComponent {...defaultProps} onClick={onClick} />);
      const rects = container.querySelectorAll('[data-testid="rect"]');
      const mainRect = rects[rects.length - 1];
      
      fireEvent.click(mainRect);
      
      expect(onClick).toHaveBeenCalledWith({
        id: 'rect1',
        selected: true,
        selector: 'Mouse',
      });
    });

    it('should toggle selection state on click', () => {
      const onClick = jest.fn();
      const { container, rerender } = render(<RectComponent {...defaultProps} onClick={onClick} selected={false} />);
      const rects = container.querySelectorAll('[data-testid="rect"]');
      const mainRect = rects[rects.length - 1];
      
      fireEvent.click(mainRect);
      
      expect(onClick).toHaveBeenCalledWith({
        id: 'rect1',
        selected: true,
        selector: 'Mouse',
      });
      
      rerender(<RectComponent {...defaultProps} onClick={onClick} selected={true} />);
      
      const rectsAfter = container.querySelectorAll('[data-testid="rect"]');
      const mainRectAfter = rectsAfter[rectsAfter.length - 1];
      fireEvent.click(mainRectAfter);
      
      expect(onClick).toHaveBeenCalledWith({
        id: 'rect1',
        selected: false,
        selector: 'Mouse',
      });
    });

    it('should not call onClick when disabled', () => {
      const onClick = jest.fn();
      const { container } = render(<RectComponent {...defaultProps} onClick={onClick} disabled={true} />);
      const rects = container.querySelectorAll('[data-testid="rect"]');
      const mainRect = rects[rects.length - 1];
      
      fireEvent.click(mainRect);
      
      expect(onClick).not.toHaveBeenCalled();
    });

    it('should change cursor to pointer on mouse enter when not disabled', () => {
      const { container } = render(<RectComponent {...defaultProps} />);
      const rects = container.querySelectorAll('[data-testid="rect"]');
      const mainRect = rects[rects.length - 1];
      
      fireEvent.mouseEnter(mainRect);
      
      expect(document.body.style.cursor).toBe('pointer');
    });

    it('should not change cursor when disabled', () => {
      const { container } = render(<RectComponent {...defaultProps} disabled={true} />);
      const rects = container.querySelectorAll('[data-testid="rect"]');
      const mainRect = rects[rects.length - 1];
      
      fireEvent.mouseEnter(mainRect);
      
      expect(document.body.style.cursor).toBe('default');
    });

    it('should reset cursor to default on mouse leave', () => {
      const { container } = render(<RectComponent {...defaultProps} />);
      const rects = container.querySelectorAll('[data-testid="rect"]');
      const mainRect = rects[rects.length - 1];
      
      fireEvent.mouseEnter(mainRect);
      fireEvent.mouseLeave(mainRect);
      
      expect(document.body.style.cursor).toBe('default');
    });
  });

  describe('hover styling', () => {
    it('should show hover outline when hoverOutlineColor is provided', () => {
      const { container } = render(<RectComponent {...defaultProps} hoverOutlineColor="#FFFF00" />);
      const rects = container.querySelectorAll('[data-testid="rect"]');
      const mainRect = rects[rects.length - 1];
      
      fireEvent.mouseEnter(mainRect);
      
      const rectsAfterHover = container.querySelectorAll('[data-testid="rect"]');
      expect(rectsAfterHover.length).toBeGreaterThan(1);
    });

    it('should not show hover outline when selected', () => {
      const { container } = render(
        <RectComponent {...defaultProps} selected={true} hoverOutlineColor="#FFFF00" />
      );
      const rects = container.querySelectorAll('[data-testid="rect"]');
      const mainRect = rects[rects.length - 1];
      
      fireEvent.mouseEnter(mainRect);
      
      const hoverRect = container.querySelector('[stroke="#FFFF00"]');
      if (hoverRect) {
        expect(hoverRect).toHaveAttribute('stroke', 'transparent');
      }
    });
  });

  describe('evaluate mode', () => {
    it('should show correct icon when correctly selected in evaluate mode', () => {
      const { getByTestId } = render(
        <RectComponent
          {...defaultProps}
          isEvaluateMode={true}
          selected={true}
          isCorrect={true}
          showCorrectEnabled={false}
        />
      );
      
      const icon = getByTestId('icon-image');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('data-src');
    });

    it('should show wrong icon when incorrectly selected in evaluate mode', () => {
      const { getByTestId } = render(
        <RectComponent
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
        <RectComponent
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
        <RectComponent
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
        <RectComponent
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
        <RectComponent
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
        <RectComponent
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
        <RectComponent
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
      const { container } = render(
        <RectComponent
          {...defaultProps}
          isEvaluateMode={true}
          markAsCorrect={true}
        />
      );
      
      const rects = container.querySelectorAll('[data-testid="rect"]');
      const mainRect = rects[rects.length - 1];
      expect(mainRect).toHaveAttribute('stroke', 'green');
    });

    it('should show red outline when incorrect and not markAsCorrect', () => {
      const { container } = render(
        <RectComponent
          {...defaultProps}
          isEvaluateMode={true}
          isCorrect={false}
          markAsCorrect={false}
        />
      );
      
      const rects = container.querySelectorAll('[data-testid="rect"]');
      const mainRect = rects[rects.length - 1];
      expect(mainRect).toHaveAttribute('stroke', 'red');
    });

    it('should display evaluate text in tooltip', () => {
      const { getByTestId } = render(
        <RectComponent
          {...defaultProps}
          isEvaluateMode={true}
          selected={true}
          isCorrect={true}
          evaluateText="Correct answer!"
          showCorrectEnabled={false}
        />
      );
      
      const icon = getByTestId('icon-image');
      expect(icon).toHaveAttribute('data-tooltip', 'Correct answer!');
    });
  });

  describe('icon positioning', () => {
    it('should position icon at center of rectangle', () => {
      const { getByTestId } = render(
        <RectComponent
          {...defaultProps}
          x={10}
          y={20}
          width={100}
          height={80}
          isEvaluateMode={true}
          selected={true}
          isCorrect={true}
          showCorrectEnabled={false}
        />
      );
      
      const icon = getByTestId('icon-image');
      // Icon should be centered: x + width/2 - 10, y + height/2 - 10
      expect(icon).toHaveAttribute('data-x', '50'); // 10 + 100/2 - 10
      expect(icon).toHaveAttribute('data-y', '50'); // 20 + 80/2 - 10
    });
  });
});
