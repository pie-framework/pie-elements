import { shallow } from 'enzyme';
import React from 'react';

import { Config } from '../config';

describe('config', () => {
  let onChange;

  beforeEach(() => {
    onChange = jest.fn();
  });
  const wrapper = extras => {
    const props = { classes: {}, onChange, ...extras };
    return shallow(<Config {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => {
      const w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    describe('apply', () => {
      const assert = function() {
        const args = Array.prototype.slice.call(arguments);
        const method = args[0];
        const handler = args[args.length - 1];
        const fnArgs = args.slice(1, args.length - 1);
        it(`calls onChange for ${method}`, () => {
          const w = wrapper();
          w.instance()[method].apply(w.instance, fnArgs);
          handler();
        });
      };
      assert('changeColumns', {}, 4, () => {
        expect(onChange).toBeCalledWith({
          columns: 4,
          label: '',
          position: 'above',
          shuffle: false
        });
      });
      assert('changeLabel', { target: { value: 'foo' } }, () => {
        expect(onChange).toBeCalledWith({
          columns: 2,
          label: 'foo',
          position: 'above',
          shuffle: false
        });
      });
      assert('toggleShuffle', () => {
        expect(onChange).toBeCalledWith({
          columns: 2,
          label: '',
          position: 'above',
          shuffle: true
        });
      });
      assert('changePosition', 'below', () => {
        expect(onChange).toBeCalledWith({
          columns: 2,
          label: '',
          position: 'below',
          shuffle: false
        });
      });
    });
  });
});
