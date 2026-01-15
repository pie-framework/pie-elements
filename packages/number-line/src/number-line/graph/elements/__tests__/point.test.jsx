import React from 'react';
import { render } from '@testing-library/react';
import _ from 'lodash';
import { stubContext } from './utils';
import { Point } from '../point';

// Mock Draggable to avoid dnd-kit dependencies
jest.mock('../../../../draggable', () => ({
  Draggable: ({ children }) => children({
    setNodeRef: jest.fn(),
    attributes: {},
    listeners: {},
    translateX: 0,
    isDragging: false,
    onMouseDown: jest.fn()
  }),
}));

describe('point', () => {
  const mkWrapper = (props) => {
    const onMove = jest.fn();
    const onClick = jest.fn();
    const onDragStart = jest.fn();
    const onDragStop = jest.fn();
    const onDrag = jest.fn();

    const defaults = {
      interval: 10,
      position: 1,
      bounds: {
        left: -1,
        right: 9,
      },
      selected: false,
      disabled: false,
      correct: false,
      empty: false,
      y: 0,
      onMove,
      onClick,
      onDragStart,
      onDragStop,
      onDrag,
    };

    props = _.merge(defaults, props);

    // Create a wrapper component that provides context
    const PointWrapper = () => {
      const FakeContext = React.createContext(stubContext);
      Point.contextType = FakeContext;

      return (
        <FakeContext.Provider value={stubContext}>
          <svg>
            <Point {...props} />
          </svg>
        </FakeContext.Provider>
      );
    };

    return { component: render(<PointWrapper />), props };
  };

  describe('rendering', () => {
    it('renders with selected=true', () => {
      const { component } = mkWrapper({ selected: true });
      expect(component.container.querySelector('circle')).toBeInTheDocument();
    });

    it('renders with selected=false', () => {
      const { component } = mkWrapper({ selected: false });
      expect(component.container.querySelector('circle')).toBeInTheDocument();
    });

    it('renders with selected=true and correct=true', () => {
      const { component } = mkWrapper({ selected: true, correct: true });
      expect(component.container.querySelector('circle')).toBeInTheDocument();
    });

    it('renders with empty=true, selected=true, and correct=true', () => {
      const { component } = mkWrapper({ empty: true, selected: true, correct: true });
      expect(component.container.querySelector('circle')).toBeInTheDocument();
    });
  });

  describe('interaction', () => {
    it('renders with draggable functionality', () => {
      const { component } = mkWrapper();
      expect(component.container.querySelector('circle')).toBeInTheDocument();
    });
  });
});
