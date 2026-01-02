import React from 'react';
import { render } from '@testing-library/react';
import Konva from 'konva';

import Polygon from '../hotspot/polygon';

Konva.isBrowser = false;

jest.mock('react-konva', () => {
  const React = require('react');
  return {
    Stage: ({ children, ...props }) => React.createElement('div', { 'data-testid': 'stage', ...props }, children),
    Layer: ({ children, ...props }) => React.createElement('div', { 'data-testid': 'layer', ...props }, children),
    Rect: (props) => React.createElement('div', { 'data-testid': 'rect', ...props }),
    Circle: (props) => React.createElement('div', { 'data-testid': 'circle', ...props }),
    Line: (props) => React.createElement('div', { 'data-testid': 'line', ...props }),
    Group: ({ children, ...props }) => React.createElement('div', { 'data-testid': 'group', ...props }, children),
    Image: (props) => React.createElement('div', { 'data-testid': 'image', ...props }),
  };
});

describe('Polygon', () => {
  let onClick;

  const mkWrapper = (opts = {}) => {
    opts = {
      classes: { base: 'base' },
      height: 200,
      hotspotColor: 'rgba(137, 183, 244, 0.65)',
      id: '1',
      isCorrect: false,
      isEvaluateMode: false,
      evaluateText: null,
      disabled: false,
      outlineColor: 'blue',
      selected: false,
      points: [
        { x: 94, y: 4 },
        { x: 89, y: 4 },
        { x: 36, y: 40 },
      ],
      ...opts,
    };

    return render(<Polygon {...opts} onClick={onClick} />);
  };

  beforeEach(() => {
    onClick = jest.fn();
  });

  describe('snapshots', () => {
    describe('outline color', () => {
      it('renders', () => {
        const { container } = mkWrapper({ outlineColor: 'red' });
        expect(container).toMatchSnapshot();
      });
    });

    describe('outline width', () => {
      it('renders with default border width', () => {
        const { container } = mkWrapper();
        expect(container).toMatchSnapshot();
      });

      it('renders with given border width', () => {
        const { container } = mkWrapper({ strokeWidth: 10 });
        expect(container).toMatchSnapshot();
      });
    });

    describe('hotspot color', () => {
      it('renders', () => {
        const { container } = mkWrapper({ hotspotColor: 'rgba(217, 30, 24, 0.65)' });
        expect(container).toMatchSnapshot();
      });
    });

    describe('evaluate with correct answer', () => {
      it('renders', () => {
        const { container } = mkWrapper({ isEvaluateMode: true, isCorrect: true, evaluateText: 'Correctly\nselected' });
        expect(container).toMatchSnapshot();
      });
    });
  });
});
