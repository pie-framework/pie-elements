import { shallow } from 'enzyme';
import React from 'react';

import { Scoring } from '../index';
import { callsOnChange as _callsOnChange } from '../../__tests__/utils';

describe('Scoring', () => {
  let w;
  let onChange = jest.fn();
  const wrapper = extras => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      categories: [],
      correctResponse: [],
      scoring: {
        weighting: {
          enabled: true,
          rules: []
        },
        partial: {
          enabled: true,
          rules: []
        }
      }
    };
    const props = { ...defaults, ...extras };
    return shallow(<Scoring {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    const callsOnChange = function() {
      const args = Array.prototype.slice.call(arguments);
      const first = args.shift();
      const startArgs = typeof first === 'string' ? [wrapper(), first] : first;
      _callsOnChange.apply(null, startArgs.concat(args));
    };

    describe('changeWeighting', () => {
      callsOnChange('changeWeighting', { enabled: false, rules: [] }, () => {
        expect(onChange).toBeCalledWith(
          expect.objectContaining({
            weighting: {
              enabled: false,
              rules: []
            }
          })
        );
      });
    });

    describe('changePartial', () => {
      callsOnChange('changePartial', { enabled: false, rules: [] }, () => {
        expect(onChange).toBeCalledWith(
          expect.objectContaining({
            partial: {
              enabled: false,
              rules: []
            }
          })
        );
      });
    });
  });
});
