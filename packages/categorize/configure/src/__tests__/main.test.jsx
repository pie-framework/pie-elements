import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { Main } from '../main';

jest.mock('@pie-lib/config-ui', () => ({
  layout: {
    ConfigLayout: (props) => <div {...props} />,
  },
  choiceUtils: {
    firstAvailableIndex: jest.fn(),
  },
  settings: {
    Panel: (props) => <div {...props} />,
    toggle: jest.fn(),
    radio: jest.fn(),
  },
  InputContainer: (props) => <div {...props} />,
  FeedbackConfig: (props) => <div {...props} />,
  AlertDialog: (props) => <div {...props} />,
}));

jest.mock('@pie-lib/drag', () => ({
  DragProvider: ({ children }) => <div>{children}</div>,
  uid: {
    generateId: jest.fn(() => 'test-uid'),
    Provider: ({ children }) => <div>{children}</div>,
    withUid: (Component) => Component,
  },
}));

jest.mock('@pie-lib/editable-html', () => (props) => <div {...props} />);
jest.mock('@pie-lib/math-rendering', () => ({ renderMath: jest.fn() }));
jest.mock('@pie-lib/categorize', () => ({
  countInAnswer: jest.fn(),
  ensureNoExtraChoicesInAnswer: jest.fn(),
  ensureNoExtraChoicesInAlternate: jest.fn(),
  moveChoiceToCategory: jest.fn(),
  moveChoiceToAlternate: jest.fn(),
  removeChoiceFromCategory: jest.fn(),
  removeChoiceFromAlternate: jest.fn(),
  verifyAllowMultiplePlacements: jest.fn(),
}));

const theme = createTheme();

const model = () => ({
  correctResponse: [],
  choices: [],
  categories: [],
});

describe('Main', () => {
  let onModelChanged = jest.fn();
  const renderMain = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      onModelChanged,
      model: model(),
    };
    const props = { ...defaults, ...extras };

    return render(
      <ThemeProvider theme={theme}>
        <Main {...props} />
      </ThemeProvider>
    );
  };

  describe('renders', () => {
    it('renders without crashing', () => {
      const { container } = renderMain();
      expect(container).toBeInTheDocument();
    });
  });
});
