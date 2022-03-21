import { shallow } from 'enzyme';
import React from 'react';

global.MutationObserver = class {
  constructor(callback) {}
  disconnect() {}
  observe(element, initObject) {}
};

import { Container } from '../container';

beforeEach(() => {
  jest.useFakeTimers();
});
describe('Container', () => {
  let w;
  let onSessionChange = jest.fn();
  const wrapper = (extras, renderOpts) => {
    const defaults = {
      classes: {},
      className: 'className',
      onSessionChange,
      imageDimensions: {},
      imageUrl: 'url',
      session: {}
    };
    const props = { ...defaults, ...extras };
    return shallow(<Container {...props} />, {
      disableLifecycleMethods: false,
      ...renderOpts
    });
  };

  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });

    it('renders disabled', () => {
      w = wrapper({ disabled: true });
      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    describe('setDimensions', () => {
      it('handles errors and clears interval', () => {
        const w = wrapper({}, { disableLifecycleMethods: true });
        w.instance().drawable = undefined;
        w.instance().setDimensions();
        jest.runAllTimers();
        expect(clearInterval).toHaveBeenCalled();
      });
    });
  });
});
