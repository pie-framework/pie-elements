import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Konva from 'konva';
import PolygonComponent from '../polygon';

Konva.isBrowser = false;

jest.mock('react-konva', () => {
  const React = require('react');
  return {
    Line: ({ onClick, onTap, onMouseEnter, onMouseLeave, ...props }) => {
      const handleClick = (e) => {
        if (onClick) onClick(e);
        if (onTap) onTap(e);
      };
      return React.createElement('div', {
        'data-testid': 'line',
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

describe('PolygonComponent', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      id: 'polygon1',
      points: [
        { x: 10, y: 10 },
        { x: 100, y: 10 },
        { x: 100, y: 100 },
        { x: 10, y: 100 },
      ],
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
      const { container } = render(<PolygonComponent {...defaultProps} />);
      expect(container).toBeTruthy();
    });

    it('should parse points correctly for Konva', () => {
      const { container } = render(<PolygonComponent {...defaultProps} />);
      const line = container.querySelector('[data-testid="line"]');
      
      expect(line).toHaveAttribute('points');
      const points = line.getAttribute('points');
      expect(points).toBe('10,10,100,10,100,100,10,100');
    });

    it('should render with hotspot color when not selected', () => {
      const { container } = render(<PolygonComponent {...defaultProps} />);
      const line = container.querySelector('[data-testid="line"]');
      
      expect(line).toHaveAttribute('fill', '#FF0000');
    });

    it('should render with selected color when selected', () => {
      const { container } = render(<PolygonComponent {...defaultProps} selected={true} />);
      const line = container.querySelector('[data-testid="line"]');
      
      expect(line).toHaveAttribute('fill', '#00FF00');
    });

    it('should apply scale transform', () => {
      const { getByTestId } = render(<PolygonComponent {...defaultProps} scale={1.5} />);
      const group = getByTestId('group');
      
      expect(group).toHaveAttribute('scaleX', '1.5');
      expect(group).toHaveAttribute('scaleY', '1.5');
    });

    it('should render with default scale of 1', () => {
      const { getByTestId } = render(<PolygonComponent {...defaultProps} />);
      const group = getByTestId('group');
      
      expect(group).toHaveAttribute('scaleX', '1');
      expect(group).toHaveAttribute('scaleY', '1');
    });
  });

  describe('interactions', () => {
    it('should call onClick when clicked', () => {
      const onClick = jest.fn();
      const { container } = render(<PolygonComponent {...defaultProps} onClick={onClick} />);
      const line = container.querySelector('[data-testid="line"]');
      
      fireEvent.click(line);
      
      expect(onClick).toHaveBeenCalledWith({
        id: 'polygon1',
        selected: true,
        selector: 'Mouse',
      });
    });

    it('should toggle selection state on click', () => {
      const onClick = jest.fn();
      const { container, rerender } = render(<PolygonComponent {...defaultProps} onClick={onClick} selected={false} />);
      const line = container.querySelector('[data-testid="line"]');
      
      fireEvent.click(line);
      
      expect(onClick).toHaveBeenCalledWith({
        id: 'polygon1',
        selected: true,
        selector: 'Mouse',
      });
      
      rerender(<PolygonComponent {...defaultProps} onClick={onClick} selected={true} />);
      
      const lineAfter = container.querySelector('[data-testid="line"]');
      fireEvent.click(lineAfter);
      
      expect(onClick).toHaveBeenCalledWith({
        id: 'polygon1',
        selected: false,
        selector: 'Mouse',
      });
    });

    it('should not call onClick when disabled', () => {
      const onClick = jest.fn();
      const { container } = render(<PolygonComponent {...defaultProps} onClick={onClick} disabled={true} />);
      const line = container.querySelector('[data-testid="line"]');
      
      fireEvent.click(line);
      
      expect(onClick).not.toHaveBeenCalled();
    });

    it('should change cursor to pointer on mouse enter when not disabled', () => {
      const { container } = render(<PolygonComponent {...defaultProps} />);
      const line = container.querySelector('[data-testid="line"]');
      
      fireEvent.mouseEnter(line);
      
      expect(document.body.style.cursor).toBe('pointer');
    });

    it('should not change cursor when disabled', () => {
      const { container } = render(<PolygonComponent {...defaultProps} disabled={true} />);
      const line = container.querySelector('[data-testid="line"]');
      
      fireEvent.mouseEnter(line);
      
      expect(document.body.style.cursor).toBe('default');
    });

    it('should reset cursor to default on mouse leave', () => {
      const { container } = render(<PolygonComponent {...defaultProps} />);
      const line = container.querySelector('[data-testid="line"]');
      
      fireEvent.mouseEnter(line);
      fireEvent.mouseLeave(line);
      
      expect(document.body.style.cursor).toBe('default');
    });
  });

  describe('center calculation', () => {
    it('should calculate center correctly for square', () => {
      const { getByTestId } = render(
        <PolygonComponent
          {...defaultProps}
          points={[
            { x: 0, y: 0 },
            { x: 100, y: 0 },
            { x: 100, y: 100 },
            { x: 0, y: 100 },
          ]}
          isEvaluateMode={true}
          selected={true}
          isCorrect={true}
          showCorrectEnabled={false}
        />
      );
      
      const icon = getByTestId('icon-image');
      expect(icon).toHaveAttribute('data-x', '50');
      expect(icon).toHaveAttribute('data-y', '50');
    });

    it('should calculate center correctly for triangle', () => {
      const { getByTestId } = render(
        <PolygonComponent
          {...defaultProps}
          points={[
            { x: 0, y: 0 },
            { x: 100, y: 0 },
            { x: 50, y: 100 },
          ]}
          isEvaluateMode={true}
          selected={true}
          isCorrect={true}
          showCorrectEnabled={false}
        />
      );
      
      const icon = getByTestId('icon-image');
      expect(icon).toHaveAttribute('data-x', '50');
      expect(icon).toHaveAttribute('data-y', '50');
    });

    it('should calculate center correctly for irregular polygon', () => {
      const { getByTestId } = render(
        <PolygonComponent
          {...defaultProps}
          points={[
            { x: 10, y: 20 },
            { x: 90, y: 30 },
            { x: 80, y: 70 },
            { x: 20, y: 60 },
          ]}
          isEvaluateMode={true}
          selected={true}
          isCorrect={true}
          showCorrectEnabled={false}
        />
      );
      
      const icon = getByTestId('icon-image');
      expect(icon).toHaveAttribute('data-x', '50');
      expect(icon).toHaveAttribute('data-y', '45');
    });
  });

  describe('hover styling', () => {
    it('should show hover outline when hoverOutlineColor is provided', () => {
      const { container } = render(<PolygonComponent {...defaultProps} hoverOutlineColor="#FFFF00" />);
      const line = container.querySelector('[data-testid="line"]');
      
      fireEvent.mouseEnter(line);
      
      const rects = container.querySelectorAll('[data-testid="rect"]');
      expect(rects.length).toBeGreaterThan(0);
    });

    it('should render hover rect with correct dimensions', () => {
      const { container } = render(
        <PolygonComponent
          {...defaultProps}
          points={[
            { x: 10, y: 20 },
            { x: 110, y: 20 },
            { x: 110, y: 120 },
            { x: 10, y: 120 },
          ]}
          hoverOutlineColor="#FFFF00"
        />
      );
      
      const line = container.querySelector('[data-testid="line"]');
      fireEvent.mouseEnter(line);
      
      const rect = container.querySelector('[data-testid="rect"]');
      if (rect) {
        expect(rect).toHaveAttribute('x', '10');
        expect(rect).toHaveAttribute('y', '20');
        expect(rect).toHaveAttribute('width', '100');
        expect(rect).toHaveAttribute('height', '100');
      }
    });
  });

  describe('evaluate mode', () => {
    it('should show correct icon when correctly selected in evaluate mode', () => {
      const { getByTestId } = render(
        <PolygonComponent
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
        <PolygonComponent
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
        <PolygonComponent
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
        <PolygonComponent
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
        <PolygonComponent
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
        <PolygonComponent
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
        <PolygonComponent
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
        <PolygonComponent
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
        <PolygonComponent
          {...defaultProps}
          isEvaluateMode={true}
          markAsCorrect={true}
        />
      );
      
      const line = container.querySelector('[data-testid="line"]');
      expect(line).toHaveAttribute('stroke', 'green');
    });

    it('should show red outline when incorrect and not markAsCorrect', () => {
      const { container } = render(
        <PolygonComponent
          {...defaultProps}
          isEvaluateMode={true}
          isCorrect={false}
          markAsCorrect={false}
        />
      );
      
      const line = container.querySelector('[data-testid="line"]');
      expect(line).toHaveAttribute('stroke', 'red');
    });

    it('should display evaluate text in tooltip', () => {
      const { getByTestId } = render(
        <PolygonComponent
          {...defaultProps}
          isEvaluateMode={true}
          selected={true}
          isCorrect={true}
          evaluateText="Well done!"
          showCorrectEnabled={false}
        />
      );
      
      const icon = getByTestId('icon-image');
      expect(icon).toHaveAttribute('data-tooltip', 'Well done!');
    });
  });

  describe('edge cases', () => {
    it('should handle triangular polygon', () => {
      const { container } = render(
        <PolygonComponent
          {...defaultProps}
          points={[
            { x: 50, y: 0 },
            { x: 100, y: 100 },
            { x: 0, y: 100 },
          ]}
        />
      );
      
      const line = container.querySelector('[data-testid="line"]');
      expect(line).toHaveAttribute('points', '50,0,100,100,0,100');
    });

    it('should handle complex polygon with many points', () => {
      const points = [
        { x: 10, y: 10 },
        { x: 50, y: 5 },
        { x: 90, y: 10 },
        { x: 100, y: 50 },
        { x: 90, y: 90 },
        { x: 50, y: 100 },
        { x: 10, y: 90 },
        { x: 0, y: 50 },
      ];
      
      const { container } = render(
        <PolygonComponent
          {...defaultProps}
          points={points}
        />
      );
      
      const line = container.querySelector('[data-testid="line"]');
      expect(line).toHaveAttribute('points', '10,10,50,5,90,10,100,50,90,90,50,100,10,90,0,50');
    });
  });
});
