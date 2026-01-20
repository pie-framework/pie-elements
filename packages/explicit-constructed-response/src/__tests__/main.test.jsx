import { render } from '@testing-library/react';
import React from 'react';
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
  default: ({ children }) => <div data-testid="correct-answer-toggle">{children}</div>,
}));

jest.mock('@pie-lib/mask-markup', () => ({
  ConstructedResponse: (props) => <div data-testid="constructed-response" {...props} />,
}));

const theme = createTheme();

const choice = (l, v) => ({ label: l, value: v });

describe('Main', () => {
  let onChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderMain = (extra = {}) => {
    const props = {
      classes: {},
      prompt: 'Prompt',
      rationale: 'Rationale',
      teacherInstructions: 'Teacher Instructions',
      disabled: false,
      choices: {
        0: [choice('cow', '0'), choice('cattle', '1'), choice('calf', '2')],
        1: [choice('over', '0'), choice('past', '1'), choice('beyond', '2')],
        2: [choice('moon', '0')],
      },
      markup: '<p>The {{0}} jumped {{1}} the {{2}}</p>',
      mode: 'gather',
      feedback: { 0: 'correct', 1: 'correct', 2: 'correct' },
      value: { 0: '1', 1: '0', 2: '0' },
      onChange,
      ...extra,
    };

    return render(
      <ThemeProvider theme={theme}>
        <Main {...props} />
      </ThemeProvider>
    );
  };

  describe('logic', () => {
    it('onChange calls the onChange prop after debounce', () => {
      jest.useFakeTimers();
      const { container } = renderMain();

      // Get the Main component instance to test internal onChange method
      const mainInstance = new Main({
        classes: {},
        prompt: 'Prompt',
        rationale: 'Rationale',
        teacherInstructions: 'Teacher Instructions',
        disabled: false,
        choices: {
          0: [choice('cow', '0'), choice('cattle', '1'), choice('calf', '2')],
          1: [choice('over', '0'), choice('past', '1'), choice('beyond', '2')],
          2: [choice('moon', '0')],
        },
        markup: '<p>The {{0}} jumped {{1}} the {{2}}</p>',
        mode: 'gather',
        feedback: { 0: 'correct', 1: 'correct', 2: 'correct' },
        value: { 0: '1', 1: '0', 2: '0' },
        onChange,
      });

      mainInstance.onChange({ 0: '0', 1: '0', 2: '0' });

      // Fast-forward time to trigger debounced callback
      jest.advanceTimersByTime(400);

      expect(onChange).toHaveBeenCalledWith({ 0: '0', 1: '0', 2: '0' });

      jest.useRealTimers();
    });

    it('onChange when all responses have max length 1', () => {
      const mainInstance = new Main({
        classes: {},
        disabled: false,
        choices: {
          0: [choice('b', '0')],
          1: [choice('a', '0')],
          2: [choice('c', '0')],
        },
        maxLengthPerChoice: [1, 1, 1],
        markup: '<p>The {{0}} jumped {{1}} the {{2}}</p>',
        mode: 'gather',
        value: { 0: '1', 1: '0', 2: '0' },
        onChange,
      });

      mainInstance.onChange({ 0: 'a', 1: 'b', 2: 'c' });

      expect(onChange).toHaveBeenCalledWith({ 0: 'a', 1: 'b', 2: 'c' });
    });
  });
});
