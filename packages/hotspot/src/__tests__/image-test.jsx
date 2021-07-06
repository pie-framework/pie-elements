import React from 'react';
import _ from 'lodash';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Konva from 'konva';

import Image from '../hotspot/image';

Konva.isBrowser = false;

describe('Image', () => {
  let wrapper;

  const mkWrapper = (opts = {}) => {
    opts = _.extend(
      {
        x: 5,
        y: 5,
        src: '',
        tooltip: null
      },
      opts
    );

    return shallow(<Image {...opts} />);
  };

  beforeEach(() => {
    wrapper = mkWrapper();
  });

  describe('snapshots', () => {
    describe('x y position', () => {
      it('renders', () => {
        const wrapper = mkWrapper({ x: 10, y: 10 });
        expect(toJson(wrapper)).toMatchSnapshot();
      });
    });

    describe('image', () => {
      it('renders', () => {
        const wrapper = mkWrapper({ src: 'https://picsum.photos/id/102/200/300' });
        expect(toJson(wrapper)).toMatchSnapshot();
      });
    });

    describe('tooltip', () => {
      it('renders', () => {
        const wrapper = mkWrapper({ tooltip: 'Correctly\nselected' });
        expect(toJson(wrapper)).toMatchSnapshot();
      });
    });
  });
});
