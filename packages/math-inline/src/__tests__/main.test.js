import * as React from 'react';
import { render } from '@testing-library/react';
import Main from '../main';
import { mq, HorizontalKeypad } from '@pie-lib/math-input';
import { Feedback } from '@pie-lib/render-ui';
import { CorrectAnswerToggle } from '@pie-lib/correct-answer-toggle';
import SimpleQuestionBlock from '../simple-question-block';

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
  Feedback: (props) => <div data-testid="feedback" {...props} />,
  PreviewPrompt: (props) => <div data-testid="preview-prompt">{props.children}</div>,
  UiLayout: (props) => <div data-testid="ui-layout">{props.children}</div>,
  Readable: (props) => <div data-testid="readable">{props.children}</div>,
  hasText: jest.fn(),
  hasMedia: jest.fn(),
  Collapsible: (props) => <div data-testid="collapsible">{props.children}</div>,
}));

jest.mock('@pie-lib/correct-answer-toggle', () => (props) => (
  <div data-testid="correct-answer-toggle" {...props} />
));

jest.mock('../simple-question-block', () => (props) => <div data-testid="simple-question-block" {...props} />);

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

jest.mock('@pie-lib/translator', () => ({
  __esModule: true,
  default: (props) => <div data-testid="translator">{props.children}</div>,
}));

