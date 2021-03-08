import React from 'react';
import _ from 'lodash';
import { shallow } from 'enzyme';
import DrawingResponse from '../drawing-response';
import toJson from 'enzyme-to-json';

describe('DrawingResponse', () => {
  let wrapper;

  const mkWrapper = (opts = {}) => {
    opts = _.extend(
      {
        model: {
          disabled: false,
          imageDimensions: {
            height: 0,
            width: 0
          },
          imageUrl: '',
          mode: 'gather',
          prompt: 'This is the question prompt'
        }
      },
      opts
    );

    return shallow(<DrawingResponse {...opts} />);
  };

  beforeEach(() => {
    wrapper = mkWrapper();
  });

  describe('snapshots', () => {
    it('renders', () => {
      const wrapper = mkWrapper();
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });
});
