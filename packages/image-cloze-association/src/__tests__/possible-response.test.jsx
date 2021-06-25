import React from 'react';
import _ from 'lodash';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { PossibleResponse } from '../possible-response';

describe('Possible Response', () => {
  let wrapper;

  const mkWrapper = (opts = {}) => {
    opts = _.extend(
      {
        canDrag: false,
        containerStyle: {},
        data: {},
        onDragBegin: jest.fn(),
        onDragEnd: jest.fn()
      },
      opts
    );

    return shallow(<PossibleResponse {...opts} />);
  };

  beforeEach(() => {
    wrapper = mkWrapper();
  });

  describe('snapshots', () => {
    describe('canDrag', () => {
      it('renders', () => {
        const wrapper = mkWrapper({ canDrag: false });
        expect(toJson(wrapper)).toMatchSnapshot();
      });
    });

    describe('data', () => {
      it('renders', () => {
        const wrapper = mkWrapper({ data: { id: 1, value: '1', containerIndex: 0 } });
        expect(toJson(wrapper)).toMatchSnapshot();
      });
    });
  });
});
