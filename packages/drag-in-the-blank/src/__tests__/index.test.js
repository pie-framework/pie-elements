import React from 'react';
import { shallow } from 'enzyme';
import { ModelSetEvent, SessionChangedEvent } from '@pie-framework/pie-player-events';
import { Main } from '../main';
import DragInTheBlank from '../index';

jest.mock('@pie-lib/pie-toolbox/math-rendering', () => ({ renderMath: jest.fn() }));

describe('drag-in-the-blank', () => {
  describe('renders', () => {
    let wrapper = (props) => {
      let defaultProps = {
        model: {
          choices: [],
          correctResponse: {},
          ...props,
        },
        session: {},
        classes: {},
      };

      return shallow(<Main {...defaultProps} />);
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
        const el = new DragInTheBlank();
        el.tagName = 'ditb-el';
        el.model = {};
        expect(el.dispatchEvent).toBeCalledWith(new ModelSetEvent('ditb-el', false, true));
      });
    });

    describe('changeSession', () => {
      it('dispatches session changed event - add answer', () => {
        const el = new DragInTheBlank();
        el.tagName = 'ditb-el';
        el.session = { value: {} };
        el.changeSession({ 0: '1' });
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('ditb-el', true));
      });

      it('dispatches session changed event - remove answer', () => {
        const el = new DragInTheBlank();
        el.tagName = 'ditb-el';
        el.session = { value: { 0: '1' } };
        el.changeSession({ 0: undefined });
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('ditb-el', false));
      });

      it('dispatches session changed event - add/remove answer', () => {
        const el = new DragInTheBlank();
        el.tagName = 'ditb-el';
        el.session = { value: { 0: '1' } };
        el.changeSession({ 0: '1', 1: '0' });
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('ditb-el', true));

        el.changeSession({ 0: '1', 1: undefined });
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('ditb-el', true));

        el.changeSession({ 0: undefined, 1: undefined });
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('ditb-el', false));
      });
    });
  });
});
