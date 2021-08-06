import React from 'react';
import _ from 'lodash';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Konva from 'konva';

import Rectangle from '../hotspot/rectangle';

Konva.isBrowser = false;

describe('Rectangle', () => {
  let onClick, wrapper;

  const mkWrapper = (opts = {}) => {
    opts = _.extend(
      {
        classes: {
          base: 'base'
        },
        height: 200,
        hotspotColor: 'rgba(137, 183, 244, 0.65)',
        id: '1',
        isCorrect: false,
        isEvaluateMode: false,
        disabled: false,
        outlineColor: 'blue',
        selected: false,
        width: 300,
        x: 5,
        y: 5
      },
      opts
    );

    return shallow(<Rectangle {...opts} onClick={onClick} />);
  };

  beforeEach(() => {
    onClick = jest.fn();
    wrapper = mkWrapper();
  });

  describe('snapshots', () => {
    describe('outline color', () => {
      it('renders', () => {
        const wrapper = mkWrapper({ outlineColor: 'red' });
        expect(toJson(wrapper)).toMatchSnapshot();
      });
    });

    describe('outline width', () => {
      it('renders with default border width', () => {
        const wrapper = mkWrapper();
        expect(toJson(wrapper)).toMatchSnapshot();
      });

      it('renders with given border width', () => {
        const wrapper = mkWrapper({ strokeWidth: 10 });
        expect(toJson(wrapper)).toMatchSnapshot();
      });
    });

    describe('hotspot color', () => {
      it('renders', () => {
        const wrapper = mkWrapper({ hotspotColor: 'rgba(217, 30, 24, 0.65)' });
        expect(toJson(wrapper)).toMatchSnapshot();
      });
    });

    describe('evaluate with correct answer', () => {
      it('renders', () => {
        const wrapper = mkWrapper({ isEvaluateMode: true, isCorrect: true });
        expect(toJson(wrapper)).toMatchSnapshot();
      });
    });
  });
});
