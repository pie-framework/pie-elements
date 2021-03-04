import * as React from 'react';
import { mq } from '@pie-lib/math-input';
import { shallowChild } from '@pie-lib/test-utils';
import { MathToolbar } from '@pie-lib/math-toolbar';
import SimpleQuestionBlock from '../simple-question-block';

describe('SimpleQuestionBlock', () => {
  const defaultProps = {
    model: {
      config: {
        mode: 'advanced',
        feedback: {
          correct: {
            default: 'Correct',
            type: 'none'
          },
          incorrect: {
            default: 'Incorrect',
            type: 'none'
          },
          partial: {
            default: 'Nearly',
            type: 'none'
          }
        },
        equationEditor: 'everything',
        expression: 'n = {\\embed{answerBlock}[answerBlock1]}',
        question:
          '<p>The binomial <math xmlns="http://www.w3.org/1998/Math/MathML"> <mi>x</mi><mo>&#8722;</mo><mn>2</mn> </math> is a factor of the polynomial below.</p><p><span class="equation-block"><math xmlns="http://www.w3.org/1998/Math/MathML"> <mi>f</mi><mo stretchy="false">(</mo><mi>x</mi><mo stretchy="false">)</mo><mo>=</mo><msup> <mi>x</mi> <mn>3</mn> </msup> <mo>+</mo><msup> <mi>x</mi> <mn>2</mn> </msup> <mo>+</mo><mi>n</mi><mi>x</mi><mo>+</mo><mn>10</mn> </math> </span></p><p>What is the value of <span class="variable">n</span>? Use the on-screen keyboard&#160;to type the correct answer in the box.</p>',
        responses: [
          {
            answer: 'n=-11',
            id: 'answerBlock1',
            alternates: {},
            validation: 'literal'
          }
        ],
        response: {
          answer: 'n=-11',
          id: 'answerBlock1',
          alternates: {},
          validation: 'literal'
        }
      }
    },
    correctness: {},
    showCorrect: false,
    session: {
      response: 'sessionResponse',
    },
    onSimpleResponseChange: jest.fn()
  };

  let wrapper;
  let component;

  beforeEach(() => {
    wrapper = shallowChild(SimpleQuestionBlock, defaultProps, 1);
  });

  it('renders correctly for not showing correct mode', () => {
    component = wrapper();

    expect(component.find(mq.Static).length).toEqual(0);
    expect(component.find(MathToolbar).length).toEqual(1);
    expect(component.find(MathToolbar).props().latex).toEqual('sessionResponse');
  });

  it('renders correctly for showing correct mode', () => {
    component = wrapper({ ...defaultProps, showCorrect: true });

    expect(component.find(mq.Static).length).toEqual(1);
    expect(component.find(MathToolbar).length).toEqual(0);
    expect(component.find(mq.Static).props().latex).toEqual('n=-11');
  });

  it('correctly keeps the keypad open', () => {
    component = wrapper();

    component.instance().onFocus();
    expect(component.state().showKeypad).toEqual(true);
    component.instance().onBlur({
      relatedTarget: { offsetParent: 'editor1'},
      currentTarget: { offsetParent: 'editor1'}
    });
    expect(component.state().showKeypad).toEqual(true);
  });

  it('correctly hides the keypad', () => {
    component = wrapper();

    component.instance().onFocus();
    expect(component.state().showKeypad).toEqual(true);
    component.instance().onBlur({
      relatedTarget: { offsetParent: 'editor1'},
      currentTarget: { offsetParent: 'editor2'}
    });
    expect(component.state().showKeypad).toEqual(false);

  });
});
