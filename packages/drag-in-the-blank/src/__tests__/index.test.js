import React from 'react';
import { ModelSetEvent, SessionChangedEvent } from '@pie-framework/pie-player-events';
import DragInTheBlank from '../index';

// Mock react-dom/client
const mockRender = jest.fn();
const mockUnmount = jest.fn();
jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({
    render: mockRender,
    unmount: mockUnmount,
  })),
}));

jest.mock('@pie-lib/math-rendering', () => ({ renderMath: jest.fn() }));

describe('drag-in-the-blank', () => {
  let el;

  beforeAll(() => {
    // Register the custom element if not already registered
    if (!customElements.get('drag-in-the-blank-test')) {
      customElements.define('drag-in-the-blank-test', DragInTheBlank);
    }
  });

  beforeEach(() => {
    el = document.createElement('drag-in-the-blank-test');
    
    // Mock _render to avoid jsdom innerHTML issues
    el._render = jest.fn();
    
    // Mock dispatchEvent
    el.dispatchEvent = jest.fn();
  });

  describe('events', () => {
    describe('model', () => {
      it('dispatches model set event', () => {
        el.model = {};
        expect(el.dispatchEvent).toHaveBeenCalled();
        const event = el.dispatchEvent.mock.calls[el.dispatchEvent.mock.calls.length - 1][0];
        expect(event).toBeInstanceOf(ModelSetEvent);
      });
    });

    describe('changeSession', () => {
      beforeEach(() => {
        el.session = { value: {} };
        el.model = { responseAreasToBeFilled: 1 };
        // Clear previous dispatch calls
        el.dispatchEvent.mockClear();
      });

      it('dispatches session changed event - add answer', () => {
        el.changeSession({ 0: '1' });
        expect(el.dispatchEvent).toHaveBeenCalled();
        const event = el.dispatchEvent.mock.calls[el.dispatchEvent.mock.calls.length - 1][0];
        expect(event).toBeInstanceOf(SessionChangedEvent);
      });

      it('dispatches session changed event - remove answer', () => {
        el.model = { responseAreasToBeFilled: 1 };
        el.session = { value: { 0: '1' } };
        el.dispatchEvent.mockClear();
        
        el.changeSession({ 0: undefined });
        expect(el.dispatchEvent).toHaveBeenCalled();
        const event = el.dispatchEvent.mock.calls[el.dispatchEvent.mock.calls.length - 1][0];
        expect(event).toBeInstanceOf(SessionChangedEvent);
      });

      it('dispatches session changed event - add/remove answer', () => {
        el.model = { responseAreasToBeFilled: 2 };
        el.session = { value: { 0: '1' } };
        el.dispatchEvent.mockClear();
        
        el.changeSession({ 0: '1', 1: '0' });
        expect(el.dispatchEvent).toHaveBeenCalled();
        let event = el.dispatchEvent.mock.calls[el.dispatchEvent.mock.calls.length - 1][0];
        expect(event).toBeInstanceOf(SessionChangedEvent);

        el.dispatchEvent.mockClear();
        el.changeSession({ 0: '1', 1: undefined });
        expect(el.dispatchEvent).toHaveBeenCalled();
        event = el.dispatchEvent.mock.calls[el.dispatchEvent.mock.calls.length - 1][0];
        expect(event).toBeInstanceOf(SessionChangedEvent);

        el.dispatchEvent.mockClear();
        el.changeSession({ 0: undefined, 1: undefined });
        expect(el.dispatchEvent).toHaveBeenCalled();
        event = el.dispatchEvent.mock.calls[el.dispatchEvent.mock.calls.length - 1][0];
        expect(event).toBeInstanceOf(SessionChangedEvent);
      });
    });
  });
});
