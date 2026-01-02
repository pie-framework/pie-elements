import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';
import Main from '../main';

jest.mock('../answer-fraction', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: (props) => React.createElement('div', { 'data-testid': 'answer-fraction', ...props }),
  };
});

jest.mock('../fraction-model-chart', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: (props) => React.createElement('div', { 'data-testid': 'fraction-model-chart', ...props }),
  };
});

jest.mock('@pie-lib/correct-answer-toggle', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: (props) => React.createElement('div', { 'data-testid': 'correct-answer-toggle', ...props }),
  };
});

jest.mock('@pie-lib/config-ui', () => {
  const React = require('react');
  return {
    AlertDialog: (props) => React.createElement('div', { 'data-testid': 'alert-dialog', ...props }),
  };
});

jest.mock('@pie-lib/render-ui', () => {
  const React = require('react');
  return {
    PreviewPrompt: ({ prompt }) => React.createElement('div', { 'data-testid': 'preview-prompt' }, prompt),
    UiLayout: ({ children }) => React.createElement('div', { 'data-testid': 'ui-layout' }, children),
  };
});

const theme = createTheme();

describe('Main', () => {
  const defaultProps = {
    model: {
      correctResponse: [],
      title: '',
      prompt: '',
      modelTypeSelected: 'bar',
      maxModelSelected: 1,
      partsPerModel: 5,
      allowedStudentConfig: false,
      showGraphLabels: false,
    },
    session: {},
    onSessionChange: jest.fn(),
  };

  const renderMain = (extras = {}) => {
    const props = { ...defaultProps, ...extras };

    return render(
      <ThemeProvider theme={theme}>
        <Main {...props} />
      </ThemeProvider>
    );
  };

  describe('render', () => {
    it('snapshot', () => {
      const { container } = renderMain();
      expect(container).toMatchSnapshot();
    });

    it('renders correctly', () => {
      renderMain();

      // Component renders with AnswerFraction
      expect(screen.getByTestId('answer-fraction')).toBeInTheDocument();
    });

    it('renders correctly with a pre-filled session', () => {
      renderMain({
        session: {
          answers: {
            noOfModel: 2,
            partsPerModel: 4,
            response: [
              { id: 1, value: 4 },
              { id: 2, value: 3 },
            ],
          },
        },
      });

      expect(screen.getByTestId('answer-fraction')).toBeInTheDocument();
    });

    it('generate answers correctly from selection', () => {
      const testInstance = new Main(defaultProps);

      expect(
        testInstance.generateAnswers({
          allowedStudentConfig: true,
        }),
      ).toEqual({
        noOfModel: '',
        partsPerModel: '',
        response: [],
      });
    });

    it('on answer change correctly after selection', () => {
      const testInstance = new Main(defaultProps);

      testInstance.state = {
        session: {
          answers: {
            response: [],
          },
        },
        showCorrect: false,
        answerChangeDialog: {
          open: false,
          text: '',
        },
      };

      testInstance.setState = jest.fn((updater) => {
        const newState = typeof updater === 'function' ? updater(testInstance.state) : updater;
        testInstance.state = { ...testInstance.state, ...newState };
      });

      testInstance.onAnswerChange({
        noOfModel: 4,
        partsPerModel: 2,
        response: [
          { id: 1, value: 2 },
          { id: 2, value: 2 },
          { id: 3, value: 2 },
          { id: 4, value: 1 },
        ],
      });

      expect(testInstance.state).toEqual({
        session: {
          answers: {
            response: [],
          },
        },
        showCorrect: false,
        answerChangeDialog: {
          newSession: {
            answers: {
              noOfModel: 4,
              partsPerModel: 2,
              response: [
                { id: 1, value: 2 },
                { id: 2, value: 2 },
                { id: 3, value: 2 },
                { id: 4, value: 1 },
              ],
            },
          },
          oldSession: {
            answers: {
              response: [],
            },
          },
          open: true,
          text: 'Changing either the Number of Models or Parts per Model will remove added answer. Are you sure you want to continue?',
        },
      });
    });
  });
});
