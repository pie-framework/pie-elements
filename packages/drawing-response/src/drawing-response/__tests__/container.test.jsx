import { render } from '@testing-library/react';
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { Container } from '../container';

jest.mock('../drawable-palette', () => (props) => <div data-testid="drawable-palette" {...props} />);
jest.mock('../drawable-main', () => (props) => <div data-testid="drawable-main" {...props} />);
jest.mock('../drawable-text', () =>
  jest.fn().mockImplementation(() => ({
    removeEventListeners: jest.fn(),
  }))
);
jest.mock('../button', () => (props) => <button {...props}>{props.label}</button>);
jest.mock('../icon', () => (props) => <span {...props} />);

const theme = createTheme();

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('Container', () => {
  let onSessionChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderContainer = (props = {}) => {
    const defaultProps = {
      className: 'className',
      onSessionChange,
      imageDimensions: {},
      imageUrl: 'url',
      session: {},
      backgroundImageEnabled: true,
      ...props,
    };
    return render(
      <ThemeProvider theme={theme}>
        <Container {...defaultProps} />
      </ThemeProvider>
    );
  };

  describe('logic', () => {
    describe('setDimensions', () => {
      it('handles errors and clears interval', () => {
        // Create a container instance directly to test the setDimensions method
        const testInstance = new Container({
          onSessionChange,
          imageDimensions: {},
          imageUrl: 'url',
          session: {},
          backgroundImageEnabled: true,
        });

        // Set drawable to undefined to trigger error handling
        testInstance.drawable = undefined;

        // Spy on clearInterval
        const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

        // Call setDimensions which should handle the error and clear the interval
        testInstance.setDimensions();

        // Run all timers to execute the setInterval callback
        jest.runAllTimers();

        // Verify clearInterval was called
        expect(clearIntervalSpy).toHaveBeenCalled();

        clearIntervalSpy.mockRestore();
      });
    });
  });
});
