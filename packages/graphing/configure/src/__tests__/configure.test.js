import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Configure } from '../configure';
import defaultValues from '../defaults';

jest.mock('@pie-lib/config-ui', () => ({
  InputContainer: ({ label, children }) => (
    <div data-testid="input-container" aria-label={label}>
      {label && <label>{label}</label>}
      {children}
    </div>
  ),
  InputCheckbox: (props) => <div>{props.children}</div>,
  FeedbackConfig: (props) => <div>{props.children}</div>,
  layout: {
    ConfigLayout: ({ children, settings, hideSettings }) => (
      <div data-testid="config-layout">
        {!hideSettings && <div data-testid="settings-panel">{settings}</div>}
        <div data-testid="config-content">{children}</div>
      </div>
    ),
  },
  settings: {
    Panel: ({ model, groups, onChangeModel }) => (
      <div data-testid="panel" onClick={() => onChangeModel && onChangeModel(model)}>
        Panel
      </div>
    ),
    toggle: jest.fn(() => 'toggle'),
    radio: jest.fn(() => 'radio'),
    numberFields: jest.fn(() => 'numberFields'),
    checkboxes: jest.fn(() => 'checkboxes'),
    textField: jest.fn(() => 'textField'),
    dropdown: jest.fn(() => 'dropdown'),
  },
}));

