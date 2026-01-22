import * as React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Configure } from '../configure';
import defaultValues from '../defaults';

jest.mock('@pie-lib/config-ui', () => ({
  InputContainer: (props) => <div>{props.children}</div>,
  InputCheckbox: (props) => <div>{props.children}</div>,
  FeedbackConfig: (props) => <div>{props.children}</div>,
  layout: {
    ConfigLayout: (props) => <div>{props.children}</div>,
  },
  settings: {
    Panel: (props) => <div onChange={props.onChange} />,
    toggle: jest.fn(),
    radio: jest.fn(),
    numberFields: jest.fn(),
    checkboxes: jest.fn(),
    textField: jest.fn(),
  },
}));

jest.mock('@pie-lib/graphing-solution-set', () => ({
  GraphContainer: (props) => <div>{props.children}</div>,
  tools: {
    polygon: () => ({
      Component: () => <div />,
      type: 'polygon',
    }),
    line: () => ({
      Component: () => <div />,
      type: 'line',
    }),
  },
}));

jest.mock('../graphing-config', () => ({
  __esModule: true,
  default: (props) => <div data-testid="graphing-config" {...props} />,
}));

jest.mock('../correct-response', () => ({
  __esModule: true,
  default: (props) => <div data-testid="correct-response" {...props} />,
}));

jest.mock('@pie-lib/editable-html', () => ({
  __esModule: true,
  default: (props) => <div data-testid="editable-html" {...props} />,
}));

const theme = createTheme();

describe('Configure', () => {
  const renderConfigure = (props = {}) => {
    const configureProps = { ...defaultValues, ...props };

    return render(
      <ThemeProvider theme={theme}>
        <Configure {...configureProps} />
      </ThemeProvider>
    );
  };

  describe('logic', () => {
    it('updates rationale', () => {
      const onModelChanged = jest.fn();
      const testInstance = new Configure({ ...defaultValues, onModelChanged });

      testInstance.onRationaleChange('New Rationale');

      expect(onModelChanged).toBeCalledWith(
        expect.objectContaining({
          ...defaultValues.model,
          rationale: 'New Rationale',
        }),
      );
    });

    it('updates prompt', () => {
      const onModelChanged = jest.fn();
      const testInstance = new Configure({ ...defaultValues, onModelChanged });

      testInstance.onPromptChange('New Prompt');

      expect(onModelChanged).toBeCalledWith(
        expect.objectContaining({
          ...defaultValues.model,
          prompt: 'New Prompt',
        }),
      );
    });

    it('updates teacher instructions', () => {
      const onModelChanged = jest.fn();
      const testInstance = new Configure({ ...defaultValues, onModelChanged });

      testInstance.onTeacherInstructionsChange('New Teacher Instructions');

      expect(onModelChanged).toBeCalledWith(
        expect.objectContaining({
          ...defaultValues.model,
          teacherInstructions: 'New Teacher Instructions',
        }),
      );
    });
  });
});
