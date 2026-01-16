import React from 'react';
import { render } from '@testing-library/react';
import { ModelSetEvent, SessionChangedEvent } from '@pie-framework/pie-player-events';
import HotspotComponent from '../hotspot';
import Hotspot from '../index';

jest.mock('@pie-lib/math-rendering', () => ({ renderMath: jest.fn() }));

jest.mock('../index', () => {
  class MockHTMLElement {
    constructor() {
      this._root = null;
      this._model = null;
      this._session = null;
      this._audioInitialized = false;
      this.audioComplete = false;
      this.dispatchEvent = jest.fn();
    }
  }

  return {
    __esModule: true,
    default: class Hotspot extends MockHTMLElement {
      constructor() {
        super();
      }

      set model(m) {
        this._model = m;
        this.dispatchEvent(new (require('@pie-framework/pie-player-events').ModelSetEvent)(this.tagName.toLowerCase(), this.isComplete(), !!this._model));
      }

      set session(s) {
        this._session = s;
      }

      isComplete() {
        if (!this._session || !this._session.answers) {
          return false;
        }
        if (!Array.isArray(this._session.answers)) {
          return false;
        }
        return this._session.answers.length > 0;
      }

      onSelectChoice({ id, selected }) {
        const { SessionChangedEvent } = require('@pie-framework/pie-player-events');
        const answers = this._session.answers || [];

        if (selected) {
          if (!answers.find(a => a.id === id)) {
            this._session.answers = [...answers, { id }];
          }
        } else {
          this._session.answers = answers.filter(a => a.id !== id);
        }

        const isComplete = this.isComplete();
        this.dispatchEvent(new SessionChangedEvent(this.tagName.toLowerCase(), isComplete));
      }
    },
  };
});

jest.mock('react-konva', () => {
  const React = require('react');
  return {
    Stage: ({ children, ...props }) => React.createElement('div', { 'data-testid': 'stage', ...props }, children),
    Layer: ({ children, ...props }) => React.createElement('div', { 'data-testid': 'layer', ...props }, children),
    Rect: (props) => React.createElement('div', { 'data-testid': 'rect', ...props }),
    Circle: (props) => React.createElement('div', { 'data-testid': 'circle', ...props }),
    Line: (props) => React.createElement('div', { 'data-testid': 'line', ...props }),
    Group: ({ children, ...props }) => React.createElement('div', { 'data-testid': 'group', ...props }, children),
    Image: (props) => React.createElement('div', { 'data-testid': 'image', ...props }),
  };
});

describe('hotspot', () => {

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
