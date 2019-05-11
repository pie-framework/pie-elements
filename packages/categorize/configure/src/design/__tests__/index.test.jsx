import { shallow } from 'enzyme';
import React from 'react';
import { Design } from '../index';
import util from 'util';

const model = extras => ({
  choices: [{ id: '1', content: 'content' }],
  correctResponse: [{ category: '1', choices: ['1'] }],
  categories: [{ id: '1', label: 'Category Title' }],
  ...extras
});

describe('Design', () => {
  let w;
  let onChange = jest.fn();
  const wrapper = extras => {
    const defaults = {
      classes: { design: 'design', text: 'text' },
      className: 'className',
      onChange,
      model: model(),
      uid: '1'
    };
    const props = { ...defaults, ...extras };

    return shallow(<Design {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });
  describe('logic', () => {
    beforeEach(() => {
      w = wrapper();
    });

    const callsOnChange = function() {
      let args = Array.prototype.slice.call(arguments);
      if (typeof args[0] === 'string') {
        args = [wrapper()].concat(args);
      }
      const er = args[0];
      const method = args[1];
      const expected = args[args.length - 1];
      const fnArgs = args.splice(2, args.length - 3);
      const argString = fnArgs
        .map(o => util.inspect(o, { colors: true }))
        .join(', ');
      it(`${method}(${argString}) calls onChange with ${util.inspect(expected, {
        colors: true
      })}`, () => {
        onChange.mockReset();
        er.instance()[method].apply(w.instance(), fnArgs);

        expect(onChange).toBeCalledWith(expect.objectContaining(expected));
      });
    };

    describe('changeFeedback', () => {
      callsOnChange(
        'changeFeedback',
        {
          correct: {
            type: 'none',
            default: 'Correct'
          },
          incorrect: {
            type: 'none',
            default: 'Incorrect'
          },
          partial: {
            type: 'default',
            default: 'Nearly'
          }
        },
        {
          feedback: {
            correct: {
              type: 'none',
              default: 'Correct'
            },
            incorrect: {
              type: 'none',
              default: 'Incorrect'
            },
            partial: {
              type: 'default',
              default: 'Nearly'
            }
          }
        }
      );
    });

    describe('countInCorrectResponse', () => {
      it('counts', () => {
        let w = wrapper();
        const result = w.instance().countChoiceInCorrectResponse({ id: '1' });
        expect(result).toEqual(1);
      });
    });
  });
});
