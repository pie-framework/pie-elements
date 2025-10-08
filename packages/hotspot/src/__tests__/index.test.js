import React from 'react';
import { shallow } from 'enzyme';
import { ModelSetEvent, SessionChangedEvent } from '@pie-framework/pie-player-events';
import HotspotComponent from '../hotspot';
import Hotspot from '../index';

jest.mock('@pie-lib/math-rendering', () => ({ renderMath: jest.fn() }));

describe('hotspot', () => {
  describe('renders', () => {
    let wrapper = (props) => {
      let defaultProps = {
        model: {
          dimensions: { height: 0, width: 0 },
          shapes: { rectangles: [], polygons: [], circles: [] },
          ...props,
        },
        session: {},
        classes: {},
      };

      return shallow(<HotspotComponent {...defaultProps} />);
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
        const el = new Hotspot();
        el.tagName = 'hotspot-el';
        el.model = {};
        expect(el.dispatchEvent).toBeCalledWith(new ModelSetEvent('hotspot-el', false, true));
      });
    });

    describe('onSelectChoice', () => {
      it('dispatches session changed event - add answer', () => {
        const el = new Hotspot();
        el.tagName = 'hotspot-el';
        el.session = { answers: [] };
        el.onSelectChoice({ id: '1', selected: true });
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('hotspot-el', true));
      });

      it('dispatches session changed event - remove answer', () => {
        const el = new Hotspot();
        el.tagName = 'hotspot-el';
        el.session = { answers: [{ id: '1' }] };
        el.onSelectChoice({ id: '1', selected: false });
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('hotspot-el', false));
      });

      it('dispatches session changed event - add/remove answer', () => {
        const el = new Hotspot();
        el.tagName = 'hotspot-el';
        el.session = { answers: [{ id: '1' }] };
        el.onSelectChoice({ id: '2', selected: true });
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('hotspot-el', true));

        el.onSelectChoice({ id: '1', selected: false });
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('hotspot-el', true));

        el.onSelectChoice({ id: '2', selected: false });
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('hotspot-el', false));
      });
    });
  });
});
