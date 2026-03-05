import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Konva from 'konva';
import { Container } from '../container';

Konva.isBrowser = false;

jest.mock('react-konva', () => {
  const React = require('react');
  return {
    Stage: ({ children, ...props }) => React.createElement('div', { 'data-testid': 'stage', ...props }, children),
    Layer: ({ children, ...props }) => React.createElement('div', { 'data-testid': 'layer', ...props }, children),
  };
});

jest.mock('../rectangle', () => {
  return function Rectangle(props) {
    return (
      <div
        data-testid={`rectangle-${props.id}`}
        data-selected={props.selected}
        data-iscorrect={props.isCorrect}
        data-disabled={props.disabled}
        onClick={() => props.onClick({ id: props.id, selected: !props.selected })}
      />
    );
  };
});

jest.mock('../polygon', () => {
  return function Polygon(props) {
    return (
      <div
        data-testid={`polygon-${props.id}`}
        data-selected={props.selected}
        data-iscorrect={props.isCorrect}
        data-disabled={props.disabled}
        onClick={() => props.onClick({ id: props.id, selected: !props.selected })}
      />
    );
  };
});

jest.mock('../circle', () => {
  return function Circle(props) {
    return (
      <div
        data-testid={`circle-${props.id}`}
        data-selected={props.selected}
        data-iscorrect={props.isCorrect}
        data-disabled={props.disabled}
        onClick={() => props.onClick({ id: props.id, selected: !props.selected })}
      />
    );
  };
});

