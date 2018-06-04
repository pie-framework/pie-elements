import { shallow } from 'enzyme';
import React from 'react';
import { Partial } from '../partial';
import { callsOnChange as _callsOnChange } from '../../__tests__/utils';

describe('Partial', () => {
  let w;
  let onChange = jest.fn();
  const wrapper = extras => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      partial: {
        enabled: true,
        rules: [{ count: 1, percent: 20 }]
      },
      categories: [],
      correctResponse: []
    };
    const props = { ...defaults, ...extras };
    return shallow(<Partial {...props} />);
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
      callsOnChange(
        wrapper({ partial: { enabled: false } }),
        'toggleEnabled',
        () => {
          expect(onChange).toBeCalledWith(
            expect.objectContaining({ enabled: true })
          );
        }
      );

      callsOnChange('toggleEnabled', () => {
        expect(onChange).toBeCalledWith(
          expect.objectContaining({ enabled: false })
        );
      });
    });

    describe('changeInnerPartial', () => {
      callsOnChange('changeInnerPartial', { count: 1, percent: 10 }, () => {
        expect(onChange).toBeCalledWith(
          expect.objectContaining({ rules: [{ count: 1, percent: 10 }] })
        );
      });
    });
  });
});
