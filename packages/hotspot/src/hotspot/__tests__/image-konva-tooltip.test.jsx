import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import Konva from 'konva';
import ImageComponent from '../image-konva-tooltip';

Konva.isBrowser = false;

jest.mock('react-konva', () => {
  const React = require('react');
  return {
    Group: ({ children, ...props }) => React.createElement('div', { 'data-testid': 'group', ...props }, children),
    Image: ({ onMouseEnter, onMouseLeave, ...props }) => 
      React.createElement('div', { 
        'data-testid': 'image',
        onMouseEnter,
        onMouseLeave,
        ...props 
      }),
    Text: (props) => React.createElement('div', { 'data-testid': 'text', ...props }),
    Tag: (props) => React.createElement('div', { 'data-testid': 'tag', ...props }),
    Label: ({ children, ...props }) => React.createElement('div', { 'data-testid': 'label', ...props }, children),
  };
});

class MockImage {
  constructor() {
    this.src = '';
    this._onload = null;
  }
  
  addEventListener(event, callback) {
    if (event === 'load') {
      this._onload = callback;
      setTimeout(() => {
        if (this._onload) {
          this._onload();
        }
      }, 10);
    }
  }
  
  removeEventListener() {
    this._onload = null;
  }
}

global.Image = MockImage;

