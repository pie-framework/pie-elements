import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Design } from '../index';

const model = (extras) => ({
  choices: [{ id: '1', content: 'content' }],
  correctResponse: [{ category: '1', choices: ['1'] }],
  categories: [{ id: '1', label: 'Category Title' }],
  ...extras,
});

jest.mock('@pie-lib/config-ui', () => {
  const React = require('react');
  const InputContainer = React.forwardRef((props, ref) => <div ref={ref} {...props} />);
  InputContainer.displayName = 'InputContainer';

  return {
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
    FeedbackConfig: (props) => <div {...props} />,
    AlertDialog: (props) => <div {...props} />,
    InputContainer,
  };
});

jest.mock('@pie-lib/categorize', () => ({
  ensureNoExtraChoicesInAlternate: jest.fn(),
  countInAnswer: jest.fn().mockReturnValue(1),
  ensureNoExtraChoicesInAnswer: jest.fn(),
}));

jest.mock('@pie-lib/drag', () => ({
  DragProvider: ({ children }) => <div>{children}</div>,
  uid: {
    generateId: jest.fn(() => 'test-uid'),
    Provider: ({ children }) => <div>{children}</div>,
    withUid: (Component) => Component,
  },
}));

jest.mock('@pie-lib/editable-html-tip-tap', () => (props) => <div {...props} />);
jest.mock('@pie-lib/math-rendering', () => ({ renderMath: jest.fn() }));
jest.mock('@pie-lib/translator', () => {
  const translator = {
    t: (key) => key,
  };
  return {
    __esModule: true,
    default: { translator },
  };
});

jest.mock('../categories', () => ({
  __esModule: true,
  default: (props) => <div {...props} />,
}));
jest.mock('../categories/alternateResponses', () => ({
  __esModule: true,
  default: (props) => <div {...props} />,
}));
jest.mock('../choices', () => ({
  __esModule: true,
  default: (props) => <div {...props} />,
}));

const theme = createTheme();

describe('Design', () => {
  let onChange = jest.fn();

  beforeEach(() => {
    onChange = jest.fn();
  });

  const renderDesign = (extras) => {
    const defaults = {
      classes: { design: 'design', text: 'text' },
      className: 'className',
      onChange,
      model: model(),
      uid: '1',
    };
    const props = { ...defaults, ...extras };

    return render(
      <ThemeProvider theme={theme}>
        <Design {...props} />
      </ThemeProvider>
    );
  };

  describe('renders', () => {
    it('renders without crashing', () => {
      const { container } = renderDesign();
      expect(container).toBeInTheDocument();
    });
  });
});
