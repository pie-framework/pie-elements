import React from 'react';
import Categorize from '../index';
import { shallow } from 'enzyme';
import { ModelSetEvent, SessionChangedEvent } from '@pie-framework/pie-player-events';
import { Categorize as UnStyledCategorize } from '../categorize/index';

jest.mock('@pie-lib/math-rendering', () => ({ renderMath: jest.fn() }));

describe('categorize', () => {
  describe('renders', () => {
    let wrapper = (props) => {
      let defaultProps = {
        model: {
          categories: [],
          choices: [],
          correctResponse: [],
          ...props,
        },
        session: {},
        classes: {},
      };
      return shallow(<UnStyledCategorize {...defaultProps} />);
    };

    it('snapshot', () => {
      const w = wrapper();
      expect(w).toMatchSnapshot();
    });

    it('snapshot with rationale', () => {
      const w = wrapper({ rationale: 'This is rationale' });
      expect(w).toMatchSnapshot();
    });

    it('snapshot with teacherInstructions', () => {
      const w = wrapper({ teacherInstructions: 'These are teacher instructions' });
      expect(w).toMatchSnapshot();
    });
  });

  describe('events', () => {
    describe('model', () => {
      it('dispatches model set event', () => {
        const el = new Categorize();
        el.tagName = 'categorize-el';
        el.model = {};
        expect(el.dispatchEvent).toBeCalledWith(new ModelSetEvent('categorize-el', false, true));
      });
    });

    describe('changeAnswers', () => {
      it('dispatches session changed event - add answer', () => {
        const el = new Categorize();
        el.tagName = 'categorize-el';
        el.session = { answers: [] };
        el.changeAnswers([{ category: 'id-fruits', choices: ['apple'] }]);
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('categorize-el', true));
      });

      it('dispatches session changed event - remove answer', () => {
        const el = new Categorize();
        el.tagName = 'categorize-el';
        el.session = { answers: [{ category: 'id-fruits', choices: ['apple'] }] };
        el.changeAnswers([{ category: 'id-fruits', choices: [] }]);
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('categorize-el', false));
      });

      it('dispatches session changed event - add/remove answer', () => {
        const el = new Categorize();
        el.tagName = 'categorize-el';
        el.session = { answers: [{ category: 'id-fruits', choices: ['apple'] }] };
        el.changeAnswers([
          { category: 'id-fruits', choices: ['apple'] },
          { category: 'id-vegetables', choices: ['carrot'] },
        ]);
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('categorize-el', true));

        el.changeAnswers([
          { category: 'id-fruits', choices: ['apple'] },
          { category: 'id-vegetables', choices: [] },
        ]);
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('categorize-el', true));

        el.changeAnswers([
          { category: 'id-fruits', choices: [] },
          { category: 'id-vegetables', choices: [] },
        ]);
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('categorize-el', false));
      });
    });
  });
});
