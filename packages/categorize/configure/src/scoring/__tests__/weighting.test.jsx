import { shallow } from 'enzyme';
import React from 'react';

import { Weighting } from '../weighting';
import { callsOnChange as _callsOnChange } from '../../__tests__/utils';

describe('Weighting', () => {
  let w;
  let onChange = jest.fn();
  const wrapper = extras => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      categories: [{ id: '1', label: 'Content' }],
      weighting: {
        enabled: true,
        rules: [{ category: '1', points: 1 }]
      }
    };
    const props = { ...defaults, ...extras };
    return shallow(<Weighting {...props} />);
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
      const startArgs =
        typeof first === 'string' ? [wrapper(), first] : [first];

      _callsOnChange.apply(null, startArgs.concat(args));
    };

    describe('toggleEnabled', () => {
      callsOnChange('toggleEnabled', () => {
        expect(onChange).toBeCalledWith(
          expect.objectContaining({ enabled: false })
        );
      });
      callsOnChange(
        wrapper({ weighting: { enabled: false, rules: [] } }),
        'toggleEnabled',
        () => {
          expect(onChange).toBeCalledWith(
            expect.objectContaining({ enabled: true })
          );
        }
      );
    });

    describe('changeRule', () => {
      callsOnChange('changeRule', { category: '1', points: 2 }, () => {
        expect(onChange).toBeCalledWith(
          expect.objectContaining({
            rules: [
              {
                category: '1',
                points: 2
              }
            ]
          })
        );
      });
    });

    describe('getPercent', () => {
      it('returns the percent', () => {
        const result = wrapper()
          .instance()
          .getPercent({ points: 1 }, [{ points: 1 }, { points: 1 }]);
        expect(result).toEqual('50');
      });
    });
  });
});
