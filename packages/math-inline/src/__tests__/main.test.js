import * as React from 'react';
import { shallow } from 'enzyme';
import Main from '../main';
import { mq, HorizontalKeypad } from '@pie-lib/pie-toolbox/math-input';
import { shallowChild } from '@pie-lib/pie-toolbox/test-utils';
import { Feedback } from '@pie-lib/pie-toolbox/render-ui';
import {CorrectAnswerToggle} from '@pie-lib/pie-toolbox/correct-answer-toggle';
import SimpleQuestionBlock from '../simple-question-block';

const Mathquill = require('@pie-framework/mathquill');

jest.mock('@pie-framework/mathquill', () => ({
  StaticMath: jest.fn().mockReturnValue({
    latex: jest.fn(),
  }),
  registerEmbed: jest.fn(),
  getInterface: jest.fn().mockReturnThis(),
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

  let wrapper;
  let component;

  beforeEach(() => {
    wrapper = shallow(<Main {...defaultProps} />);
    component = shallowChild(Main, defaultProps, 1);
  });

  describe('render', () => {
    it('renders correctly with snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly', () => {
      expect(wrapper.find(CorrectAnswerToggle).length).toEqual(0);
      expect(wrapper.find(Feedback).length).toEqual(0);

      expect(wrapper.dive().state()).toEqual({
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
      });

      expect(Mathquill.getInterface().registerEmbed).toHaveBeenCalled();
    });
  });

  describe('handleKeyDown', () => {
    let instance;
    let textarea;
  
    beforeEach(() => {
      wrapper = component();
      instance = wrapper.instance();
      
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
      expect(wrapper.state('activeAnswerBlock')).toEqual('r1');
    });
  
    it('should activate the keypad on click or touch event', () => {
      const clickEvent = { type: 'click', target: document.activeElement };
      instance.handleKeyDown(clickEvent, 'r1');
      expect(wrapper.state('activeAnswerBlock')).toEqual('r1');
  
      wrapper.setState({ activeAnswerBlock: '' });
      const touchEvent = { type: 'touchstart', target: document.activeElement };
      instance.handleKeyDown(touchEvent, 'r1');
      expect(wrapper.state('activeAnswerBlock')).toEqual('r1');
    });
  
    it('should deactivate the keypad on Escape key press', () => {
      wrapper.setState({ activeAnswerBlock: 'r1' });
      instance.handleKeyDown({ key: 'Escape', target: document.activeElement }, 'r1');
      expect(wrapper.state('activeAnswerBlock')).toEqual('');
    });
  
    it('should deactivate the keypad if the input is not focused and a click or touch event occurs', () => {
      textarea.blur();
      wrapper.setState({ activeAnswerBlock: 'r1' });
    
      const differentElement = document.createElement('div');
      document.body.appendChild(differentElement);
  
      instance.handleKeyDown({ type: 'click', target: differentElement }, 'r2');
      
      expect(wrapper.state('activeAnswerBlock')).toEqual('');
    });
  });

  describe('logic', () => {
    it('prepares latex correctly and answer blocks and turns them into inputs', () => {
      expect(wrapper.dive().find(mq.Static).length).toEqual(1);
      expect(wrapper.dive().find(mq.Static).props().latex).toEqual(
        '\\text{A family sized box contains} \\MathQuillMathField[r1]{} \\text{less than} \\MathQuillMathField[r2]{} \\text{times the number  }  \\frac{3}{6}=\\frac{ \\MathQuillMathField[r3]{} }{4} + \\frac{ \\MathQuillMathField[r4]{} }{4}',
      );
    });

    it('correctly renders simple interaction in case of simple mode', () => {
      expect(wrapper.dive().find(mq.Static).length).toEqual(1);
      expect(wrapper.dive().find(SimpleQuestionBlock).length).toEqual(0);

      const simpleProps = { ...defaultProps };
      simpleProps.model.config.responseType = 'Simple';

      wrapper.setProps(simpleProps);

      expect(wrapper.dive().find(mq.Static).length).toEqual(0);
      expect(wrapper.dive().find(SimpleQuestionBlock).length).toEqual(1);
    });

    it('correctly pre-populates answers from session', () => {
      wrapper = component({
        session: {
          answers: {
            r1: {
              value: '\\frac{n-5}{6}',
            },
          },
        },
      });
      expect(wrapper.state()).toEqual({
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
      });
    });

    it('correctly updates session in case of model change', () => {
      wrapper = component();

      wrapper.instance().subFieldChanged('r1', 'value');
      expect(wrapper.state()).toEqual({
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
      });
    });

    it('correctly updates session in case of subfield change', () => {
      wrapper = component();

      expect(wrapper.state()).toEqual({
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
      });

      const newProps = { ...defaultProps };

      newProps.model.config.expression = defaultProps.model.config.expression + ' {{response}}';

      wrapper.setProps(newProps);

      expect(wrapper.state()).toEqual({
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
      });
    });
  });

  describe('Main component additional functions', () => {
    let instance;
    let textarea;
  
    beforeEach(() => {
      wrapper = component();
      instance = wrapper.instance();
      
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
      wrapper.setState({ activeAnswerBlock: 'r1' });
 
      const mockRelatedTarget = document.createElement('div');
      const parentWithTooltip = document.createElement('div');
      parentWithTooltip.setAttribute('role', 'tooltip');
      
      const childWithKeypad = document.createElement('div');
      childWithKeypad.setAttribute('data-keypad', 'true');
      
      parentWithTooltip.appendChild(childWithKeypad);
      
      Object.defineProperty(mockRelatedTarget, 'offsetParent', {
        get: function() {
          return parentWithTooltip;
        }
      });
      
      const event = {
        relatedTarget: mockRelatedTarget,
        currentTarget: document.createElement('div')
      };
    
      instance.onBlur(event);
    
      expect(wrapper.state('activeAnswerBlock')).toEqual('r1');

      event.relatedTarget = null;
      instance.onBlur(event);
    
      expect(wrapper.state('activeAnswerBlock')).toEqual('');
    });
    
    it('should call onSessionChange correctly', () => {
      wrapper.setState({
        session: {
          answers: {
            r1: { value: 'test' }
          }
        }
      });
  
      instance.callOnSessionChange();
  
      expect(defaultProps.onSessionChange).toHaveBeenCalledWith({
        answers: {
          r1: { value: 'test' }
        }
      });
    });
  
    it('should toggle show correct state correctly', () => {
      instance.toggleShowCorrect(true);
      expect(wrapper.state('showCorrect')).toEqual(true);
  
      instance.toggleShowCorrect(false);
      expect(wrapper.state('showCorrect')).toEqual(false);
    });
  
    it('should handle subFieldChanged correctly', () => {
      instance.subFieldChanged('r1', 'new value');
  
      expect(wrapper.state('session').answers.r1.value).toEqual('new value');
    });
  
    it('should get the correct field name', () => {
      const fields = { r1: { id: 1 }, r2: { id: 2 } };
      wrapper.setState({
        session: {
          answers: {
            r1: { value: 'test' }
          }
        }
      });
  
      const fieldName = instance.getFieldName({ id: 1 }, fields);
      expect(fieldName).toEqual('r1');
    });
  });
  
});
