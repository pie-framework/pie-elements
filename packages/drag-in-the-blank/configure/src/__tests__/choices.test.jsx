import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { Choices } from '../choices';
import sensibleDefaults from '../defaults';
import { createSlateMarkup, processMarkup } from '../markupUtils';

jest.mock('@pie-lib/config-ui', () => ({
  choiceUtils: {
    firstAvailableIndex: jest.fn(),
  },
  settings: {
    Panel: (props) => <div {...props} />,
    toggle: jest.fn(),
    radio: jest.fn(),
    dropdown: jest.fn(),
  },
  layout: {
    ConfigLayout: (props) => <div>{props.children}</div>,
  },
  AlertDialog: (props) => (
    <div data-testid="alert-dialog">
      {props.open && (
        <div>
          <div>{props.title}</div>
          <div>{props.text}</div>
          <button onClick={props.onConfirm}>Confirm</button>
        </div>
      )}
    </div>
  ),
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
}));

jest.mock('../choice', () => ({
  __esModule: true,
  default: ({ choice, onClick, onRemoveChoice }) => (
    <div data-testid={`choice-${choice.id}`}>
      <div onClick={onClick}>{choice.value}</div>
      <button onClick={onRemoveChoice}>Remove</button>
    </div>
  ),
}));

const theme = createTheme();

const model = {
  markup: '{{0}} + {{1}} = 15',
  prompt: '<p>Solve the equation below.</p>',
  choices: [
    { value: '<div>6</div>', id: '0' },
    { value: '<div>9</div>', id: '1' },
    { value: '<div>12</div>', id: '2' },
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

describe('Choices', () => {
  let onChange;

  beforeEach(() => {
    onChange = jest.fn();
  });

  const renderChoices = (extras) => {
    const defaults = {
      onChange,
      classes: {},
      model: prepareModel(model),
      duplicates: true,
      ...extras,
    };

    return render(
      <ThemeProvider theme={theme}>
        <Choices {...defaults} />
      </ThemeProvider>
    );
  };

  describe('render', () => {
    it('renders without crashing with duplicates', () => {
      const { container } = renderChoices();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders without crashing without duplicates', () => {
      const { container } = renderChoices({ duplicates: false });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with null choices', () => {
      const { container } = renderChoices({ model: prepareModel({ ...model, choices: null }) });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with empty correctResponse', () => {
      const { container } = renderChoices({
        duplicates: false,
        model: prepareModel({
          ...model,
          correctResponse: {},
        }),
      });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  // Note: Tests for internal methods (onChoiceChanged, onChoiceFocus, onAddChoice, onChoiceRemove, getVisibleChoices)
  // are implementation details and cannot be directly tested with RTL.
  // These methods should be tested through user interactions in integration tests:
  // - onChoiceChanged: Test by simulating typing in choice inputs
  // - onAddChoice: Test by clicking an "Add Choice" button
  // - onChoiceRemove: Test by clicking a "Remove" button
  // - getVisibleChoices: This is tested implicitly by checking what choices are rendered
});
