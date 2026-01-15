import React from 'react';
import { render, screen } from '@testing-library/react';
import Konva from 'konva';

import CorrectAnswerToggle from '@pie-lib/correct-answer-toggle';

import Container, { Container as ContainerComp } from '../hotspot/container';
import HotspotComponent from '../hotspot/index';

global.MutationObserver = class {
  constructor(callback) {}
  disconnect() {}
  observe(element, initObject) {}
};

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

describe('HotspotComponent', () => {
  describe('renders', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = (modelProps) => render(
        <HotspotComponent
          model={{
            dimensions: { width: 0, height: 0 },
            shapes: { rectangles: [], polygons: [], circles: [] },
            ...modelProps,
          }}
          session={{}}
          classes={{}}
        />
      );
    });

    it('snapshot', () => {
      const { container } = wrapper();
      expect(container).toMatchSnapshot();
    });

    it('snapshot with rationale', () => {
      const { container } = wrapper({ rationale: 'This is rationale' });
      expect(container).toMatchSnapshot();
    });

    it('snapshot with padding having a size accordingly to strokeWidth', () => {
      const { container } = render(
        <ContainerComp
          strokeWidth={50}
          classes={{}}
          dimensions={{ width: 100, height: 100 }}
          onSelectChoice={jest.fn()}
          disabled={false}
          hotspotColor="#000"
          outlineColor="#FAFAFA"
          imageUrl="data:image/jpeg;base64,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"
          isEvaluateMode={false}
          session={{ answers: [{ id: '1' }, { id: '2' }] }}
          shapes={{
            rectangles: [
              {
                id: '1',
                correct: true,
                x: 0,
                y: 0,
                width: 80,
                height: 80,
              },
            ],
            polygons: [],
          }}
        />,
      );

      expect(container).toMatchSnapshot();
    });
  });
});

describe('CorrectAnswerToggle', () => {
  const model = {
    mode: 'evaluate',
    responseCorrect: false,
  };

  const createComponent = (props) => {
    return render(
      <HotspotComponent
        model={{
          ...model,
          ...props,
        }}
      />
    );
  };

  it('does not render outside of evaluate mode', () => {
    const { container } = createComponent({ mode: 'gather' });
    const toggle = container.querySelector('[data-testid="correct-answer-toggle"]');
    expect(toggle).toBeNull();
  });

  it('does not render if the response is correct', () => {
    const { container } = createComponent({ responseCorrect: true });
    const toggle = container.querySelector('[data-testid="correct-answer-toggle"]');
    expect(toggle).toBeNull();
  });
});

describe('Container', () => {
  let onSelectChoice;

  const mkWrapper = (opts = {}) => {
    opts = {
      classes: { base: 'base' },
      dimensions: { height: 0, width: 0 },
      disabled: false,
      hotspotColor: 'rgba(137, 183, 244, 0.65)',
      imageUrl: '',
      isEvaluateMode: false,
      outlineColor: 'blue',
      session: { answers: [] },
      shapes: {
        rectangles: [],
        polygons: [],
      },
      ...opts,
    };

    return render(<Container {...opts} onSelectChoice={onSelectChoice} />);
  };

  beforeEach(() => {
    onSelectChoice = jest.fn();
  });

  describe('snapshots', () => {
    describe('outline color', () => {
      it('renders', () => {
        const { container } = mkWrapper({ outlineColor: 'red' });
        expect(container).toMatchSnapshot();
      });
    });

    describe('hotspot color', () => {
      it('renders', () => {
        const { container } = mkWrapper({ hotspotColor: 'rgba(217, 30, 24, 0.65)' });
        expect(container).toMatchSnapshot();
      });
    });

    describe('image', () => {
      it('renders', () => {
        const { container } = mkWrapper({ imageUrl: 'https://picsum.photos/id/102/200/300' });
        expect(container).toMatchSnapshot();
      });
    });

    describe('shapes', () => {
      it('renders', () => {
        const { container } = mkWrapper({
          shapes: {
            rectangles: [
              { id: '1', x: 5, y: 5, width: 5, height: 5 },
              { id: '2', x: 25, y: 25, width: 5, height: 5 },
            ],
            polygons: [
              {
                id: '3',
                points: [
                  { x: 94, y: 4 },
                  { x: 89, y: 4 },
                  { x: 36, y: 40 },
                ],
              },
            ],
          },
          imageUrl: 'https://picsum.photos/id/102/200/300',
          dimensions: {
            width: 200,
            height: 300,
          },
        });
        expect(container).toMatchSnapshot();
      });
    });
  });
});
