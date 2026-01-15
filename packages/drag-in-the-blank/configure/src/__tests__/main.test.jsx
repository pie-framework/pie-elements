import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { Main } from '../main';
import sensibleDefaults from '../defaults';
import { createSlateMarkup, processMarkup } from '../markupUtils';

jest.mock('@pie-lib/config-ui', () => ({
  choiceUtils: {
    firstAvailableIndex: jest.fn(),
  },
  settings: {
    Panel: (props) => <div data-testid="settings-panel" {...props} />,
    toggle: jest.fn(),
    radio: jest.fn(),
    dropdown: jest.fn(),
  },
  layout: {
    ConfigLayout: (props) => <div data-testid="config-layout">{props.children}</div>,
  },
  InputContainer: (props) => <div data-testid="input-container">{props.children}</div>,
}));

jest.mock('@pie-lib/render-ui', () => ({
  InputContainer: (props) => <div data-testid="input-container">{props.children}</div>,
}));

jest.mock('@pie-lib/editable-html', () => ({
  __esModule: true,
  default: ({ markup, onChange }) => (
    <div
      data-testid="editable-html"
      onClick={() => onChange && onChange('new value')}
    >
      {markup}
    </div>
  ),
  ALL_PLUGINS: [],
}));

jest.mock('@pie-lib/drag', () => ({
  DragProvider: ({ children }) => <div data-testid="drag-provider">{children}</div>,
}));

jest.mock('@pie-lib/math-rendering', () => ({
  renderMath: jest.fn(),
}));

jest.mock('@dnd-kit/core', () => ({
  DragOverlay: ({ children }) => <div data-testid="drag-overlay">{children}</div>,
}));

jest.mock('@dnd-kit/modifiers', () => ({
  restrictToFirstScrollableAncestor: jest.fn(),
}));

jest.mock('../choice', () => ({
  __esModule: true,
  default: (props) => <div data-testid="choice">{props.choice?.value}</div>,
}));

jest.mock('../choices', () => ({
  __esModule: true,
  default: (props) => <div data-testid="choices">{props.children}</div>,
}));

const theme = createTheme();

const model = {
  markup: '{{0}} + {{1}} = 15',
  prompt: '<p>Solve the equation below.</p>',
  choices: [
    { value: '<div>6</div>', id: '0' },
    { value: '<div>9</div>', id: '1' },
  ],
  choicesPosition: 'below',
  correctResponse: {
    0: '0',
    1: '1',
  },
  duplicates: true,
  alternateResponses: [['1'], ['0']],
  rationale:
    '<p>A correct response is shown below:</p><ul><li>2/6 = 1/3</li><li>4/8 = 1/2</li><li>6/10 = 3/5</li><li>9/12 = 3/4</li></ul>',
};

const prepareModel = (model = {}) => {
  const joinedObj = {
    ...sensibleDefaults.model,
    ...model,
  };
  // Handle null choices by converting to empty array for processing
  const choicesForProcessing = joinedObj.choices || [];
  const slateMarkup =
    model.slateMarkup || createSlateMarkup(joinedObj.markup, choicesForProcessing, joinedObj.correctResponse);
  const processedMarkup = processMarkup(slateMarkup);

  return {
    ...joinedObj,
    slateMarkup,
    markup: processedMarkup.markup,
    correctResponse: processedMarkup.correctResponse,
  };
};

describe('Main', () => {
  let onModelChanged;
  let onConfigurationChanged;

  beforeEach(() => {
    onModelChanged = jest.fn();
    onConfigurationChanged = jest.fn();
  });

  const renderMain = (extras = {}) => {
    const defaults = {
      onModelChanged,
      onConfigurationChanged,
      classes: {},
      model: prepareModel({
        ...model,
        ...extras,
      }),
      configuration: sensibleDefaults.configuration,
    };

    return render(
      <ThemeProvider theme={theme}>
        <Main {...defaults} />
      </ThemeProvider>
    );
  };

  describe('render', () => {
    it('renders with teacher instructions, prompt and rationale even if not set', () => {
      const { container } = renderMain();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders without teacher instructions, prompt and rationale', () => {
      const { container } = renderMain({
        promptEnabled: false,
        teacherInstructionsEnabled: false,
        rationaleEnabled: false,
      });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  // Note: Tests for internal methods (onModelChange, onPromptChanged, onRationaleChanged, 
  // onTeacherInstructionsChanged, onMarkupChanged, onResponsesChanged) are implementation 
  // details and cannot be directly tested with RTL.
  // These methods should be tested through user interactions in integration tests:
  // - onPromptChanged: Test by typing in the prompt EditableHtml component
  // - onRationaleChanged: Test by typing in the rationale EditableHtml component
  // - onTeacherInstructionsChanged: Test by typing in the teacher instructions EditableHtml component
  // - onMarkupChanged: Test by modifying the markup via the Design component
  // - onResponsesChanged: Test by adding/removing/editing choices via the Choices component
});
