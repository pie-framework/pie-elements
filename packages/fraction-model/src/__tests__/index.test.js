import FractionModel from '..';
import React from 'react';
import ReactDOM from 'react-dom';
import { SessionChangedEvent } from '@pie-framework/pie-player-events';

import { renderMath } from '@pie-lib/pie-toolbox/math-rendering-accessible';
jest.mock('@pie-lib/pie-toolbox/math-rendering-accessible', () => ({
  renderMath: jest.fn(),
}));
jest.mock('../main', () => jest.fn());

jest.mock('react', () => ({
  createElement: jest.fn(),
}));

jest.mock('react-dom', () => ({
  render: jest.fn((r, el, cb) => {
    cb();
  }),
}));

describe('fraction-model', () => {
  let c;
  beforeEach(() => {
    c = new FractionModel();
    c.dispatchEvent = jest.fn();
    c.tagName = 'fraction-model';
    c.model = {};
    c.session = {};
  });

  describe('init', () => {
    it('calls createElement', () => {
      expect(React.createElement).toBeCalled();
    });
    it('calls render', () => {
      expect(ReactDOM.render).toBeCalledWith(undefined, expect.anything(), expect.any(Function));
    });

    it('calls renderMath', () => {
      expect(renderMath).toHaveBeenCalled();
    });
  });

  describe('isSessionComplete', () => {
    it('returns true', () => {
      expect(c.isSessionComplete()).toEqual(true);
    });
  });
});
