import { shallow } from 'enzyme';
import React from 'react';
import { Design } from '../design';

describe('design', () => {
  let w;
  let onChange;

  const getModel = () => ({ tokens: [] });
  beforeEach(() => {
    onChange = jest.fn();
    w = shallow(
      <Design
        model={getModel()}
        classes={{}}
        className={'foo'}
        onChange={onChange}
      />
    );
  });

  describe('snapshot', () => {
    it('renders', () => {
      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    const assert = (fn, args, expected) => {
      const e = expected(getModel());
      it(`${fn} ${JSON.stringify(args)} => ${JSON.stringify(e)}`, () => {
        const instance = w.instance();
        instance[fn].apply(instance, args);
        expect(onChange).toBeCalledWith(e);
      });
    };

    describe('changeText', () => {
      assert('changeText', [{ target: { value: 'foo' } }], m => ({
        ...m,
        text: 'foo'
      }));
    });

    describe('changeTokens', () => {
      assert('changeTokens', [[{ start: 0, end: 1, text: 'f' }]], m => ({
        ...m,
        maxSelections: 0,
        tokens: [{ start: 0, end: 1, text: 'f' }]
      }));
      assert(
        'changeTokens',
        [[{ start: 0, end: 1, text: 'f', correct: true }]],
        m => ({
          ...m,
          maxSelections: 1,
          tokens: [{ start: 0, end: 1, text: 'f', correct: true }]
        })
      );
    });

    describe('changeMaxSelections', () => {
      assert('changeMaxSelections', [{}, 4], m => ({ ...m, maxSelections: 4 }));
    });
    describe('changeHighlight', () => {
      assert('changeHighlight', [], m => ({ ...m, highlightChoices: true }));
    });
    describe('changeFeedback', () => {
      assert('changeFeedback', [{ correctFeedbackType: 'none' }], m => ({
        ...m,
        feedback: { correctFeedbackType: 'none' }
      }));
    });
  });
});
