import { shallow } from 'enzyme';
import React from 'react';
import {
  callsOnChange as _callsOnChange,
  extractArgs
} from '../../__tests__/utils';

import { PartialForCategory } from '../partial-for-category';

describe('PartialForCategory', () => {
  let w;
  let onChange = jest.fn();
  const wrapper = extras => {
    const defaults = {
      classes: {},
      className: 'className',
      partial: {
        rules: [{ count: 1, percent: 40 }]
      },
      category: {
        label: 'Category 1'
      },
      correctResponse: { choices: [] },
      onChange
    };
    const props = { ...defaults, ...extras };
    return shallow(<PartialForCategory {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    const callsOnChange = function() {
      const { method, fnArgs, last } = extractArgs(arguments);
      onChange.mockReset();
      const args = Array.prototype.slice.call(arguments);
      _callsOnChange.apply(null, [wrapper()].concat(args));
    };

    describe('addRule', () => {
      callsOnChange('addRule', () => {
        expect(onChange).toBeCalledWith(
          expect.objectContaining({
            rules: [{ count: 1, percent: 40 }, { count: 2, percent: 50 }]
          })
        );
      });
    });

    describe('deleteRule', () => {
      callsOnChange('deleteRule', { count: 1 }, () => {
        expect(onChange).toBeCalledWith(expect.objectContaining({ rules: [] }));
      });
    });

    describe('changeRule', () => {
      callsOnChange('changeRule', { count: 1, percent: 10 }, () =>
        expect(onChange).toBeCalledWith(
          expect.objectContaining({
            rules: [{ count: 1, percent: 10 }]
          })
        )
      );
    });
  });
});
