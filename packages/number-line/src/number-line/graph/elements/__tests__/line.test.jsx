import React from 'react';
import { render } from '@testing-library/react';
import _ from 'lodash';
import { stubContext } from './utils';
import { Line } from '../line';

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

// Mock Point component
jest.mock('../point', () => () => <text>Point</text>);

describe('line', () => {
  const mkWrapper = (props) => {
    const onMoveLine = jest.fn();
    const onToggleSelect = jest.fn();
    const onDragStart = jest.fn();
    const onDragStop = jest.fn();

    const defaults = {
      domain: {
        min: 0,
        max: 10,
      },
      empty: {
        left: true,
        right: false,
      },
      position: {
        left: 2,
        right: 3,
      },
      y: 0,
      selected: false,
      disabled: false,
      correct: false,
      interval: 10,
      onMoveLine,
      onToggleSelect,
      onDragStart,
      onDragStop,
    };

    props = _.merge(defaults, props);

    // Create a wrapper component that provides context
    const LineWrapper = () => {
      const FakeContext = React.createContext(stubContext);
      Line.contextType = FakeContext;

      return (
        <FakeContext.Provider value={stubContext}>
          <svg>
            <Line {...props} />
          </svg>
        </FakeContext.Provider>
      );
    };

    return { component: render(<LineWrapper />), props };
  };

  describe('rendering', () => {
    it('renders with selected=true', () => {
      const { component } = mkWrapper({ selected: true });
      expect(component.container.querySelector('line.line-handle')).toBeInTheDocument();
    });

    it('renders with selected=false', () => {
      const { component } = mkWrapper({ selected: false });
      expect(component.container.querySelector('line.line-handle')).toBeInTheDocument();
    });

    it('renders with selected=true and correct=true', () => {
      const { component } = mkWrapper({ selected: true, correct: true });
      expect(component.container.querySelector('line.line-handle')).toBeInTheDocument();
    });

    it('renders rect element', () => {
      const { component } = mkWrapper();
      expect(component.container.querySelector('rect')).toBeInTheDocument();
    });

    it('renders two Point components', () => {
      const { component } = mkWrapper();
      const points = component.container.querySelectorAll('text');
      expect(points.length).toBe(2);
    });
  });
});