describe('Container', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      dimensions: { width: 800, height: 600 },
      disabled: false,
      hotspotColor: '#FF0000',
      hoverOutlineColor: '#FFFF00',
      selectedHotspotColor: '#00FF00',
      imageUrl: 'http://example.com/image.png',
      isEvaluateMode: false,
      onSelectChoice: jest.fn(),
      outlineColor: '#0000FF',
      session: { answers: [] },
      shapes: {
        rectangles: [],
        polygons: [],
        circles: [],
      },
      strokeWidth: 5,
      scale: 1,
      showCorrect: false,
    };
  });

  describe('rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<Container {...defaultProps} />);
      expect(container).toBeTruthy();
    });

    it('should render image when imageUrl is provided', () => {
      const { getByAltText } = render(<Container {...defaultProps} />);
      const image = getByAltText('hotspot-image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'http://example.com/image.png');
    });

    it('should not render image when imageUrl is not provided', () => {
      const { queryByAltText } = render(<Container {...defaultProps} imageUrl="" />);
      expect(queryByAltText('hotspot-image')).not.toBeInTheDocument();
    });

    it('should render Stage with correct dimensions', () => {
      const { getByTestId } = render(<Container {...defaultProps} />);
      const stage = getByTestId('stage');
      expect(stage).toHaveAttribute('height', '605'); // 600 + strokeWidth
      expect(stage).toHaveAttribute('width', '805'); // 800 + strokeWidth
    });

    it('should apply scale to dimensions', () => {
      const { getByTestId } = render(<Container {...defaultProps} scale={2} />);
      const stage = getByTestId('stage');
      expect(stage).toHaveAttribute('height', '1205'); // (600 * 2) + strokeWidth
      expect(stage).toHaveAttribute('width', '1605'); // (800 * 2) + strokeWidth
    });

    it('should render Layer inside Stage', () => {
      const { getByTestId } = render(<Container {...defaultProps} />);
      const layer = getByTestId('layer');
      expect(layer).toBeInTheDocument();
    });
  });

  describe('rectangle shapes', () => {
    it('should render rectangles', () => {
      const props = {
        ...defaultProps,
        shapes: {
          rectangles: [
            { id: 'rect1', x: 10, y: 20, width: 100, height: 80, correct: false },
            { id: 'rect2', x: 150, y: 200, width: 120, height: 90, correct: false },
          ],
          polygons: [],
          circles: [],
        },
      };
      const { getByTestId } = render(<Container {...props} />);
      
      expect(getByTestId('rectangle-rect1')).toBeInTheDocument();
      expect(getByTestId('rectangle-rect2')).toBeInTheDocument();
    });

    it('should mark rectangle as selected when in session answers', () => {
      const props = {
        ...defaultProps,
        session: { answers: [{ id: 'rect1' }] },
        shapes: {
          rectangles: [
            { id: 'rect1', x: 10, y: 20, width: 100, height: 80, correct: false },
          ],
          polygons: [],
          circles: [],
        },
      };
      const { getByTestId } = render(<Container {...props} />);
      
      const rect = getByTestId('rectangle-rect1');
      expect(rect).toHaveAttribute('data-selected', 'true');
    });

    it('should call onSelectChoice when rectangle is clicked', () => {
      const onSelectChoice = jest.fn();
      const props = {
        ...defaultProps,
        onSelectChoice,
        shapes: {
          rectangles: [
            { id: 'rect1', x: 10, y: 20, width: 100, height: 80, correct: false },
          ],
          polygons: [],
          circles: [],
        },
      };
      const { getByTestId } = render(<Container {...props} />);
      
      const rect = getByTestId('rectangle-rect1');
      fireEvent.click(rect);
      
      expect(onSelectChoice).toHaveBeenCalledWith({ id: 'rect1', selected: true });
    });
  });

  describe('polygon shapes', () => {
    it('should render polygons', () => {
      const props = {
        ...defaultProps,
        shapes: {
          rectangles: [],
          polygons: [
            {
              id: 'poly1',
              points: [{ x: 10, y: 10 }, { x: 100, y: 10 }, { x: 50, y: 100 }],
              correct: false,
            },
          ],
          circles: [],
        },
      };
      const { getByTestId } = render(<Container {...props} />);
      
      expect(getByTestId('polygon-poly1')).toBeInTheDocument();
    });

    it('should mark polygon as selected when in session answers', () => {
      const props = {
        ...defaultProps,
        session: { answers: [{ id: 'poly1' }] },
        shapes: {
          rectangles: [],
          polygons: [
            {
              id: 'poly1',
              points: [{ x: 10, y: 10 }, { x: 100, y: 10 }, { x: 50, y: 100 }],
              correct: false,
            },
          ],
          circles: [],
        },
      };
      const { getByTestId } = render(<Container {...props} />);
      
      const polygon = getByTestId('polygon-poly1');
      expect(polygon).toHaveAttribute('data-selected', 'true');
    });

    it('should call onSelectChoice when polygon is clicked', () => {
      const onSelectChoice = jest.fn();
      const props = {
        ...defaultProps,
        onSelectChoice,
        shapes: {
          rectangles: [],
          polygons: [
            {
              id: 'poly1',
              points: [{ x: 10, y: 10 }, { x: 100, y: 10 }, { x: 50, y: 100 }],
              correct: false,
            },
          ],
          circles: [],
        },
      };
      const { getByTestId } = render(<Container {...props} />);
      
      const polygon = getByTestId('polygon-poly1');
      fireEvent.click(polygon);
      
      expect(onSelectChoice).toHaveBeenCalledWith({ id: 'poly1', selected: true });
    });
  });

  describe('circle shapes', () => {
    it('should render circles', () => {
      const props = {
        ...defaultProps,
        shapes: {
          rectangles: [],
          polygons: [],
          circles: [
            { id: 'circle1', x: 100, y: 100, radius: 50, correct: false },
          ],
        },
      };
      const { getByTestId } = render(<Container {...props} />);
      
      expect(getByTestId('circle-circle1')).toBeInTheDocument();
    });

    it('should mark circle as selected when in session answers', () => {
      const props = {
        ...defaultProps,
        session: { answers: [{ id: 'circle1' }] },
        shapes: {
          rectangles: [],
          polygons: [],
          circles: [
            { id: 'circle1', x: 100, y: 100, radius: 50, correct: false },
          ],
        },
      };
      const { getByTestId } = render(<Container {...props} />);
      
      const circle = getByTestId('circle-circle1');
      expect(circle).toHaveAttribute('data-selected', 'true');
    });

    it('should call onSelectChoice when circle is clicked', () => {
      const onSelectChoice = jest.fn();
      const props = {
        ...defaultProps,
        onSelectChoice,
        shapes: {
          rectangles: [],
          polygons: [],
          circles: [
            { id: 'circle1', x: 100, y: 100, radius: 50, correct: false },
          ],
        },
      };
      const { getByTestId } = render(<Container {...props} />);
      
      const circle = getByTestId('circle-circle1');
      fireEvent.click(circle);
      
      expect(onSelectChoice).toHaveBeenCalledWith({ id: 'circle1', selected: true });
    });
  });

  describe('evaluate mode', () => {
    it('should show correctness when in evaluate mode', () => {
      const props = {
        ...defaultProps,
        isEvaluateMode: true,
        session: { answers: [{ id: 'rect1' }] },
        shapes: {
          rectangles: [
            { id: 'rect1', x: 10, y: 20, width: 100, height: 80, correct: true },
          ],
          polygons: [],
          circles: [],
        },
      };
      const { getByTestId } = render(<Container {...props} />);
      
      const rect = getByTestId('rectangle-rect1');
      expect(rect).toHaveAttribute('data-iscorrect', 'true');
    });

    it('should show incorrect when selected but not correct', () => {
      const props = {
        ...defaultProps,
        isEvaluateMode: true,
        session: { answers: [{ id: 'rect1' }] },
        shapes: {
          rectangles: [
            { id: 'rect1', x: 10, y: 20, width: 100, height: 80, correct: false },
          ],
          polygons: [],
          circles: [],
        },
      };
      const { getByTestId } = render(<Container {...props} />);
      
      const rect = getByTestId('rectangle-rect1');
      expect(rect).toHaveAttribute('data-iscorrect', 'false');
    });

    it('should show incorrect when not selected but correct', () => {
      const props = {
        ...defaultProps,
        isEvaluateMode: true,
        session: { answers: [] },
        shapes: {
          rectangles: [
            { id: 'rect1', x: 10, y: 20, width: 100, height: 80, correct: true },
          ],
          polygons: [],
          circles: [],
        },
      };
      const { getByTestId } = render(<Container {...props} />);
      
      const rect = getByTestId('rectangle-rect1');
      expect(rect).toHaveAttribute('data-iscorrect', 'false');
    });

    it('should show correct when not selected and not correct', () => {
      const props = {
        ...defaultProps,
        isEvaluateMode: true,
        session: { answers: [] },
        shapes: {
          rectangles: [
            { id: 'rect1', x: 10, y: 20, width: 100, height: 80, correct: false },
          ],
          polygons: [],
          circles: [],
        },
      };
      const { getByTestId } = render(<Container {...props} />);
      
      const rect = getByTestId('rectangle-rect1');
      expect(rect).toHaveAttribute('data-iscorrect', 'true');
    });
  });

  describe('disabled state', () => {
    it('should pass disabled prop to shapes', () => {
      const props = {
        ...defaultProps,
        disabled: true,
        shapes: {
          rectangles: [
            { id: 'rect1', x: 10, y: 20, width: 100, height: 80, correct: false },
          ],
          polygons: [],
          circles: [],
        },
      };
      const { getByTestId } = render(<Container {...props} />);
      
      const rect = getByTestId('rectangle-rect1');
      expect(rect).toHaveAttribute('data-disabled', 'true');
    });
  });

  describe('mixed shapes', () => {
    it('should render all types of shapes together', () => {
      const props = {
        ...defaultProps,
        shapes: {
          rectangles: [
            { id: 'rect1', x: 10, y: 20, width: 100, height: 80, correct: false },
          ],
          polygons: [
            {
              id: 'poly1',
              points: [{ x: 10, y: 10 }, { x: 100, y: 10 }, { x: 50, y: 100 }],
              correct: false,
            },
          ],
          circles: [
            { id: 'circle1', x: 100, y: 100, radius: 50, correct: false },
          ],
        },
      };
      const { getByTestId } = render(<Container {...props} />);
      
      expect(getByTestId('rectangle-rect1')).toBeInTheDocument();
      expect(getByTestId('polygon-poly1')).toBeInTheDocument();
      expect(getByTestId('circle-circle1')).toBeInTheDocument();
    });

    it('should handle multiple selections across different shape types', () => {
      const props = {
        ...defaultProps,
        session: { answers: [{ id: 'rect1' }, { id: 'poly1' }, { id: 'circle1' }] },
        shapes: {
          rectangles: [
            { id: 'rect1', x: 10, y: 20, width: 100, height: 80, correct: false },
          ],
          polygons: [
            {
              id: 'poly1',
              points: [{ x: 10, y: 10 }, { x: 100, y: 10 }, { x: 50, y: 100 }],
              correct: false,
            },
          ],
          circles: [
            { id: 'circle1', x: 100, y: 100, radius: 50, correct: false },
          ],
        },
      };
      const { getByTestId } = render(<Container {...props} />);
      
      expect(getByTestId('rectangle-rect1')).toHaveAttribute('data-selected', 'true');
      expect(getByTestId('polygon-poly1')).toHaveAttribute('data-selected', 'true');
      expect(getByTestId('circle-circle1')).toHaveAttribute('data-selected', 'true');
    });
  });

  describe('showCorrect mode', () => {
    it('should pass showCorrect prop to shapes in evaluate mode', () => {
      const props = {
        ...defaultProps,
        isEvaluateMode: true,
        showCorrect: true,
        shapes: {
          rectangles: [
            { id: 'rect1', x: 10, y: 20, width: 100, height: 80, correct: true },
          ],
          polygons: [],
          circles: [],
        },
      };
      const { container } = render(<Container {...props} />);
      expect(container).toBeTruthy();
    });
  });

  describe('getEvaluateText', () => {
    it('should return correct text for correctly selected', () => {
      const component = new Container(defaultProps);
      const text = component.getEvaluateText(true, true);
      expect(text).toBe('Correctly\nselected');
    });

    it('should return correct text for incorrectly selected', () => {
      const component = new Container(defaultProps);
      const text = component.getEvaluateText(false, true);
      expect(text).toBe('Should not have\nbeen selected');
    });

    it('should return correct text for should have been selected', () => {
      const component = new Container(defaultProps);
      const text = component.getEvaluateText(true, false);
      expect(text).toBe('Should have\nbeen selected');
    });

    it('should return null for correctly not selected', () => {
      const component = new Container(defaultProps);
      const text = component.getEvaluateText(false, false);
      expect(text).toBeNull();
    });
  });

  describe('correctness calculation', () => {
    it('should calculate correctness properly', () => {
      const component = new Container(defaultProps);
      
      expect(component.correctness(true, true)).toBe(true);
      expect(component.correctness(true, false)).toBe(false);
      expect(component.correctness(false, true)).toBe(false);
      expect(component.correctness(false, false)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle empty shapes object', () => {
      const props = {
        ...defaultProps,
        shapes: {},
      };
      const { container } = render(<Container {...props} />);
      expect(container).toBeTruthy();
    });

    it('should handle null imageUrl', () => {
      const props = {
        ...defaultProps,
        imageUrl: null,
      };
      const { queryByAltText } = render(<Container {...props} />);
      expect(queryByAltText('hotspot-image')).not.toBeInTheDocument();
    });

    it('should handle default scale value', () => {
      const props = {
        ...defaultProps,
        scale: undefined,
      };
      const { getByTestId } = render(<Container {...props} />);
      const stage = getByTestId('stage');
      expect(stage).toBeInTheDocument();
    });
  });
});
