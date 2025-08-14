import React from 'react';
import { shallow } from 'enzyme';
import { ModelSetEvent, SessionChangedEvent } from '@pie-framework/pie-player-events';
import MultipleChoiceComponent from '../main';
import MultipleChoice from '../index';
import { isComplete } from '../index';

jest.useFakeTimers();
jest.mock('@pie-lib/math-rendering', () => ({ renderMath: jest.fn() }));
jest.mock('lodash/debounce', () => jest.fn((fn) => fn));

describe('isComplete', () => {
  it.each`
    session                 | expected
    ${{ value: [1, 2, 3] }} | ${true}
    ${{ value: [] }}        | ${false}
    ${{}}                   | ${false}
    ${null}                 | ${false}
    ${undefined}            | ${false}
  `('session = $session is complete => $expected', ({ session, expected }) => {
    expect(isComplete(session)).toEqual(expected);
  });
});

describe('multiple-choice', () => {
  describe('renders', () => {
    let wrapper = (props) => {
      let defaultProps = {
        model: {
          ...props,
        },
        session: {},
        classes: {},
      };

      return shallow(<MultipleChoiceComponent {...defaultProps} />);
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
        const el = new MultipleChoice();
        el.tagName = 'mc-el';
        el.model = {};
        expect(el.dispatchEvent).toBeCalledWith(new ModelSetEvent('mc-el', false, true));
      });
    });

    describe('onChange', () => {
      it('dispatches session changed event - add answer (checkbox)', () => {
        const el = new MultipleChoice();
        el.tagName = 'mc-el';
        el.model = { choiceMode: 'checkbox' };
        el.session = { value: [] };
        el._onChange({ value: 'a', selected: true });
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('mc-el', true));
      });

      it('dispatches session changed event - remove answer (checkbox)', () => {
        const el = new MultipleChoice();
        el.tagName = 'mc-el';
        el.model = { choiceMode: 'checkbox' };
        el.session = { value: ['a'] };
        el._onChange({ value: 'a', selected: false });
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('mc-el', false));
      });

      it('dispatches session changed event - add/remove answer (checkbox)', () => {
        const el = new MultipleChoice();
        el.tagName = 'mc-el';
        el.model = { choiceMode: 'checkbox' };
        el.session = { value: ['1'] };
        el._onChange({ id: '2', selected: true });
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('mc-el', true));

        el._onChange({ id: '1', selected: false });
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('mc-el', true));

        el._onChange({ id: '2', selected: false });
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('mc-el', false));
      });

      it('dispatches session changed event - add/change answer (radio)', () => {
        const el = new MultipleChoice();
        el.tagName = 'mc-el';
        el.model = { choiceMode: 'radio' };
        el.session = { value: [] };
        el._onChange({ value: 'a', selected: true });
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('mc-el', true));
        el._onChange({ value: 'b', selected: true });
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('mc-el', true));
      });
    });
  });
});
