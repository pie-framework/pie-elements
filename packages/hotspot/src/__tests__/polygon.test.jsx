import React from 'react';
import _ from 'lodash';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Konva from 'konva';
import { Line } from 'react-konva';

import { shallowChild } from '@pie-lib/test-utils';

import Polygon from '../hotspot/polygon';

Konva.isBrowser = false;

describe('Polygon', () => {
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
        evaluateText: null,
        disabled: false,
        outlineColor: 'blue',
        selected: false,
        points: [{ x: 94, y: 4 }, { x: 89, y: 4 }, { x: 36, y: 40 }]
      },
      opts
    );

    return shallow(<Polygon {...opts} onClick={onClick} />);
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
        const wrapper = mkWrapper({ isEvaluateMode: true, isCorrect: true, evaluateText: 'Correctly\nselected' });
        expect(toJson(wrapper)).toMatchSnapshot();
      });
    });
  });

  describe('when showing correct answer (markAsCorrect = true)', () => {
    let polygonComponent, lineComponent;

    const model = {
      classes: {
        base: 'base'
      },
      height: 200,
      hotspotColor: 'rgba(137, 183, 244, 0.65)',
      id: '1',
      isCorrect: false,
      isEvaluateMode: true,
      evaluateText: null,
      disabled: false,
      outlineColor: 'blue',
      selected: false,
      points: [{ x: 94, y: 4 }, { x: 89, y: 4 }, { x: 36, y: 40 }],
      markAsCorrect: true,
      onClick
    };

    const testWrapper = shallowChild(Polygon, {
      ...model
    }, 1);

    beforeEach(() => {
      polygonComponent = testWrapper();
      lineComponent = polygonComponent.find(Line);
    });

    it('is rendered with a green outline color', () => {
      expect(lineComponent.prop('stroke')).toEqual('green');
    });

    it('is rendered with an outline size > 0', () => {
      expect(lineComponent.prop('strokeWidth')).toBeGreaterThan(0);
    });
  });
});
