import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { Main } from '../main';

jest.mock('@pie-lib/render-ui', () => ({
  PreviewPrompt: ({ prompt }) => <div data-testid="preview-prompt">{prompt}</div>,
  Collapsible: ({ children }) => <div data-testid="collapsible">{children}</div>,
  UiLayout: ({ children }) => <div data-testid="ui-layout">{children}</div>,
  hasText: jest.fn(() => true),
  hasMedia: jest.fn(() => false),
  color: {
    text: () => '#000',
    background: () => '#fff',
  },
}));

jest.mock('@pie-lib/correct-answer-toggle', () => ({
  __esModule: true,
  default: (props) => <div data-testid="correct-answer-toggle">{props.children}</div>,
}));

jest.mock('@pie-lib/mask-markup', () => ({
  DragInTheBlank: (props) => <div data-testid="drag-in-the-blank">{props.children}</div>,
}));

const theme = createTheme();

describe('Main', () => {
  let onChange;

  beforeEach(() => {
    onChange = jest.fn();
  });

  const renderMain = (extras = {}) => {
    const props = {
      model: {
        prompt: 'Prompt',
        mode: 'gather',
        rationale: 'Rationale',
        teacherInstructions: 'Teacher Instructions',
        rationaleEnabled: true,
        promptEnabled: true,
        teacherInstructionsEnabled: true,
        studentInstructionsEnabled: true,
        id: '1',
        element: 'drag-in-the-blank',
        markup: '{{0}} + {{1}} = 15',
        disabled: false,
        choices: [
          { value: '<div>9</div>', id: '1' },
          { value: '<div>6</div>', id: '0' },
        ],
        choicesPosition: 'below',
        correctResponse: { 0: '0', 1: '1' },
        duplicates: true,
        alternateResponses: [['1'], ['0']],
        feedback: {},
        ...extras,
      },
      value: { 0: '1', 1: '0' },
      onChange,
    };

    return render(
      <ThemeProvider theme={theme}>
        <Main {...props} />
      </ThemeProvider>
    );
  };

  describe('render', () => {
    it('should render in gather mode', () => {
      const { container } = renderMain();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render in view mode', () => {
      const { container } = renderMain({ mode: 'view' });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render in evaluate mode', () => {
      const { container } = renderMain({ mode: 'evaluate' });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render without teacher instructions', () => {
      const { container } = renderMain({ teacherInstructions: null });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render without rationale', () => {
      const { container } = renderMain({ rationale: null });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render without prompt', () => {
      const { container } = renderMain({ prompt: null });
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
