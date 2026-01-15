import * as React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CorrectResponse } from '../correct-response';
import defaultValues from '../defaults';

jest.mock('@pie-lib/graphing-solution-set', () => {
  const React = require('react');
  return {
    GraphContainer: (props) => React.createElement('div', { 'data-testid': 'graph-container', ...props }),
  };
});

jest.mock('@pie-lib/config-ui', () => {
  const React = require('react');
  return {
    AlertDialog: (props) => React.createElement('div', { 'data-testid': 'alert-dialog', ...props }),
  };
});

jest.mock('@pie-lib/math-rendering', () => ({
  renderMath: jest.fn(),
}));

const theme = createTheme();

describe('CorrectResponse', () => {
  let props;

  beforeEach(() => {
    props = {
      classes: {},
      model: defaultValues.model,
      onChange: jest.fn(),
      tools: [],
    };
  });

  const renderCorrectResponse = (newProps = {}) => {
    const configureProps = { ...props, ...newProps };

    return render(
      <ThemeProvider theme={theme}>
        <CorrectResponse {...configureProps} />
      </ThemeProvider>
    );
  };

  describe('renders', () => {
    it('snapshot', () => {
      const { container } = renderCorrectResponse();
      expect(container).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    it('changeMarks calls onChange', () => {
      const onChange = jest.fn();
      const testInstance = new CorrectResponse({ ...props, onChange });
      const marks = [{ type: 'line', from: { x: 0, y: 0 }, to: { x: 1, y: 1 }, fill: 'Solid' }];

      testInstance.changeMarks(marks);

      expect(onChange).toBeCalledWith({
        ...defaultValues.model,
        answers: {
          ...defaultValues.model.answers,
          correctAnswer: {
            name: 'Correct Answer',
            marks,
          },
        },
      });
    });
  });
});

describe('CorrectResponse: if answers is null it should still work as expected', () => {
  let props;

  beforeEach(() => {
    props = {
      classes: {},
      model: { ...defaultValues.model, answers: null },
      onChange: jest.fn(),
      tools: [],
    };
  });

  const renderCorrectResponse = (newProps = {}) => {
    const configureProps = { ...props, ...newProps };

    return render(
      <ThemeProvider theme={theme}>
        <CorrectResponse {...configureProps} />
      </ThemeProvider>
    );
  };

  describe('logic', () => {
    it('changeMarks calls onChange', () => {
      const onChange = jest.fn();
      const testInstance = new CorrectResponse({ ...props, onChange });
      const marks = [{ type: 'line', from: { x: 0, y: 0 }, to: { x: 1, y: 1 }, fill: 'Solid' }];

      testInstance.changeMarks(marks);

      expect(onChange).toBeCalledWith({
        ...props.model,
        answers: {
          correctAnswer: {
            marks,
          },
        },
      });
    });
  });
});

describe('CorrectResponse: if answers is undefined it should still work as expected', () => {
  let props;

  beforeEach(() => {
    props = {
      classes: {},
      model: { ...defaultValues.model, answers: undefined },
      onChange: jest.fn(),
      tools: [],
    };
  });

  const renderCorrectResponse = (newProps = {}) => {
    const configureProps = { ...props, ...newProps };

    return render(
      <ThemeProvider theme={theme}>
        <CorrectResponse {...configureProps} />
      </ThemeProvider>
    );
  };

  describe('logic', () => {
    it('changeMarks calls onChange', () => {
      const onChange = jest.fn();
      const testInstance = new CorrectResponse({ ...props, onChange });
      const marks = [{ type: 'line', from: { x: 0, y: 0 }, to: { x: 1, y: 1 }, fill: 'Solid' }];

      testInstance.changeMarks(marks);

      expect(onChange).toBeCalledWith({
        ...props.model,
        answers: {
          correctAnswer: {
            marks,
          },
        },
      });
    });
  });
});
