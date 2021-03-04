import React from 'react';
import Categorize from '../index';
import { shallow } from 'enzyme';
import {
  ModelSetEvent,
  SessionChangedEvent
} from '@pie-framework/pie-player-events';
import { Categorize as UnStyledCategorize } from '../categorize/index';

jest.mock('@pie-lib/math-rendering', () => ({ renderMath: jest.fn() }));

describe('categorize', () => {
  describe('renders', () => {
    let wrapper = props => {
      let defaultProps = {
        model: {
          categories: [],
          choices: [],
          correctResponse: [],
          ...props
        },
        session: {},
        classes: {}
      };
      return shallow(<UnStyledCategorize { ...defaultProps } />)
    };

    it('snapshot', () => {
      const w = wrapper();
      expect(w).toMatchSnapshot();
    });

    it('snapshot with rationale', () => {
      const w = wrapper({ rationale: 'This is rationale'});
      expect(w).toMatchSnapshot();
    });

    it('snapshot with teacherInstructions', () => {
      const w = wrapper({ teacherInstructions: 'These are teacher instructions'});
      expect(w).toMatchSnapshot();
    });
  });

  describe('events', () => {
    describe('model', () => {
      it('dispatches model set event', () => {
        const el = new Categorize();
        el.tagName = 'categorize-el';
        el.model = {};
        expect(el.dispatchEvent).toBeCalledWith(
          new ModelSetEvent('categorize-el', false, true)
        );
      });
    });
    describe('changeAnswers', () => {
      it('dispatches session changed event', () => {
        const el = new Categorize();
        el.tagName = 'categorize-el';
        el.session = { answers: [] };
        el.changeAnswers([{ foo: 'bar' }]);
        expect(el.dispatchEvent).toBeCalledWith(
          new SessionChangedEvent('categorize-el', true)
        );
      });
    });
  });
});
