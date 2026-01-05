import React from 'react';
import { render } from '@testing-library/react';
import _ from 'lodash';
import { stubContext } from './utils';
import { Ray } from '../ray';

// Mock Point component
jest.mock('../point', () => () => <text>Point</text>);

// Mock Arrow component
jest.mock('../../arrow', () => (props) => <polygon data-testid="arrow" {...props} />);

describe('ray', () => {
  const mkWrapper = (props) => {
    const onMove = jest.fn();
    const onToggleSelect = jest.fn();

    const defaults = {
      domain: { min: 0, max: 1 },
      selected: false,
      correct: false,
      empty: false,
      direction: 'positive',
      position: 1,
      onMove: onMove,
      interval: 10,
      width: 100,
      onToggleSelect: onToggleSelect,
    };

    props = _.merge(defaults, props);

    // Create a wrapper component that provides context
    const RayWrapper = () => {
      const FakeContext = React.createContext(stubContext);
      Ray.contextType = FakeContext;

      return (
        <FakeContext.Provider value={stubContext}>
          <svg>
            <Ray {...props} />
          </svg>
        </FakeContext.Provider>
      );
    };

    return { component: render(<RayWrapper />), props };
  };

  describe('rendering', () => {
    it('renders with default props', () => {
      const { component } = mkWrapper();
      expect(component.container.querySelector('line.line-handle')).toBeInTheDocument();
    });

    it('renders with selected=true', () => {
      const { component } = mkWrapper({ selected: true });
      expect(component.container.querySelector('line.line-handle')).toBeInTheDocument();
    });

    it('renders with selected=true and correct=true', () => {
      const { component } = mkWrapper({ selected: true, correct: true });
      expect(component.container.querySelector('line.line-handle')).toBeInTheDocument();
    });

    it('renders line element', () => {
      const { component } = mkWrapper();
      expect(component.container.querySelector('line')).toBeInTheDocument();
    });

    it('renders Point component', () => {
      const { component } = mkWrapper();
      const point = component.container.querySelector('text');
      expect(point).toBeInTheDocument();
    });

    it('renders Arrow component', () => {
      const { component } = mkWrapper();
      expect(component.getByTestId('arrow')).toBeInTheDocument();
    });

    it('renders with direction=positive', () => {
      const { component } = mkWrapper({ direction: 'positive' });
      expect(component.getByTestId('arrow')).toBeInTheDocument();
    });

    it('renders with direction=negative', () => {
      const { component } = mkWrapper({ direction: 'negative' });
      expect(component.getByTestId('arrow')).toBeInTheDocument();
    });
  });

  describe('instance methods', () => {
    const createInstance = (props) => {
      const onMove = jest.fn();
      const onToggleSelect = jest.fn();

      const defaults = {
        domain: { min: 0, max: 1 },
        selected: false,
        correct: false,
        empty: false,
        direction: 'positive',
        position: 1,
        onMove: onMove,
        interval: 10,
        width: 100,
        onToggleSelect: onToggleSelect,
      };

      props = _.merge(defaults, props);
      const instance = new Ray(props);
      instance.context = stubContext;
      instance.setState = jest.fn((state) => {
        Object.assign(instance.state, typeof state === 'function' ? state(instance.state) : state);
      });
      return instance;
    };

    describe('drag', () => {
      it('does not set state.dragPosition if position < domain.min', () => {
        const instance = createInstance();
        instance.drag(-5);
        expect(instance.state.dragPosition).toEqual(null);
      });

      it('does not set state.dragPosition if position > domain.max', () => {
        const instance = createInstance();
        instance.drag(100);
        expect(instance.state.dragPosition).toEqual(null);
      });

      it('sets state.dragPosition', () => {
        const instance = createInstance();
        instance.drag(0);
        expect(instance.state.dragPosition).toEqual(0);
      });
    });

    describe('stopDrag', () => {
      it('sets state.dragPosition', () => {
        const instance = createInstance();
        instance.drag(0);
        expect(instance.state.dragPosition).toEqual(0);
        instance.stopDrag();
        expect(instance.state.dragPosition).toEqual(null);
      });
    });
  });
});
