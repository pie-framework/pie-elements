import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Konva from 'konva';
import DeleteWidget from '../DeleteWidget';

Konva.isBrowser = false;

jest.mock('react-konva', () => {
  const React = require('react');
  return {
    Group: ({ children, onClick, ...props }) => {
      return React.createElement('div', { 'data-testid': 'group', onClick, ...props }, children);
    },
  };
});

jest.mock('../image-konva', () => {
  return function ImageComponent({ src, x, y }) {
    return <div data-testid="delete-icon" data-src={src} data-x={x} data-y={y} />;
  };
});

jest.mock('../utils', () => ({
  calculate: jest.fn((points) => {
    const xValues = points.map(p => p.x);
    const yValues = points.map(p => p.y);
    return {
      x: Math.max(...xValues),
      y: Math.max(...yValues),
    };
  }),
}));

describe('DeleteWidget', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      id: 'shape1',
      x: 100,
      y: 150,
      handleWidgetClick: jest.fn(),
    };
  });

  describe('rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<DeleteWidget {...defaultProps} width={200} height={150} />);
      expect(container).toBeTruthy();
    });

    it('should render Group component', () => {
      const { getByTestId } = render(<DeleteWidget {...defaultProps} width={200} height={150} />);
      expect(getByTestId('group')).toBeInTheDocument();
    });

    it('should render delete icon', () => {
      const { getByTestId } = render(<DeleteWidget {...defaultProps} width={200} height={150} />);
      expect(getByTestId('delete-icon')).toBeInTheDocument();
    });
  });

  describe('rectangle positioning', () => {
    it('should position delete icon at bottom-right for rectangles', () => {
      const { getByTestId } = render(
        <DeleteWidget
          {...defaultProps}
          x={100}
          y={150}
          width={200}
          height={150}
        />
      );
      
      const icon = getByTestId('delete-icon');
      // positionX = x + width - offset = 100 + 200 - 20 = 280
      // positionY = y + height - offset = 150 + 150 - 20 = 280
      expect(icon).toHaveAttribute('data-x', '280');
      expect(icon).toHaveAttribute('data-y', '280');
    });

    it('should handle different rectangle dimensions', () => {
      const { getByTestId } = render(
        <DeleteWidget
          {...defaultProps}
          x={50}
          y={75}
          width={300}
          height={200}
        />
      );
      
      const icon = getByTestId('delete-icon');
      // positionX = 50 + 300 - 20 = 330
      // positionY = 75 + 200 - 20 = 255
      expect(icon).toHaveAttribute('data-x', '330');
      expect(icon).toHaveAttribute('data-y', '255');
    });
  });

  describe('circle positioning', () => {
    it('should position delete icon above circle', () => {
      const { getByTestId } = render(
        <DeleteWidget
          {...defaultProps}
          x={200}
          y={200}
          isCircle={true}
          radius={50}
        />
      );
      
      const icon = getByTestId('delete-icon');
      // positionX = x + radius - offset = 200 + 50 - 20 = 230
      // positionY = y = 200
      expect(icon).toHaveAttribute('data-x', '230');
      expect(icon).toHaveAttribute('data-y', '200');
    });

    it('should handle different circle sizes', () => {
      const { getByTestId } = render(
        <DeleteWidget
          {...defaultProps}
          x={100}
          y={100}
          isCircle={true}
          radius={75}
        />
      );
      
      const icon = getByTestId('delete-icon');
      // positionX = 100 + 75 - 20 = 155
      // positionY = 100
      expect(icon).toHaveAttribute('data-x', '155');
      expect(icon).toHaveAttribute('data-y', '100');
    });

    it('should handle small circles', () => {
      const { getByTestId } = render(
        <DeleteWidget
          {...defaultProps}
          x={150}
          y={150}
          isCircle={true}
          radius={20}
        />
      );
      
      const icon = getByTestId('delete-icon');
      // positionX = 150 + 20 - 20 = 150
      // positionY = 150
      expect(icon).toHaveAttribute('data-x', '150');
      expect(icon).toHaveAttribute('data-y', '150');
    });
  });

  describe('polygon positioning', () => {
    it('should position delete icon using calculate function for polygons', () => {
      const { calculate } = require('../utils');
      const points = [
        { x: 10, y: 10 },
        { x: 100, y: 20 },
        { x: 90, y: 90 },
        { x: 20, y: 80 },
      ];
      
      const { getByTestId } = render(
        <DeleteWidget
          {...defaultProps}
          points={points}
        />
      );
      
      expect(calculate).toHaveBeenCalledWith(points);
      
      const icon = getByTestId('delete-icon');
      // Based on mocked calculate function: max x = 100, max y = 90
      expect(icon).toHaveAttribute('data-x', '100');
      expect(icon).toHaveAttribute('data-y', '90');
    });

    it('should handle triangular polygons', () => {
      const { calculate } = require('../utils');
      const points = [
        { x: 50, y: 0 },
        { x: 100, y: 100 },
        { x: 0, y: 100 },
      ];
      
      render(
        <DeleteWidget
          {...defaultProps}
          points={points}
        />
      );
      
      expect(calculate).toHaveBeenCalledWith(points);
    });

    it('should handle complex polygons', () => {
      const { calculate } = require('../utils');
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
      
      render(
        <DeleteWidget
          {...defaultProps}
          points={points}
        />
      );
      
      expect(calculate).toHaveBeenCalledWith(points);
    });
  });

  describe('interactions', () => {
    it('should call handleWidgetClick when clicked', () => {
      const handleWidgetClick = jest.fn();
      const { getByTestId } = render(
        <DeleteWidget
          {...defaultProps}
          handleWidgetClick={handleWidgetClick}
          width={200}
          height={150}
        />
      );
      
      const group = getByTestId('group');
      fireEvent.click(group);
      
      expect(handleWidgetClick).toHaveBeenCalledWith('shape1');
    });

    it('should call handleWidgetClick with correct id for circles', () => {
      const handleWidgetClick = jest.fn();
      const { getByTestId } = render(
        <DeleteWidget
          {...defaultProps}
          id="circle1"
          handleWidgetClick={handleWidgetClick}
          isCircle={true}
          radius={50}
        />
      );
      
      const group = getByTestId('group');
      fireEvent.click(group);
      
      expect(handleWidgetClick).toHaveBeenCalledWith('circle1');
    });

    it('should call handleWidgetClick with correct id for polygons', () => {
      const handleWidgetClick = jest.fn();
      const points = [
        { x: 10, y: 10 },
        { x: 100, y: 20 },
        { x: 50, y: 100 },
      ];
      const { getByTestId } = render(
        <DeleteWidget
          {...defaultProps}
          id="polygon1"
          handleWidgetClick={handleWidgetClick}
          points={points}
        />
      );
      
      const group = getByTestId('group');
      fireEvent.click(group);
      
      expect(handleWidgetClick).toHaveBeenCalledWith('polygon1');
    });
  });

  describe('edge cases', () => {
    it('should handle zero dimensions for rectangles', () => {
      const { getByTestId } = render(
        <DeleteWidget
          {...defaultProps}
          x={0}
          y={0}
          width={0}
          height={0}
        />
      );
      
      const icon = getByTestId('delete-icon');
      // positionX = 0 + 0 - 20 = -20
      // positionY = 0 + 0 - 20 = -20
      expect(icon).toHaveAttribute('data-x', '-20');
      expect(icon).toHaveAttribute('data-y', '-20');
    });

    it('should handle zero radius for circles', () => {
      const { getByTestId } = render(
        <DeleteWidget
          {...defaultProps}
          x={100}
          y={100}
          isCircle={true}
          radius={0}
        />
      );
      
      const icon = getByTestId('delete-icon');
      // positionX = 100 + 0 - 20 = 80
      // positionY = 100
      expect(icon).toHaveAttribute('data-x', '80');
      expect(icon).toHaveAttribute('data-y', '100');
    });

    it('should handle negative coordinates', () => {
      const { getByTestId } = render(
        <DeleteWidget
          {...defaultProps}
          x={-50}
          y={-75}
          width={100}
          height={100}
        />
      );
      
      const icon = getByTestId('delete-icon');
      // positionX = -50 + 100 - 20 = 30
      // positionY = -75 + 100 - 20 = 5
      expect(icon).toHaveAttribute('data-x', '30');
      expect(icon).toHaveAttribute('data-y', '5');
    });

    it('should handle single point polygon', () => {
      const points = [{ x: 50, y: 50 }];
      
      const { container } = render(
        <DeleteWidget
          {...defaultProps}
          points={points}
        />
      );
      
      expect(container).toBeTruthy();
    });
  });

  describe('icon rendering', () => {
    it('should pass correct src to ImageComponent', () => {
      const { getByTestId } = render(
        <DeleteWidget
          {...defaultProps}
          width={200}
          height={150}
        />
      );
      
      const icon = getByTestId('delete-icon');
      expect(icon).toHaveAttribute('data-src');
    });
  });
});
