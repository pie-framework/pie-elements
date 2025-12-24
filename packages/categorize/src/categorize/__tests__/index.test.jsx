import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Categorize } from '../index';

jest.mock('@pie-lib/drag', () => ({
  uid: {
    withUid: jest.fn((a) => a),
    Provider: ({ children }) => <div>{children}</div>,
    generateId: jest.fn().mockReturnValue('1'),
  },
  withDragContext: jest.fn((n) => n),
  DragProvider: ({ children }) => <div>{children}</div>,
}));

jest.mock('../categories', () => ({
  Categories: (props) => <div {...props} />,
}));
jest.mock('../choices', () => ({
  Choices: (props) => <div {...props} />,
}));
jest.mock('@pie-lib/render-ui', () => {
  const React = require('react');
  const UiLayout = React.forwardRef((props, ref) => <div ref={ref} {...props} />);
  UiLayout.displayName = 'UiLayout';

  return {
    Collapsible: ({ children }) => <div>{children}</div>,
    Feedback: (props) => <div {...props} />,
    UiLayout,
    hasText: jest.fn(() => false),
    hasMedia: jest.fn(() => false),
    PreviewPrompt: (props) => <div {...props} />,
    color: {
      text: () => '#000',
      background: () => '#fff',
    },
  };
});

const theme = createTheme();

describe('categorize', () => {
  const defaultProps = {
    classes: {},
    session: {
      answers: [],
    },
    model: {
      choices: [],
      categories: [],
    },
  };
  let onAnswersChange;
  let onShowCorrectToggle;

  beforeEach(() => {
    onAnswersChange = jest.fn();
    onShowCorrectToggle = jest.fn();
  });

  const renderCategorize = (extras) => {
    const defaults = {
      ...defaultProps,
      onAnswersChange,
      onShowCorrectToggle,
    };
    const props = { ...defaults, ...extras };

    return render(
      <ThemeProvider theme={theme}>
        <Categorize {...props} />
      </ThemeProvider>
    );
  };

  describe('renders', () => {
    it('renders without crashing', () => {
      const { container } = renderCategorize();
      expect(container).toBeInTheDocument();
    });

    it('renders with feedback', () => {
      const { container } = renderCategorize({
        model: {
          ...defaultProps.model,
          correctness: 'correct',
          feedback: {
            correct: {
              type: 'default',
              default: 'Correct',
            },
            incorrect: {
              type: 'default',
              default: 'Incorrect',
            },
            partial: {
              type: 'default',
              default: 'Nearly',
            },
          },
        },
      });
      expect(container).toBeInTheDocument();
    });

    it('renders when incorrect', () => {
      const { container } = renderCategorize({ incorrect: true });
      expect(container).toBeInTheDocument();
    });
  });
});
