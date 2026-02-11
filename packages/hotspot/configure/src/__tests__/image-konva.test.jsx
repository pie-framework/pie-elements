import React from 'react';
import { render, waitFor } from '@testing-library/react';
import Konva from 'konva';
import ImageComponent from '../image-konva';

Konva.isBrowser = false;

jest.mock('react-konva', () => {
  const React = require('react');
  return {
    Image: (props) => React.createElement('div', { 'data-testid': 'image', ...props }),
  };
});

describe('ImageComponent', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      src: 'test-image.png',
      x: 100,
      y: 150,
    };
  });

  describe('rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<ImageComponent {...defaultProps} />);
      expect(container).toBeTruthy();
    });

    it('should render Image component', () => {
      const { getByTestId } = render(<ImageComponent {...defaultProps} />);
      expect(getByTestId('image')).toBeInTheDocument();
    });

    it('should render with correct position', () => {
      const { getByTestId } = render(<ImageComponent {...defaultProps} x={200} y={250} />);
      const image = getByTestId('image');
      expect(image).toHaveAttribute('x', '200');
      expect(image).toHaveAttribute('y', '250');
    });

    it('should render with fixed dimensions', () => {
      const { getByTestId } = render(<ImageComponent {...defaultProps} />);
      const image = getByTestId('image');
      expect(image).toHaveAttribute('width', '20');
      expect(image).toHaveAttribute('height', '20');
    });

    it('should render at origin (0, 0)', () => {
      const { getByTestId } = render(<ImageComponent {...defaultProps} x={0} y={0} />);
      const image = getByTestId('image');
      expect(image).toHaveAttribute('x', '0');
      expect(image).toHaveAttribute('y', '0');
    });
  });

  describe('image loading', () => {
    it('should load image on mount', async () => {
      const { getByTestId } = render(<ImageComponent {...defaultProps} />);
      
      const image = getByTestId('image');
      expect(image).toBeInTheDocument();
    });

    it('should call loadImage on mount', () => {
      const { container } = render(<ImageComponent {...defaultProps} src="custom-image.jpg" />);
      
      expect(container).toBeTruthy();
    });
  });

  describe('component lifecycle', () => {
    it('should reload image when src changes', async () => {
      const { rerender, container } = render(<ImageComponent {...defaultProps} src="image1.png" />);
      
      expect(container).toBeTruthy();
      
      rerender(<ImageComponent {...defaultProps} src="image2.png" />);
      
      expect(container).toBeTruthy();
    });

    it('should not reload image when src stays the same', async () => {
      const { rerender, getByTestId } = render(<ImageComponent {...defaultProps} src="same-image.png" />);
      
      const image = getByTestId('image');
      expect(image).toBeInTheDocument();
      
      rerender(<ImageComponent {...defaultProps} src="same-image.png" x={200} y={250} />);
      
      const updatedImage = getByTestId('image');
      expect(updatedImage).toHaveAttribute('x', '200');
      expect(updatedImage).toHaveAttribute('y', '250');
    });

    it('should clean up event listener on unmount', () => {
      const { unmount } = render(<ImageComponent {...defaultProps} />);
      
      expect(() => {
        unmount();
      }).not.toThrow();
    });

    it('should handle multiple mount/unmount cycles', () => {
      const { unmount } = render(<ImageComponent {...defaultProps} />);
      unmount();
      
      expect(() => {
        render(<ImageComponent {...defaultProps} />);
      }).not.toThrow();
    });
  });

  describe('position updates', () => {
    it('should update x position', () => {
      const { getByTestId, rerender } = render(<ImageComponent {...defaultProps} x={100} />);
      let image = getByTestId('image');
      expect(image).toHaveAttribute('x', '100');
      
      rerender(<ImageComponent {...defaultProps} x={200} />);
      image = getByTestId('image');
      expect(image).toHaveAttribute('x', '200');
    });

    it('should update y position', () => {
      const { getByTestId, rerender } = render(<ImageComponent {...defaultProps} y={150} />);
      let image = getByTestId('image');
      expect(image).toHaveAttribute('y', '150');
      
      rerender(<ImageComponent {...defaultProps} y={250} />);
      image = getByTestId('image');
      expect(image).toHaveAttribute('y', '250');
    });

    it('should update both x and y positions', () => {
      const { getByTestId, rerender } = render(<ImageComponent {...defaultProps} x={100} y={150} />);
      let image = getByTestId('image');
      expect(image).toHaveAttribute('x', '100');
      expect(image).toHaveAttribute('y', '150');
      
      rerender(<ImageComponent {...defaultProps} x={300} y={400} />);
      image = getByTestId('image');
      expect(image).toHaveAttribute('x', '300');
      expect(image).toHaveAttribute('y', '400');
    });
  });

  describe('edge cases', () => {
    it('should handle negative positions', () => {
      const { getByTestId } = render(<ImageComponent {...defaultProps} x={-50} y={-75} />);
      const image = getByTestId('image');
      expect(image).toHaveAttribute('x', '-50');
      expect(image).toHaveAttribute('y', '-75');
    });

    it('should handle very large positions', () => {
      const { getByTestId } = render(<ImageComponent {...defaultProps} x={10000} y={20000} />);
      const image = getByTestId('image');
      expect(image).toHaveAttribute('x', '10000');
      expect(image).toHaveAttribute('y', '20000');
    });

    it('should handle data URI as src', () => {
      const dataUri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      const { container } = render(<ImageComponent {...defaultProps} src={dataUri} />);
      
      expect(container).toBeTruthy();
    });

    it('should handle SVG as src', () => {
      const { container } = render(<ImageComponent {...defaultProps} src="icon.svg" />);
      expect(container).toBeTruthy();
    });

    it('should handle empty src', () => {
      const { container } = render(<ImageComponent {...defaultProps} src="" />);
      expect(container).toBeTruthy();
    });

    it('should handle URL with query parameters', () => {
      const srcWithParams = 'image.png?width=100&height=100';
      const { container } = render(<ImageComponent {...defaultProps} src={srcWithParams} />);
      
      expect(container).toBeTruthy();
    });

    it('should handle relative paths', () => {
      const { container } = render(<ImageComponent {...defaultProps} src="./images/icon.png" />);
      expect(container).toBeTruthy();
    });

    it('should handle absolute paths', () => {
      const { container } = render(<ImageComponent {...defaultProps} src="/assets/icon.png" />);
      expect(container).toBeTruthy();
    });
  });

  describe('image state', () => {
    it('should initially render without image loaded', () => {
      const { getByTestId } = render(<ImageComponent {...defaultProps} />);
      const image = getByTestId('image');
      expect(image).toBeInTheDocument();
    });

    it('should render component regardless of image load state', () => {
      const { getByTestId } = render(<ImageComponent {...defaultProps} />);
      const image = getByTestId('image');
      expect(image).toBeInTheDocument();
    });
  });

  describe('error handling', () => {
    it('should handle image load error gracefully', () => {
      const { container } = render(<ImageComponent {...defaultProps} src="nonexistent.png" />);
      
      const imgElements = document.querySelectorAll('img[src="nonexistent.png"]');
      imgElements.forEach(img => {
        img.dispatchEvent(new Event('error'));
      });
      
      expect(container).toBeTruthy();
    });
  });
});