describe('ImageComponent', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      src: 'test-image.png',
      x: 100,
      y: 150,
      tooltip: 'Test tooltip',
    };
  });

  describe('rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<ImageComponent {...defaultProps} />);
      expect(container).toBeTruthy();
    });

    it('should render Group component', () => {
      const { getByTestId } = render(<ImageComponent {...defaultProps} />);
      const group = getByTestId('group');
      expect(group).toBeInTheDocument();
    });

    it('should render Image component', () => {
      const { getByTestId } = render(<ImageComponent {...defaultProps} />);
      const image = getByTestId('image');
      expect(image).toBeInTheDocument();
    });

    it('should have correct image dimensions', () => {
      const { getByTestId } = render(<ImageComponent {...defaultProps} />);
      const image = getByTestId('image');
      expect(image).toHaveAttribute('width', '20');
      expect(image).toHaveAttribute('height', '20');
    });

    it('should have correct position', () => {
      const { getByTestId } = render(<ImageComponent {...defaultProps} />);
      const image = getByTestId('image');
      expect(image).toHaveAttribute('x', '100');
      expect(image).toHaveAttribute('y', '150');
    });
  });

  describe('image loading', () => {
    it('should load image on mount', async () => {
      const { getByTestId } = render(<ImageComponent {...defaultProps} />);
      const image = getByTestId('image');
      
      await waitFor(() => {
        expect(image).toHaveAttribute('image');
      }, { timeout: 100 });
    });

    it('should reload image when src prop changes', async () => {
      const { getByTestId, rerender } = render(<ImageComponent {...defaultProps} />);
      
      await waitFor(() => {
        const image = getByTestId('image');
        expect(image).toBeInTheDocument();
      });
      
      rerender(<ImageComponent {...defaultProps} src="new-image.png" />);
      
      await waitFor(() => {
        const image = getByTestId('image');
        expect(image).toBeInTheDocument();
      });
    });

    it('should set image state after load', async () => {
      const { getByTestId } = render(<ImageComponent {...defaultProps} />);
      
      await waitFor(() => {
        const image = getByTestId('image');
        expect(image).toBeInTheDocument();
      }, { timeout: 100 });
    });
  });

  describe('tooltip functionality', () => {
    it('should not show tooltip initially', () => {
      const { queryByTestId } = render(<ImageComponent {...defaultProps} />);
      const label = queryByTestId('label');
      expect(label).not.toBeInTheDocument();
    });

    it('should show tooltip on mouse enter', async () => {
      const { getByTestId, queryByTestId } = render(<ImageComponent {...defaultProps} />);
      const image = getByTestId('image');
      
      // Initially no tooltip
      expect(queryByTestId('label')).not.toBeInTheDocument();
      
      // Simulate mouse enter
      fireEvent.mouseEnter(image);
      
      // Wait for state update
      await waitFor(() => {
        const label = queryByTestId('label');
        expect(label).toBeInTheDocument();
      });
    });

    it('should hide tooltip on mouse leave', async () => {
      const { getByTestId, queryByTestId } = render(<ImageComponent {...defaultProps} />);
      const image = getByTestId('image');
      
      // Show tooltip
      fireEvent.mouseEnter(image);
      
      await waitFor(() => {
        expect(queryByTestId('label')).toBeInTheDocument();
      });
      
      // Hide tooltip
      fireEvent.mouseLeave(image);
      
      await waitFor(() => {
        expect(queryByTestId('label')).not.toBeInTheDocument();
      });
    });

    it('should render tooltip with correct text', async () => {
      const { getByTestId } = render(
        <ImageComponent {...defaultProps} tooltip="Custom tooltip" />
      );
      const image = getByTestId('image');
      
      fireEvent.mouseEnter(image);
      
      await waitFor(() => {
        const text = getByTestId('text');
        expect(text).toHaveAttribute('text', 'Custom tooltip');
      });
    });

    it('should not show tooltip when tooltip prop is empty', async () => {
      const { getByTestId, queryByTestId } = render(
        <ImageComponent {...defaultProps} tooltip="" />
      );
      const image = getByTestId('image');
      
      fireEvent.mouseEnter(image);
      
      // Even after mouse enter, tooltip should not show if text is empty
      await new Promise(resolve => setTimeout(resolve, 50));
      expect(queryByTestId('label')).not.toBeInTheDocument();
    });

    it('should handle long tooltip text', async () => {
      const longTooltip = 'This is a very long tooltip text that should still render correctly without breaking the component layout';
      const { getByTestId } = render(
        <ImageComponent {...defaultProps} tooltip={longTooltip} />
      );
      const image = getByTestId('image');
      
      fireEvent.mouseEnter(image);
      
      await waitFor(() => {
        const text = getByTestId('text');
        expect(text).toHaveAttribute('text', longTooltip);
      });
    });
  });

  describe('positioning', () => {
    it('should render at correct x position', () => {
      const { getByTestId } = render(
        <ImageComponent {...defaultProps} x={200} />
      );
      const image = getByTestId('image');
      expect(image).toHaveAttribute('x', '200');
    });

    it('should render at correct y position', () => {
      const { getByTestId } = render(
        <ImageComponent {...defaultProps} y={300} />
      );
      const image = getByTestId('image');
      expect(image).toHaveAttribute('y', '300');
    });

    it('should handle position at origin (0, 0)', () => {
      const { getByTestId } = render(
        <ImageComponent {...defaultProps} x={0} y={0} />
      );
      const image = getByTestId('image');
      expect(image).toHaveAttribute('x', '0');
      expect(image).toHaveAttribute('y', '0');
    });

    it('should handle negative positions', () => {
      const { getByTestId } = render(
        <ImageComponent {...defaultProps} x={-10} y={-20} />
      );
      const image = getByTestId('image');
      expect(image).toHaveAttribute('x', '-10');
      expect(image).toHaveAttribute('y', '-20');
    });

    it('should handle large position values', () => {
      const { getByTestId } = render(
        <ImageComponent {...defaultProps} x={1000} y={2000} />
      );
      const image = getByTestId('image');
      expect(image).toHaveAttribute('x', '1000');
      expect(image).toHaveAttribute('y', '2000');
    });

    it('should position tooltip relative to image', async () => {
      const { getByTestId } = render(<ImageComponent {...defaultProps} x={100} y={150} />);
      const image = getByTestId('image');
      
      fireEvent.mouseEnter(image);
      
      await waitFor(() => {
        const label = getByTestId('label');
        // Tooltip should be positioned at x - 30, y + 25
        expect(label).toHaveAttribute('x', '70');
        expect(label).toHaveAttribute('y', '175');
      });
    });
  });

  describe('image sources', () => {
    it('should handle data URI image source', async () => {
      const dataUri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      const { getByTestId } = render(
        <ImageComponent {...defaultProps} src={dataUri} />
      );
      const image = getByTestId('image');
      expect(image).toBeInTheDocument();
    });

    it('should handle relative path image source', () => {
      const { getByTestId } = render(
        <ImageComponent {...defaultProps} src="./images/icon.png" />
      );
      const image = getByTestId('image');
      expect(image).toBeInTheDocument();
    });

    it('should handle absolute URL image source', () => {
      const { getByTestId } = render(
        <ImageComponent {...defaultProps} src="https://example.com/image.png" />
      );
      const image = getByTestId('image');
      expect(image).toBeInTheDocument();
    });

    it('should handle SVG image source', () => {
      const { getByTestId } = render(
        <ImageComponent {...defaultProps} src="icon.svg" />
      );
      const image = getByTestId('image');
      expect(image).toBeInTheDocument();
    });
  });

  describe('component lifecycle', () => {
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

    it('should handle rapid prop changes', async () => {
      const { rerender, container } = render(<ImageComponent {...defaultProps} />);
      
      rerender(<ImageComponent {...defaultProps} x={150} y={200} />);
      
      await new Promise(resolve => setTimeout(resolve, 20));
      
      rerender(<ImageComponent {...defaultProps} x={200} y={250} />);
      
      const image = container.querySelector('[data-testid="image"]');
      expect(image).toHaveAttribute('x', '200');
      expect(image).toHaveAttribute('y', '250');
    });

    it('should handle src changes during image load', async () => {
      const { rerender, container } = render(<ImageComponent {...defaultProps} src="image1.png" />);
      
      // Change src before image loads
      rerender(<ImageComponent {...defaultProps} src="image2.png" />);
      
      await waitFor(() => {
        const image = container.querySelector('[data-testid="image"]');
        expect(image).toBeInTheDocument();
      });
    });
  });

  describe('edge cases', () => {
    it('should handle zero dimensions gracefully', () => {
      const { getByTestId } = render(
        <ImageComponent {...defaultProps} x={0} y={0} />
      );
      const image = getByTestId('image');
      expect(image).toHaveAttribute('x', '0');
      expect(image).toHaveAttribute('y', '0');
    });

    it('should render with special characters in tooltip', async () => {
      const specialTooltip = 'Test <>&"\'tooltip';
      const { getByTestId } = render(
        <ImageComponent {...defaultProps} tooltip={specialTooltip} />
      );
      const image = getByTestId('image');
      
      fireEvent.mouseEnter(image);
      
      await waitFor(() => {
        const text = getByTestId('text');
        expect(text).toHaveAttribute('text', specialTooltip);
      });
    });

    it('should handle Unicode characters in tooltip', async () => {
      const unicodeTooltip = 'Test 你好 🎉 tooltip';
      const { getByTestId } = render(
        <ImageComponent {...defaultProps} tooltip={unicodeTooltip} />
      );
      const image = getByTestId('image');
      
      fireEvent.mouseEnter(image);
      
      await waitFor(() => {
        const text = getByTestId('text');
        expect(text).toHaveAttribute('text', unicodeTooltip);
      });
    });

    it('should handle missing tooltip gracefully', () => {
      const { getByTestId } = render(
        <ImageComponent src="test.png" x={100} y={150} />
      );
      const image = getByTestId('image');
      expect(image).toBeInTheDocument();
    });
  });

  describe('tooltip styling', () => {
    it('should render tooltip with Tag component', async () => {
      const { getByTestId } = render(<ImageComponent {...defaultProps} />);
      const image = getByTestId('image');
      
      fireEvent.mouseEnter(image);
      
      await waitFor(() => {
        const tag = getByTestId('tag');
        expect(tag).toBeInTheDocument();
      });
    });

    it('should render tooltip with correct styling attributes', async () => {
      const { getByTestId } = render(<ImageComponent {...defaultProps} />);
      const image = getByTestId('image');
      
      fireEvent.mouseEnter(image);
      
      await waitFor(() => {
        const tag = getByTestId('tag');
        expect(tag).toHaveAttribute('fill', 'white');
        expect(tag).toHaveAttribute('cornerRadius', '5');
        expect(tag).toHaveAttribute('opacity', '0.9');
      });
    });

    it('should render tooltip text with padding', async () => {
      const { getByTestId } = render(<ImageComponent {...defaultProps} />);
      const image = getByTestId('image');
      
      fireEvent.mouseEnter(image);
      
      await waitFor(() => {
        const text = getByTestId('text');
        expect(text).toHaveAttribute('padding', '5');
      });
    });
  });

  describe('state management', () => {
    it('should update showTooltip state on mouse events', async () => {
      const { getByTestId, queryByTestId } = render(<ImageComponent {...defaultProps} />);
      const image = getByTestId('image');
      
      // Initially no tooltip
      expect(queryByTestId('label')).not.toBeInTheDocument();
      
      // Show tooltip
      fireEvent.mouseEnter(image);
      
      await waitFor(() => {
        expect(queryByTestId('label')).toBeInTheDocument();
      });
      
      // Hide tooltip
      fireEvent.mouseLeave(image);
      
      await waitFor(() => {
        expect(queryByTestId('label')).not.toBeInTheDocument();
      });
    });

    it('should update image state after load', async () => {
      const { getByTestId } = render(<ImageComponent {...defaultProps} />);
      
      await waitFor(() => {
        const image = getByTestId('image');
        expect(image).toHaveAttribute('image');
      }, { timeout: 100 });
    });
  });

  describe('PropTypes validation', () => {
    it('should accept all required props', () => {
      const { getByTestId } = render(<ImageComponent {...defaultProps} />);
      const image = getByTestId('image');
      expect(image).toBeInTheDocument();
    });

    it('should render with string src prop', () => {
      const { getByTestId } = render(
        <ImageComponent {...defaultProps} src="test.png" />
      );
      const image = getByTestId('image');
      expect(image).toBeInTheDocument();
    });

    it('should render with number x and y props', () => {
      const { getByTestId } = render(
        <ImageComponent {...defaultProps} x={100} y={200} />
      );
      const image = getByTestId('image');
      expect(image).toHaveAttribute('x', '100');
      expect(image).toHaveAttribute('y', '200');
    });

    it('should render with string tooltip prop', () => {
      const { getByTestId } = render(
        <ImageComponent {...defaultProps} tooltip="Tooltip text" />
      );
      const image = getByTestId('image');
      expect(image).toBeInTheDocument();
    });
  });
});
