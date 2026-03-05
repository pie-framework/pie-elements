import SelectText from '..';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { SessionChangedEvent } from '@pie-framework/pie-player-events';

import { renderMath } from '@pie-lib/math-rendering';
jest.mock('@pie-lib/math-rendering', () => ({
  renderMath: jest.fn(),
}));
jest.mock('../main', () => jest.fn());

jest.mock('react', () => ({
  createElement: jest.fn(),
}));

const mockRender = jest.fn();
const mockUnmount = jest.fn();
jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({
    render: mockRender,
    unmount: mockUnmount,
  })),
}));

describe('select-text', () => {
  let c;

  beforeAll(() => {
    if (!customElements.get('select-text')) {
      customElements.define('select-text', SelectText);
    }
  });

  beforeEach(() => {
    c = new SelectText();
    c.dispatchEvent = jest.fn();
    c.model = {};
    c.session = {};
  });

  describe('init', () => {
    it('calls createElement', () => {
      expect(React.createElement).toBeCalled();
    });
    it('calls createRoot and render', () => {
      expect(createRoot).toHaveBeenCalled();
      expect(mockRender).toHaveBeenCalledWith(undefined);
    });

    it('calls renderMath', async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(renderMath).toHaveBeenCalled();
    });
  });

  describe('isSessionComplete', () => {
    it('returns true for non empty selectedTokens', () => {
      c.session = { selectedTokens: [{ start: 0, end: 1, text: 'f' }] };
      expect(c.isSessionComplete()).toEqual(true);
    });

    it('returns false for empty selectedTokens', () => {
      c.session = { selectedTokens: [] };
      expect(c.isSessionComplete()).toEqual(false);
    });
  });

  describe('selectionChanged', () => {
    let newTokens;
    beforeEach(() => {
      newTokens = [{ start: 2, end: 3, text: 'f' }];
      c.selectionChanged(newTokens);
    });

    it('sets the tokens', () => {
      expect(c._session.selectedTokens).toEqual(newTokens);
    });

    it('calls dispatchEvent', () => {
      expect(c.dispatchEvent).toBeCalledWith(new SessionChangedEvent('select-text', true));
    });
  });
});