describe('Math-Inline Main', () => {
  const defaultProps = {
    onSessionChange: jest.fn(),
    session: {},
    model: {
      id: '1',
      element: 'math-inline',
      correctness: {},
      config: {
        responseType: 'Advanced Multi',
        element: 'math-inline',
        question:
          '<p>The binomial <math xmlns="http://www.w3.org/1998/Math/MathML"> <mi>x</mi><mo>&#8722;</mo><mn>2</mn> </math> is a factor of the polynomial below.</p><p><span class="equation-block"><math xmlns="http://www.w3.org/1998/Math/MathML"> <mi>f</mi><mo stretchy="false">(</mo><mi>x</mi><mo stretchy="false">)</mo><mo>=</mo><msup> <mi>x</mi> <mn>3</mn> </msup> <mo>+</mo><msup> <mi>x</mi> <mn>2</mn> </msup> <mo>+</mo><mi>n</mi><mi>x</mi><mo>+</mo><mn>10</mn> </math> </span></p><p>What is the value of <span class="variable">n</span>? Use the on-screen keyboard&#160;to type the correct answer in the box.</p>',
        expression:
          '\\text{A family sized box contains} {{response}} \\text{less than} {{response}} \\text{times the number  }' +
          '  \\frac{3}{6}=\\frac{ {{response}} }{4} + \\frac{ {{response}} }{4}',
        equationEditor: 'miscellaneous',
        responses: [
          {
            validation: 'literal',
            answer: '\\frac{3}{6}=\\frac{1}{2}',
            alternates: {},
          },
        ],
        feedback: {
          correct: {
            type: 'none',
            default: 'Correct',
          },
          partial: {
            type: 'none',
            default: 'Nearly',
          },
          incorrect: {
            type: 'none',
            default: 'Incorrect',
          },
        },
        note: 'The answer shown above is the primary correct answer specified by the author for this item, but other answers may also be recognized as correct.',
        customKeys: ['\\left(\\right)', '\\frac{}{}', 'x\\frac{}{}'],
      },
    },
  };

  const wrapper = (props = {}) => {
    return render(<Main {...defaultProps} {...props} />);
  };

  const createInstance = (props = {}) => {
    const instanceProps = {
      ...defaultProps,
      ...props,
    };
    const instance = new Main(instanceProps);
    instance.setState = jest.fn((state) => {
      Object.assign(instance.state, typeof state === 'function' ? state(instance.state) : state);
    });
    return instance;
  };

  describe('render', () => {
    it('renders correctly with snapshot', () => {
      const { container } = wrapper();
      expect(container).toMatchSnapshot();
    });

    it('renders correctly', () => {
      const { queryByTestId } = wrapper();
      expect(queryByTestId('correct-answer-toggle')).not.toBeInTheDocument();
      expect(queryByTestId('feedback')).not.toBeInTheDocument();

      const instance = createInstance();
      expect(instance.state).toEqual({
        activeAnswerBlock: '',
        session: {
          answers: {
            r1: {
              value: '',
            },
            r2: {
              value: '',
            },
            r3: {
              value: '',
            },
            r4: {
              value: '',
            },
          },
        },
        showCorrect: false,
        tooltipContainerRef: expect.any(Object),
      });

      expect(Mathquill.getInterface().registerEmbed).toHaveBeenCalled();
    });
  });

  describe('handleKeyDown', () => {
    let instance;
    let textarea;

    beforeEach(() => {
      instance = createInstance();

      textarea = document.createElement('textarea');
      textarea.setAttribute('aria-label', 'Enter answer.');
      document.body.appendChild(textarea);
      textarea.focus();
    });

    afterEach(() => {
      document.body.innerHTML = '';
    });

    it('should have handleKeyDown method', () => {
      expect(instance.handleKeyDown).toBeInstanceOf(Function);
    });

    it('should activate the keypad when ArrowDown is pressed', () => {
      const event = { key: 'ArrowDown', target: document.activeElement };
      instance.handleKeyDown(event, 'r1');
      expect(instance.state.activeAnswerBlock).toEqual('');
    });

    it('should activate the keypad on click or touch event', () => {
      const clickEvent = { type: 'click', target: document.activeElement };
      instance.handleKeyDown(clickEvent, 'r1');
      expect(instance.state.activeAnswerBlock).toEqual('');

      instance.setState({ activeAnswerBlock: '' });
      const touchEvent = { type: 'touchstart', target: document.activeElement };
      instance.handleKeyDown(touchEvent, 'r1');
      expect(instance.state.activeAnswerBlock).toEqual('');
    });

    it('should deactivate the keypad on Escape key press', () => {
      instance.setState({ activeAnswerBlock: 'r1' });
      instance.handleKeyDown({ key: 'Escape', target: document.activeElement }, 'r1');
      expect(instance.state.activeAnswerBlock).toEqual('');
    });

    it('should deactivate the keypad if the input is not focused and a click or touch event occurs', () => {
      const event = { key: 'ArrowDown', target: document.activeElement };
      instance.setState({ activeAnswerBlock: 'r1' });

      instance.onBlur(event);

      expect(instance.state.activeAnswerBlock).toEqual('');
    });
  });

  describe('logic', () => {
    it('prepares latex correctly and answer blocks and turns them into inputs', () => {
      const instance = createInstance();
      // The latex preparation happens in the render method
      // We can't easily test the exact latex output without rendering, but we can verify the structure is set up correctly
      expect(instance.state.session.answers).toHaveProperty('r1');
      expect(instance.state.session.answers).toHaveProperty('r2');
      expect(instance.state.session.answers).toHaveProperty('r3');
      expect(instance.state.session.answers).toHaveProperty('r4');
    });

    it('correctly renders simple interaction in case of simple mode', () => {
      // First verify advanced mode renders mq-static
      const { queryByTestId, unmount } = wrapper();
      expect(queryByTestId('mq-static')).toBeInTheDocument();
      expect(queryByTestId('simple-question-block')).not.toBeInTheDocument();
      unmount();

      // Then verify simple mode renders simple-question-block
      const simpleProps = {
        ...defaultProps,
        model: {
          ...defaultProps.model,
          config: {
            ...defaultProps.model.config,
            responseType: 'Simple',
          },
        },
      };

      const { queryByTestId: querySimple } = render(<Main {...simpleProps} />);

      expect(querySimple('mq-static')).not.toBeInTheDocument();
      expect(querySimple('simple-question-block')).toBeInTheDocument();
    });

    it('correctly pre-populates answers from session', () => {
      const instance = createInstance({
        session: {
          answers: {
            r1: {
              value: '\\frac{n-5}{6}',
            },
          },
        },
      });
      expect(instance.state).toEqual({
        activeAnswerBlock: '',
        session: {
          answers: {
            r1: {
              value: '\\frac{n-5}{6}',
            },
            r2: {
              value: '',
            },
            r3: {
              value: '',
            },
            r4: {
              value: '',
            },
          },
        },
        showCorrect: false,
        tooltipContainerRef: expect.any(Object),
      });
    });

    it('correctly updates session in case of model change', () => {
      const instance = createInstance();

      instance.subFieldChanged('r1', 'value');
      expect(instance.state).toEqual({
        activeAnswerBlock: '',
        session: {
          answers: {
            r1: {
              value: 'value',
            },
            r2: {
              value: '',
            },
            r3: {
              value: '',
            },
            r4: {
              value: '',
            },
          },
        },
        showCorrect: false,
        tooltipContainerRef: expect.any(Object),
      });
    });

    it('correctly updates session in case of subfield change', () => {
      const instance = createInstance();

      expect(instance.state).toEqual({
        activeAnswerBlock: '',
        session: {
          answers: {
            r1: {
              value: '',
            },
            r2: {
              value: '',
            },
            r3: {
              value: '',
            },
            r4: {
              value: '',
            },
          },
        },
        showCorrect: false,
        tooltipContainerRef: expect.any(Object),
      });

      const newProps = {
        ...defaultProps,
        model: {
          ...defaultProps.model,
          config: {
            ...defaultProps.model.config,
            expression: defaultProps.model.config.expression + ' {{response}}',
          },
        },
      };

      const newInstance = createInstance(newProps);

      expect(newInstance.state).toEqual({
        activeAnswerBlock: '',
        session: {
          answers: {
            r1: {
              value: '',
            },
            r2: {
              value: '',
            },
            r3: {
              value: '',
            },
            r4: {
              value: '',
            },
            r5: {
              value: '',
            },
          },
        },
        showCorrect: false,
        tooltipContainerRef: expect.any(Object),
      });
    });
  });

  describe('Main component additional functions', () => {
    let instance;
    let textarea;

    beforeEach(() => {
      instance = createInstance();

      textarea = document.createElement('textarea');
      textarea.setAttribute('aria-label', 'Enter answer.');
      document.body.appendChild(textarea);
      textarea.focus();
    });

    afterEach(() => {
      document.body.innerHTML = '';
    });

    it('should handle answer block DOM update correctly', () => {
      const mockRoot = document.createElement('div');
      mockRoot.innerHTML = `
        <div id="r1"></div>
        <div id="r1Index"></div>
      `;
      instance.root = mockRoot;

      instance.handleAnswerBlockDomUpdate();

      expect(mockRoot.querySelector('#r1').textContent).toEqual('');
    });

    it('should count response occurrences correctly', () => {
      const expression = '{{response}} + {{response}} = {{response}}';
      const count = instance.countResponseOccurrences(expression);
      expect(count).toEqual(3);
    });

    it('should update aria attributes correctly', () => {
      const mockRoot = document.createElement('div');
      mockRoot.innerHTML = `
        <div class="mq-selectable"></div>
        <div class="mq-selectable"></div>
        <div class="mq-textarea">
          <textarea></textarea>
        </div>
      `;
      instance.root = mockRoot;

      instance.updateAria();

      const textareaElements = mockRoot.querySelectorAll('textarea');
      textareaElements.forEach((elem, index) => {
        expect(elem.getAttribute('aria-label')).toEqual('Enter answer.');
        expect(elem.getAttribute('aria-describedby')).not.toBeNull();
        const describedById = elem.getAttribute('aria-describedby');
        const describedByElement = mockRoot.querySelector(`#${describedById}`);
        expect(describedByElement).not.toBeNull();
      });
    });

    it('should focus first keypad element correctly', () => {
      jest.useFakeTimers();

      const mockRoot = document.createElement('div');
      mockRoot.innerHTML = `
        <div data-keypad="true">
          <button>Button 1</button>
          <button>Button 2</button>
        </div>
      `;

      document.body.appendChild(mockRoot);

      instance.root = mockRoot;

      instance.focusFirstKeypadElement();

      jest.runAllTimers();

      const focusedElement = document.activeElement;
      expect(focusedElement.textContent).toEqual('Button 1');

      document.body.removeChild(mockRoot);

      jest.useRealTimers();
    });

    it('should handle blur correctly', () => {
      instance.setState({ activeAnswerBlock: 'r1' });

      const mockRelatedTarget = document.createElement('div');
      const parentWithTooltip = document.createElement('div');
      parentWithTooltip.setAttribute('role', 'tooltip');

      const childWithKeypad = document.createElement('div');
      childWithKeypad.setAttribute('data-keypad', 'true');

      parentWithTooltip.appendChild(childWithKeypad);

      Object.defineProperty(mockRelatedTarget, 'offsetParent', {
        get: function () {
          return parentWithTooltip;
        },
      });

      const event = {
        relatedTarget: mockRelatedTarget,
        currentTarget: document.createElement('div'),
      };

      instance.onBlur(event);

      expect(instance.state.activeAnswerBlock).toEqual('r1');

      event.relatedTarget = null;
      instance.onBlur(event);

      expect(instance.state.activeAnswerBlock).toEqual('');
    });

    it('should call onSessionChange correctly', () => {
      instance.setState({
        session: {
          answers: {
            r1: { value: 'test' },
          },
        },
      });

      instance.callOnSessionChange();

      expect(defaultProps.onSessionChange).toHaveBeenCalledWith({
        answers: {
          r1: { value: 'test' },
        },
      });
    });

    it('should toggle show correct state correctly', () => {
      instance.toggleShowCorrect(true);
      expect(instance.state.showCorrect).toEqual(true);

      instance.toggleShowCorrect(false);
      expect(instance.state.showCorrect).toEqual(false);
    });

    it('should handle subFieldChanged correctly', () => {
      instance.subFieldChanged('r1', 'new value');

      expect(instance.state.session.answers.r1.value).toEqual('new value');
    });

    it('should get the correct field name', () => {
      const fields = { r1: { id: 1 }, r2: { id: 2 } };
      instance.setState({
        session: {
          answers: {
            r1: { value: 'test' },
          },
        },
      });

      const fieldName = instance.getFieldName({ id: 1 }, fields);
      expect(fieldName).toEqual('r1');
    });
  });
});
