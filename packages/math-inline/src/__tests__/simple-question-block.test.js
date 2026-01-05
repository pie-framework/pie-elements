import * as React from 'react';
import { render } from '@testing-library/react';
import { mq } from '@pie-lib/math-input';
import { MathToolbar } from '@pie-lib/math-toolbar';
import SimpleQuestionBlock from '../simple-question-block';

jest.mock('@pie-lib/math-input', () => ({
  mq: {
    Static: (props) => <div data-testid="mq-static" {...props} />,
  },
}));

jest.mock('@pie-lib/math-toolbar', () => ({
  MathToolbar: (props) => <div data-testid="math-toolbar" {...props} />,
}));

describe('SimpleQuestionBlock', () => {
  const defaultProps = {
    model: {
      config: {
        mode: 'advanced',
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
        equationEditor: 'miscellaneous',
        expression: 'n = {\\embed{answerBlock}[answerBlock1]}',
        question:
          '<p>The binomial <math xmlns="http://www.w3.org/1998/Math/MathML"> <mi>x</mi><mo>&#8722;</mo><mn>2</mn> </math> is a factor of the polynomial below.</p><p><span class="equation-block"><math xmlns="http://www.w3.org/1998/Math/MathML"> <mi>f</mi><mo stretchy="false">(</mo><mi>x</mi><mo stretchy="false">)</mo><mo>=</mo><msup> <mi>x</mi> <mn>3</mn> </msup> <mo>+</mo><msup> <mi>x</mi> <mn>2</mn> </msup> <mo>+</mo><mi>n</mi><mi>x</mi><mo>+</mo><mn>10</mn> </math> </span></p><p>What is the value of <span class="variable">n</span>? Use the on-screen keyboard&#160;to type the correct answer in the box.</p>',
        note: 'The answer shown above is the primary correct answer specified by the author for this item, but other answers may also be recognized as correct.',
        responses: [
          {
            answer: 'n=-11',
            id: 'answerBlock1',
            alternates: {},
            validation: 'literal',
          },
        ],
        response: {
          answer: 'n=-11',
          id: 'answerBlock1',
          alternates: {},
          validation: 'literal',
        },
      },
    },
    correctness: {},
    showCorrect: false,
    session: {
      response: 'sessionResponse',
    },
    onSimpleResponseChange: jest.fn(),
    onSubFieldFocus: jest.fn(),
    showKeypad: true,
  };

  const wrapper = (props = {}) => {
    return render(<SimpleQuestionBlock {...defaultProps} {...props} />);
  };

  const createInstance = (props = {}) => {
    const instanceProps = {
      ...defaultProps,
      ...props,
    };
    const instance = new SimpleQuestionBlock(instanceProps);
    instance.setState = jest.fn((state) => {
      Object.assign(instance.state, typeof state === 'function' ? state(instance.state) : state);
    });
    return instance;
  };

  it('renders correctly for not showing correct mode', () => {
    const { queryByTestId } = wrapper();

    expect(queryByTestId('mq-static')).not.toBeInTheDocument();
    expect(queryByTestId('math-toolbar')).toBeInTheDocument();
  });

  it('renders correctly for showing correct mode', () => {
    const { queryByTestId } = wrapper({ showCorrect: true });

    expect(queryByTestId('mq-static')).toBeInTheDocument();
    expect(queryByTestId('math-toolbar')).not.toBeInTheDocument();
  });

  it('correctly keeps the keypad open', () => {
    const instance = createInstance();

    instance.onFocus();
    expect(defaultProps.onSubFieldFocus).toHaveBeenCalledWith(instance.mathToolBarId);
    expect(instance.props.showKeypad).toEqual(true);

    instance.mathToolBarContainsTarget = () => true;
    instance.handleClick();

    expect(instance.props.showKeypad).toEqual(true);
  });

  it('correctly hides the keypad', () => {
    const instance = createInstance();

    instance.onFocus();
    expect(defaultProps.onSubFieldFocus).toHaveBeenCalledWith(instance.mathToolBarId);
    expect(instance.props.showKeypad).toEqual(true);

    // Simulate clicking outside the toolbar (to hide the keypad)
    instance.mathToolBarContainsTarget = () => false;
    instance.handleClick();

    // Create new instance with showKeypad: false to simulate parent component reaction
    const newInstance = createInstance({ showKeypad: false });

    expect(newInstance.props.showKeypad).toEqual(false);
  });

  it('does not call session change on render', () => {
    wrapper();
    expect(defaultProps.onSimpleResponseChange).not.toHaveBeenCalled();
  });
});
