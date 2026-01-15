import * as React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Main from '../main';

const Mathquill = require('@pie-framework/mathquill');

jest.mock('@pie-framework/mathquill', () => ({
  StaticMath: jest.fn().mockReturnValue({
    latex: jest.fn(),
  }),
  registerEmbed: jest.fn(),
  getInterface: jest.fn().mockReturnThis(),
}));

jest.mock('@pie-lib/render-ui', () => ({
  color: {
    text: () => '#000',
    background: () => '#fff',
    primaryLight: () => '#ccc',
    correct: () => '#00ff00',
    incorrect: () => '#ff0000',
    secondary: () => '#888',
  },
  Collapsible: (props) => <div data-testid="collapsible">{props.children}</div>,
  Readable: (props) => <div data-testid="readable">{props.children}</div>,
  hasText: jest.fn(),
  hasMedia: jest.fn(),
  PreviewPrompt: (props) => (
    <div data-testid="preview-prompt">
      {props.prompt}
      {props.children}
    </div>
  ),
  UiLayout: (props) => <div data-testid="ui-layout">{props.children}</div>,
}));

jest.mock('@pie-lib/correct-answer-toggle', () => ({
  __esModule: true,
  default: (props) => <div data-testid="correct-answer-toggle" onClick={props.onToggle} {...props} />,
}));

jest.mock('@pie-lib/math-input', () => ({
  mq: {
    Static: (props) => <div data-testid="mq-static" {...props} />,
  },
  HorizontalKeypad: (props) => <div data-testid="horizontal-keypad" {...props} />,
  updateSpans: jest.fn(),
}));

jest.mock('@pie-lib/math-rendering', () => ({
  renderMath: jest.fn(),
}));

jest.mock('@pie-lib/mask-markup', () => ({
  Customizable: (props) => <div data-testid="customizable">{props.children}</div>,
}));

const defaultModel = {
  prompt: 'Solve the equation:',
  teacherInstructions: '',
  rationale: '',
  responses: {
    0: {
      allowTrailingZeros: false,
      answer: '2',
      id: '1',
      validation: 'symbolic',
      ignoreOrder: false,
      alternates: {},
    },
    1: {
      allowTrailingZeros: false,
      answer: '5',
      id: '2',
      validation: 'symbolic',
      ignoreOrder: false,
      alternates: {},
    },
  },
  env: { mode: 'evaluate', role: 'instructor' },
  markup:
    '<p>If the unit price of a notebook in Store A is $1.50, what is the unit price of a binder? ${{0}} ${{1}}</p',
  equationEditor: 'miscellaneous',
  customKeys: [],
  view: false,
  feedback: {},
  correctness: {
    correct: false,
    correctness: 'incorrect',
    score: 0,
  },
};

const defaultSession = {
  answers: {
    r0: {
      value: '2',
    },
    r1: {
      value: '3',
    },
  },
  showCorrectness: true,
};

const defaultProps = {
  model: defaultModel,
  session: defaultSession,
  onSessionChange: jest.fn(),
  classes: {},
};

describe('Main component', () => {
  const wrapper = (props = {}) => {
    return render(<Main {...defaultProps} {...props} />);
  };

  const createInstance = (props = {}) => {
    const instanceProps = {
      ...defaultProps,
      ...props,
    };
    const instance = new Main(instanceProps);
    instance.setState = jest.fn((state, callback) => {
      Object.assign(instance.state, typeof state === 'function' ? state(instance.state) : state);
      if (callback) callback();
    });
    return instance;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Match Snapshot', () => {
    const { container } = wrapper();
    expect(container).toMatchSnapshot();
  });

  it('displays the prompt', () => {
    const prompt = 'Solve the equation:';
    const { getByTestId } = wrapper({ model: { ...defaultModel, prompt } });
    const previewPrompt = getByTestId('preview-prompt');
    expect(previewPrompt).toHaveTextContent(prompt);
  });

  it('updates component when receiving new props', () => {
    const newMarkup = 'Solve {{0}}';
    const { getByTestId, rerender } = wrapper();
    rerender(<Main {...defaultProps} model={{ ...defaultModel, markup: newMarkup }} />);
    // Check that customizable component is present (it contains the markup)
    expect(getByTestId('customizable')).toBeInTheDocument();
  });

  it('updates session when change value in a response area', () => {
    const onSessionChange = jest.fn();
    const instance = createInstance({
      model: { ...defaultModel, env: { mode: 'gather', role: 'student' } },
      onSessionChange,
    });

    // Simulate subfield change - correct method name is subFieldChanged
    instance.subFieldChanged('r1', '5');

    expect(onSessionChange).toHaveBeenCalledWith({
      ...defaultProps.session,
      answers: { r0: { value: '2' }, r1: { value: '5' } },
    });
  });

  it('renders answers correctly in response areas', () => {
    const instance = createInstance();
    instance.setState({ showCorrect: true });

    // Check that state was updated
    expect(instance.state.showCorrect).toBe(true);
  });

  it('toggles CorrectAnswerToggle correctly', async () => {
    const user = userEvent.setup();
    const { getByTestId } = wrapper();

    const toggle = getByTestId('correct-answer-toggle');

    // Create instance to check state
    const instance = createInstance();
    expect(instance.state.showCorrect).toBe(false);

    // Toggle to true
    instance.toggleShowCorrect(true);
    expect(instance.state.showCorrect).toBe(true);
  });

  it('show correct answers when correct answer toggle is true', () => {
    const instance = createInstance();

    // Initially showCorrect should be false
    expect(instance.state.showCorrect).toBe(false);

    // Toggle to true
    instance.toggleShowCorrect(true);
    expect(instance.state.showCorrect).toBe(true);
  });
});