jest.mock('@pie-lib/graphing', () => ({
  GraphContainer: (props) => <div>{props.children}</div>,
  tools: {
    point: () => ({
      Component: () => <div />,
      type: 'point',
    }),
    circle: () => ({
      Component: () => <div />,
      type: 'circle',
    }),
    polygon: () => ({
      Component: () => <div />,
      type: 'polygon',
    }),
    segment: () => ({
      Component: () => <div />,
      type: 'segment',
    }),
    vector: () => ({
      Component: () => <div />,
      type: 'vector',
    }),
    ray: () => ({
      Component: () => <div />,
      type: 'ray',
    }),
    line: () => ({
      Component: () => <div />,
      type: 'line',
    }),
    sine: () => ({
      Component: () => <div />,
      type: 'sine',
    }),
    parabola: () => ({
      Component: () => <div />,
      type: 'parabola',
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
  default: ({ markup, onChange, error }) => (
    <div data-testid="editable-html">
      <textarea
        data-testid="editable-html-input"
        value={markup || ''}
        onChange={(e) => onChange && onChange(e.target.value)}
      />
      {error && <div data-testid="editable-html-error">{error}</div>}
    </div>
  ),
}));

const theme = createTheme();

describe('Configure', () => {
  let mockOnModelChanged;
  let mockOnConfigurationChanged;

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnModelChanged = jest.fn();
    mockOnConfigurationChanged = jest.fn();
  });

  const renderConfigure = (props = {}) => {
    const defaultProps = {
      ...defaultValues,
      onModelChanged: mockOnModelChanged,
      onConfigurationChanged: mockOnConfigurationChanged,
      ...props,
    };

    return render(
      <ThemeProvider theme={theme}>
        <Configure {...defaultProps} />
      </ThemeProvider>
    );
  };

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderConfigure();
      expect(container).toBeInTheDocument();
    });

    it('renders config layout', () => {
      renderConfigure();
      expect(screen.getByTestId('config-layout')).toBeInTheDocument();
    });

    it('renders settings panel when not disabled', () => {
      renderConfigure({
        configuration: { ...defaultValues.configuration, settingsPanelDisabled: false },
      });
      expect(screen.getByTestId('settings-panel')).toBeInTheDocument();
    });

    it('does not render settings panel when disabled', () => {
      renderConfigure({
        configuration: { ...defaultValues.configuration, settingsPanelDisabled: true },
      });
      expect(screen.queryByTestId('settings-panel')).not.toBeInTheDocument();
    });

    it('renders GraphingConfig component', () => {
      renderConfigure();
      expect(screen.getByTestId('graphing-config')).toBeInTheDocument();
    });

    it('renders CorrectResponse component', () => {
      renderConfigure();
      expect(screen.getByTestId('correct-response')).toBeInTheDocument();
    });
  });

  describe('teacher instructions', () => {
    it('does not render teacher instructions when disabled', () => {
      renderConfigure({
        model: { ...defaultValues.model, teacherInstructionsEnabled: false },
        configuration: {
          ...defaultValues.configuration,
          teacherInstructions: { label: 'Teacher Instructions' },
        },
      });
      // Check that teacher instructions input container is not rendered
      const containers = screen.queryAllByTestId('input-container');
      const hasTeacherInstructions = Array.from(containers).some(
        (container) => container.getAttribute('aria-label') === 'Teacher Instructions'
      );
      expect(hasTeacherInstructions).toBe(false);
    });

    it('renders teacher instructions when enabled', () => {
      renderConfigure({
        model: {
          ...defaultValues.model,
          teacherInstructionsEnabled: true,
          teacherInstructions: 'Test teacher instructions',
        },
      });
      const inputs = screen.getAllByTestId('editable-html-input');
      const teacherInstructionsInput = inputs.find((input) => input.value === 'Test teacher instructions');
      expect(teacherInstructionsInput).toBeInTheDocument();
    });

    it('calls onTeacherInstructionsChange when teacher instructions change', () => {
      renderConfigure({
        model: {
          ...defaultValues.model,
          teacherInstructionsEnabled: true,
          teacherInstructions: 'Old instructions',
        },
      });
      const inputs = screen.getAllByTestId('editable-html-input');
      const teacherInstructionsInput = inputs.find((input) => input.value === 'Old instructions');
      
      fireEvent.change(teacherInstructionsInput, { target: { value: 'New instructions' } });
      
      expect(mockOnModelChanged).toHaveBeenCalledWith(
        expect.objectContaining({
          teacherInstructions: 'New instructions',
        })
      );
    });

    it('displays teacher instructions error when present', () => {
      const { container } = renderConfigure({
        model: {
          ...defaultValues.model,
          teacherInstructionsEnabled: true,
          errors: { teacherInstructions: 'Teacher instructions error' },
        },
      });
      const errorElements = container.querySelectorAll('[data-testid="editable-html-error"]');
      const hasTeacherInstructionsError = Array.from(errorElements).some(
        (el) => el.textContent === 'Teacher instructions error'
      );
      expect(hasTeacherInstructionsError).toBe(true);
    });
  });

  describe('prompt', () => {
    it('does not render prompt when disabled', () => {
      renderConfigure({
        model: { ...defaultValues.model, promptEnabled: false },
        configuration: {
          ...defaultValues.configuration,
          prompt: { label: 'Prompt' },
        },
      });

      const containers = screen.queryAllByTestId('input-container');
      const hasPrompt = Array.from(containers).some(
        (container) => container.getAttribute('aria-label') === 'Prompt'
      );
      expect(hasPrompt).toBe(false);
    });

    it('renders prompt when enabled', () => {
      renderConfigure({
        model: {
          ...defaultValues.model,
          promptEnabled: true,
          prompt: 'Test prompt',
        },
      });
      const inputs = screen.getAllByTestId('editable-html-input');
      const promptInput = inputs.find((input) => input.value === 'Test prompt');
      expect(promptInput).toBeInTheDocument();
    });

    it('calls onPromptChange when prompt changes', () => {
      renderConfigure({
        model: {
          ...defaultValues.model,
          promptEnabled: true,
          prompt: 'Old prompt',
        },
      });
      const inputs = screen.getAllByTestId('editable-html-input');
      const promptInput = inputs.find((input) => input.value === 'Old prompt');
      
      fireEvent.change(promptInput, { target: { value: 'New prompt' } });
      
      expect(mockOnModelChanged).toHaveBeenCalledWith(
        expect.objectContaining({
          prompt: 'New prompt',
        })
      );
    });

    it('displays prompt error when present', () => {
      const { container } = renderConfigure({
        model: {
          ...defaultValues.model,
          promptEnabled: true,
          errors: { prompt: 'Prompt error message' },
        },
      });
      const errorElements = container.querySelectorAll('[data-testid="editable-html-error"]');
      const hasPromptError = Array.from(errorElements).some(
        (el) => el.textContent === 'Prompt error message'
      );
      expect(hasPromptError).toBe(true);
    });
  });

  describe('rationale', () => {
    it('does not render rationale when disabled', () => {
      renderConfigure({
        model: { ...defaultValues.model, rationaleEnabled: false },
      });
      const labels = screen.queryAllByText(/rationale/i);
      expect(labels.length).toBe(0);
    });

    it('renders rationale when enabled', () => {
      renderConfigure({
        model: {
          ...defaultValues.model,
          rationaleEnabled: true,
          rationale: 'Test rationale',
        },
      });
      const inputs = screen.getAllByTestId('editable-html-input');
      const rationaleInput = inputs.find((input) => input.value === 'Test rationale');
      expect(rationaleInput).toBeInTheDocument();
    });

    it('calls onRationaleChange when rationale changes', () => {
      renderConfigure({
        model: {
          ...defaultValues.model,
          rationaleEnabled: true,
          rationale: 'Old rationale',
        },
      });
      const inputs = screen.getAllByTestId('editable-html-input');
      const rationaleInput = inputs.find((input) => input.value === 'Old rationale');
      
      fireEvent.change(rationaleInput, { target: { value: 'New rationale' } });
      
      expect(mockOnModelChanged).toHaveBeenCalledWith(
        expect.objectContaining({
          rationale: 'New rationale',
        })
      );
    });

    it('displays rationale error when present', () => {
      const { container } = renderConfigure({
        model: {
          ...defaultValues.model,
          rationaleEnabled: true,
          errors: { rationale: 'Rationale error message' },
        },
      });
      const errorElements = container.querySelectorAll('[data-testid="editable-html-error"]');
      const hasRationaleError = Array.from(errorElements).some(
        (el) => el.textContent === 'Rationale error message'
      );
      expect(hasRationaleError).toBe(true);
    });
  });

  describe('componentDidMount', () => {
    it('converts boolean arrows to object format', () => {
      const onModelChanged = jest.fn();
      const model = {
        ...defaultValues.model,
        arrows: true,
      };

      renderConfigure({ model, onModelChanged });

      expect(onModelChanged).toHaveBeenCalledWith(
        expect.objectContaining({
          arrows: { left: true, right: true, up: true, down: true },
        })
      );
    });

    it('converts false arrows to object format with all false values', () => {
      const onModelChanged = jest.fn();
      const model = {
        ...defaultValues.model,
        arrows: false,
      };

      renderConfigure({ model, onModelChanged });

      expect(onModelChanged).toHaveBeenCalledWith(
        expect.objectContaining({
          arrows: { left: false, right: false, up: false, down: false },
        })
      );
    });

    it('handles toolbar tools intersection with available tools', () => {
      const onModelChanged = jest.fn();
      const model = {
        ...defaultValues.model,
        toolbarTools: ['point', 'line', 'circle', 'invalid-tool'],
      };
      const configuration = {
        ...defaultValues.configuration,
        availableTools: ['point', 'line', 'segment'],
      };

      renderConfigure({ model, configuration, onModelChanged });

      expect(onModelChanged).toHaveBeenCalledWith(
        expect.objectContaining({
          toolbarTools: ['point', 'line'],
        })
      );
    });

    it('sets titleEnabled from configuration when model value is undefined', () => {
      const onModelChanged = jest.fn();
      const model = {
        ...defaultValues.model,
        titleEnabled: undefined,
      };
      const configuration = {
        ...defaultValues.configuration,
        title: { enabled: true },
      };

      renderConfigure({ model, configuration, onModelChanged });

      expect(onModelChanged).toHaveBeenCalledWith(
        expect.objectContaining({
          titleEnabled: true,
        })
      );
    });

    it('sets dimensionsEnabled from configuration when model value is undefined', () => {
      const onModelChanged = jest.fn();
      const model = {
        ...defaultValues.model,
        dimensionsEnabled: undefined,
      };
      const configuration = {
        ...defaultValues.configuration,
        graphDimensions: { enabled: false },
      };

      renderConfigure({ model, configuration, onModelChanged });

      expect(onModelChanged).toHaveBeenCalledWith(
        expect.objectContaining({
          dimensionsEnabled: false,
        })
      );
    });
  });

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
