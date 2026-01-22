import * as React from 'react';
import { render } from '@testing-library/react';
import Configure, { Configure as ConfigureNotStyled } from '../configure';
import { InputContainer, InputCheckbox } from '@pie-lib/config-ui';
import Response from '../response';
import { MathToolbar } from '@pie-lib/math-toolbar';
import EditableHtml from '@pie-lib/editable-html-tip-tap';

import { FeedbackConfig, layout, settings } from '@pie-lib/config-ui';

import defaultValues from '../defaults';

jest.mock('@pie-lib/config-ui', () => ({
  InputContainer: (props) => <div data-testid="input-container">{props.children}</div>,
  InputCheckbox: (props) => <div data-testid="input-checkbox">{props.children}</div>,
  FeedbackConfig: (props) => <div data-testid="feedback-config">{props.children}</div>,
  layout: {
    ConfigLayout: (props) => <div data-testid="config-layout">{props.children}</div>,
  },
  settings: {
    Panel: (props) => <div data-testid="settings-panel" onChange={props.onChange} />,
    toggle: jest.fn(),
    radio: jest.fn(),
  },
}));

jest.mock('@pie-lib/math-toolbar', () => ({
  MathToolbar: (props) => <div data-testid="math-toolbar" {...props} />,
}));

jest.mock('@pie-framework/mathquill', () => ({
  StaticMath: jest.fn().mockReturnValue({
    latex: jest.fn(),
  }),
  registerEmbed: jest.fn(),
  getInterface: jest.fn().mockReturnThis(),
}));

jest.mock('@pie-lib/editable-html-tip-tap', () => (props) => <div data-testid="editable-html" {...props} />);

jest.mock('../response', () => (props) => <div data-testid="response" {...props} />);

const Mathquill = require('@pie-framework/mathquill');

const defaultProps = {
  model: {
    id: '1',
    promptEnabled: true,
    feedbackEnabled: true,
    element: 'math-inline',
    responseType: 'Advanced Multi',
    feedback: {
      correct: {
        default: 'Correct',
        type: 'none',
      },
      incorrect: {
        default: 'Incorrect',
        type: 'none',
      },
      partial: {
        default: 'Nearly',
        type: 'none',
      },
    },
    equationEditor: '3',
    expression: '{{response}} = {{response}} \\text{eggs}',
    question:
      '<p>Sam sells baskets of eggs at his farm stand. He sold 12 baskets and wrote the number sentence below to show how many eggs he sold in all.</p><p><span class="equation-block"><math xmlns="http://www.w3.org/1998/Math/MathML" >\n <mrow>\n  <mn>12</mn><mo>&#x00D7;</mo><mo>&#x25A1;</mo><mo>=</mo><mn>72</mn>\n </mrow>\n</math> </span></p><p>What <span class="relative-emphasis">division</span> number sentence can be used to show how many eggs were in each basket?</p><p>Use the on-screen keyboard to type your number sentence and answer in the box.</p>',
    response: {
      answer: '72\\div12=6\\text{eggs}',
      alternates: {
        1: '6=72\\div12\\text{eggs}',
        2: '\\frac{72}{12}=6\\text{eggs}',
        3: '6=\\frac{72}{12}\\text{eggs}',
      },
      validation: 'literal',
    },
    responses: [
      {
        id: '1',
        answer: '72\\div12=6\\text{eggs}',
        alternates: {
          1: '6=72\\div12\\text{eggs}',
          2: '\\frac{72}{12}=6\\text{eggs}',
          3: '6=\\frac{72}{12}\\text{eggs}',
        },
        validation: 'literal',
      },
    ],
    note: 'The answer shown above is the primary correct answer specified by the author for this item, but other answers may also be recognized as correct.',
    customKeys: ['\\left(\\right)', '\\frac{}{}', 'x\\frac{}{}'],
    configure: defaultValues.configure,
  },
  configuration: defaultValues.configuration,
};

describe('Configure', () => {
  it('changeTeacherInstructions calls onModelChange', () => {
    const onModelChanged = jest.fn();
    const { container } = render(
      <ConfigureNotStyled onModelChanged={onModelChanged} classes={{}} {...defaultValues} />,
    );

    const instance = new ConfigureNotStyled({ onModelChanged, classes: {}, ...defaultValues });
    instance.changeTeacherInstructions('Teacher Instructions');

    expect(onModelChanged).toBeCalledWith(
      expect.objectContaining({
        teacherInstructions: 'Teacher Instructions',
      }),
    );
  });
});

describe('GeneralConfigBlock', () => {
  // Unmock GeneralConfigBlock for these tests
  const GeneralConfigBlock = require('../general-config-block').default;

  let props;

  beforeEach(() => {
    props = {
      model: defaultProps.model,
      promptEnabled: true,
      configuration: defaultValues.configuration,
      onChange: jest.fn(),
      imageSupport: {},
      uploadSoundSupport: {},
    };
  });

  const wrapper = (extraProps = {}) => {
    return render(<GeneralConfigBlock {...props} {...extraProps} />);
  };

  const createInstance = (extraProps = {}) => {
    const instanceProps = {
      ...props,
      ...extraProps,
    };
    const instance = new GeneralConfigBlock(instanceProps);
    instance.setState = jest.fn((state) => {
      Object.assign(instance.state, typeof state === 'function' ? state(instance.state) : state);
    });
    return instance;
  };

  it('renders correctly', () => {
    const { container } = wrapper();

    expect(container.querySelector('[data-testid="input-container"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="response"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="math-toolbar"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="editable-html"]')).toBeInTheDocument();
    expect(Mathquill.getInterface().registerEmbed).toHaveBeenCalled();
  });

  it('renders correctly for Simple mode', () => {
    const { container } = wrapper({ model: { ...props.model, responseType: 'Simple' } });

    expect(container.querySelector('[data-testid="input-container"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="response"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="editable-html"]')).toBeInTheDocument();
  });

  it('renders correctly with snapshot', () => {
    const { container } = wrapper();

    // // expect(container).toMatchSnapshot();
  });

  it('updates advanced model correctly', () => {
    const onChange = jest.fn();
    const instance = createInstance({ onChange });

    instance.onResponseChange({ answer: 'something', id: 'r1' }, 0);

    expect(onChange).toBeCalledWith({
      ...props.model,
      responses: [
        {
          id: 'r1',
          answer: 'something',
        },
      ],
    });
  });

  it('builds out internal state correctly based on expression provided', () => {
    const instance = createInstance();

    expect(instance.state).toEqual({
      showKeypad: false,
      responseIdCounter: 2,
      responseAreas: {
        r1: {
          value: '',
        },
        r2: {
          value: '',
        },
      },
    });

    const instanceWithMoreResponses = createInstance({
      model: {
        ...props.model,
        expression: props.model.expression + ' {{response}} ',
      },
    });

    expect(instanceWithMoreResponses.state).toEqual({
      showKeypad: false,
      responseIdCounter: 3,
      responseAreas: {
        r1: {
          value: '',
        },
        r2: {
          value: '',
        },
        r3: {
          value: '',
        },
      },
    });
  });
});
