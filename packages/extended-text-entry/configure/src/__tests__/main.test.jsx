import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { Main } from '../main';
import defaults from '../defaults';

jest.mock('@pie-lib/config-ui', () => ({
  layout: {
    ConfigLayout: (props) => <div data-testid="config-layout">{props.children}</div>,
  },
  settings: {
    Panel: (props) => <div data-testid="settings-panel" onChange={props.onChange} />,
    toggle: jest.fn(),
    radio: jest.fn(),
    numberFields: jest.fn(),
    dropdown: jest.fn(),
  },
  InputContainer: (props) => <div data-testid="input-container">{props.children}</div>,
  FeedbackSelector: (props) => <div data-testid="feedback-selector" />,
}));

jest.mock('@pie-lib/editable-html-tip-tap', () => ({
  __esModule: true,
  default: ({ markup, onChange }) => (
    <div data-testid="editable-html" onClick={() => onChange && onChange('new value')}>
      {markup}
    </div>
  ),
  ALL_PLUGINS: [],
}));

const theme = createTheme();

describe('Render Main Component', () => {
  let onChange;
  let model = defaults.model;
  let configuration = defaults.configuration;

  beforeEach(() => {
    onChange = jest.fn();
  });

  const renderMain = (extras = {}) => {
    const defaults = {
      classes: {},
      model,
      configuration,
      onModelChanged: onChange,
      handleBoxResize: () => {},
      imageSupport: {},
      uploadSoundSupport: {},
      ...extras
    };
    const props = { ...defaults };

    return render(
      <ThemeProvider theme={theme}>
        <Main {...props} />
      </ThemeProvider>
    );
  };

  describe('logic', () => {
    it('onPromptChange calls onModelChanged', () => {
      const testInstance = new Main({
        classes: {},
        model,
        configuration,
        onModelChanged: onChange,
        handleBoxResize: () => {},
        imageSupport: {},
        uploadSoundSupport: {},
      });

      testInstance.onPromptChange('New Prompt');
      expect(onChange).toBeCalledWith(expect.objectContaining({ prompt: 'New Prompt' }));
    });

    it('changeFeedback calls onModelChanged', () => {
      const testInstance = new Main({
        classes: {},
        model,
        configuration,
        onModelChanged: onChange,
        handleBoxResize: () => {},
        imageSupport: {},
        uploadSoundSupport: {},
      });

      testInstance.changeFeedback({ type: 'custom', default: 'Default Feedback' });
      expect(onChange).toBeCalledWith(
        expect.objectContaining({ feedback: { type: 'custom', default: 'Default Feedback' } }),
      );
    });

    it('changeTeacherInstructions calls onModelChanged', () => {
      const testInstance = new Main({
        classes: {},
        model,
        configuration,
        onModelChanged: onChange,
        handleBoxResize: () => {},
        imageSupport: {},
        uploadSoundSupport: {},
      });

      testInstance.changeTeacherInstructions('Teacher Instructions');
      expect(onChange).toBeCalledWith(expect.objectContaining({ teacherInstructions: 'Teacher Instructions' }));
    });
  });
});
