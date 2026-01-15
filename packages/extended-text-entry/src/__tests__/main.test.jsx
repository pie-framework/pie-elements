import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { Main } from '../main';

jest.mock('@pie-lib/render-ui', () => ({
  PreviewPrompt: ({ prompt }) => <div data-testid="preview-prompt">{prompt}</div>,
  Collapsible: ({ children }) => <div data-testid="collapsible">{children}</div>,
  UiLayout: ({ children }) => <div data-testid="ui-layout">{children}</div>,
  Feedback: ({ feedback }) => <div data-testid="feedback">{feedback}</div>,
  hasText: jest.fn(() => true),
  hasMedia: jest.fn(() => false),
  color: {
    text: () => '#000',
    background: () => '#fff',
  },
}));

jest.mock('@pie-lib/editable-html', () => ({
  __esModule: true,
  default: ({ markup, onChange }) => (
    <div data-testid="editable-html" onClick={() => onChange && onChange('new value')}>
      {markup}
    </div>
  ),
}));

jest.mock('../annotation/annotation-editor', () => ({
  __esModule: true,
  default: (props) => <div data-testid="annotation-editor" {...props} />,
}));

const theme = createTheme();

describe('Render Main Component', () => {
  let model = { dimensions: { width: 100, height: 50 } };

  const renderMain = (extras = {}) => {
    const defaults = {
      model,
      session: {
        value: 'hi',
        annotations: [],
        comment: 'hello'
      },
      onValueChange: () => {},
      onAnnotationsChange: () => {},
      onCommentChange: () => {},
      classes: {},
      ...extras
    };

    return render(
      <ThemeProvider theme={theme}>
        <Main {...defaults} />
      </ThemeProvider>
    );
  };

  it('should match snapshot', () => {
    const { container } = renderMain();
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with teacher instructions', () => {
    const { container } = renderMain({
      model: { ...model, teacherInstructions: 'Teacher Instructions' }
    });
    expect(container).toMatchSnapshot();
  });
});
