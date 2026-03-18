import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DraggableCalculator } from '../draggable-calculator';

jest.mock('@pie-framework/material-ui-calculator', () => {
  return function Calculator() {
    return <div data-testid="calculator">Calculator</div>;
  };
});

jest.mock('react-draggable', () => {
  return function Draggable(props) {
    return <div data-testid="draggable">{props.children}</div>;
  };
});

const theme = createTheme();

describe('DraggableCalculator', () => {
  const renderDraggable = (props = {}) => {
    return render(
      <ThemeProvider theme={theme}>
        <DraggableCalculator
          mode="basic"
          show={true}
          onClose={jest.fn()}
          {...props}
        />
      </ThemeProvider>
    );
  };

  it('renders without crashing', () => {
    const { container } = renderDraggable();
    expect(container).toBeInTheDocument();
  });

  describe('logic', () => {
    it('updates state.deltaPosition', () => {
      // Test the method directly by creating an instance
      const onClose = jest.fn();
      const instance = new DraggableCalculator({
        mode: 'basic',
        show: true,
        onClose,
      });

      // Initialize state
      instance.state = {
        deltaPosition: { x: 0, y: 0 },
      };

      // Mock setState to directly update state (simulating what React does)
      instance.setState = jest.fn((updater) => {
        if (typeof updater === 'function') {
          instance.state = { ...instance.state, ...updater(instance.state) };
        } else {
          instance.state = { ...instance.state, ...updater };
        }
      });

      instance.handleDrag(null, { deltaX: 10, deltaY: 10 });
      expect(instance.state.deltaPosition).toEqual({ x: 10, y: 10 });
    });
  });
});
