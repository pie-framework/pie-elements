import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Palette from '../hotspot-palette';

describe('Palette', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      hotspotColor: '#FF0000',
      outlineColor: '#0000FF',
      hotspotList: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'],
      outlineList: ['#000000', '#0000FF', '#FF0000', '#00FF00'],
      onHotspotColorChange: jest.fn(),
      onOutlineColorChange: jest.fn(),
    };
  });

  describe('rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<Palette {...defaultProps} />);
      expect(container).toBeTruthy();
    });
  });

  describe('edge cases', () => {
    it('should handle empty hotspot list gracefully', () => {
      const { container } = render(<Palette {...defaultProps} hotspotList={[]} />);
      expect(container).toBeTruthy();
    });

    it('should handle empty outline list gracefully', () => {
      const { container } = render(<Palette {...defaultProps} outlineList={[]} />);
      expect(container).toBeTruthy();
    });
  });

  describe('onChange handler', () => {
    it('should create onChange handler for hotspot', () => {
      const component = new Palette(defaultProps);
      const handler = component.onChange('hotspot');
      expect(typeof handler).toBe('function');
    });

    it('should create onChange handler for outline', () => {
      const component = new Palette(defaultProps);
      const handler = component.onChange('outline');
      expect(typeof handler).toBe('function');
    });

    it('should call onHotspotColorChange when hotspot handler is invoked', () => {
      const onHotspotColorChange = jest.fn();
      const component = new Palette({ ...defaultProps, onHotspotColorChange });
      const handler = component.onChange('hotspot');
      
      handler({ target: { value: '#00FF00' } });
      
      expect(onHotspotColorChange).toHaveBeenCalledWith('#00FF00');
    });

    it('should call onOutlineColorChange when outline handler is invoked', () => {
      const onOutlineColorChange = jest.fn();
      const component = new Palette({ ...defaultProps, onOutlineColorChange });
      const handler = component.onChange('outline');
      
      handler({ target: { value: '#FF0000' } });
      
      expect(onOutlineColorChange).toHaveBeenCalledWith('#FF0000');
    });
  });
});
