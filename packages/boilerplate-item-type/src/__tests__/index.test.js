import BoilerplateItemType from '..';
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

describe('boilerplate-item-type', () => {
  let c;
  beforeEach(() => {
    c = new BoilerplateItemType();
    c.dispatchEvent = jest.fn();
    c.tagName = 'boilerplate-item-type';
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
    it('returns true', () => {
      expect(c.isSessionComplete()).toEqual(true);
    });
  });
});
