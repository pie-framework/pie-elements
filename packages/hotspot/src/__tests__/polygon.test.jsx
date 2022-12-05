import React from 'react';
import _ from 'lodash';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Konva from 'konva';
import { Line } from 'react-konva';

import { shallowChild } from '@pie-lib/test-utils';

import Polygon from '../hotspot/polygon';
import Image from '../hotspot/image';
import { faCorrect, faWrong } from '../hotspot/icons';

Konva.isBrowser = false;

describe('Polygon', () => {
  let onClick, wrapper;

  const mkWrapper = (opts = {}) => {
    opts = _.extend(
      {
        classes: {
          base: 'base',
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
        points: [
          { x: 94, y: 4 },
          { x: 89, y: 4 },
          { x: 36, y: 40 },
        ],
      },
      opts,
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

  describe('in evaluate mode', () => {
    const defaultModel = {
      height: 200,
      hotspotColor: 'rgba(137, 183, 244, 0.65)',
      id: '1',
      isCorrect: false,
      isEvaluateMode: true,
      evaluateText: null,
      disabled: true,
      outlineColor: 'blue',
      strokeWidth: 5,
      selected: false,
      points: [
        { x: 94, y: 4 },
        { x: 89, y: 4 },
        { x: 36, y: 40 },
      ],
      markAsCorrect: false,
      showCorrectEnabled: false,
      onClick,
    };

    const getComponents = (model) => {
      const testWrapper = shallowChild(
        Polygon,
        {
          ...defaultModel,
          ...model,
        },
        1,
      );
      const polygonComponent = testWrapper();
      const lineComponent = polygonComponent.find(Line);
      return {
        polygonComponent,
        lineComponent,
      };
    };

    describe('when correctly selected', () => {
      const { polygonComponent, lineComponent } = getComponents({
        selected: true,
        isCorrect: true,
      });

      it('should have a blue outline', () => {
        expect(lineComponent.prop('stroke')).toEqual('blue');
        expect(lineComponent.prop('strokeWidth')).toEqual(defaultModel.strokeWidth);
      });

      it('should have a green checkmark icon', () => {
        const imgComponent = polygonComponent.find(Image);
        expect(imgComponent.length).toEqual(1);
        expect(imgComponent.prop('src')).toEqual(faCorrect);
      });
    });

    describe('when correctly not selected', () => {
      const { polygonComponent, lineComponent } = getComponents({
        selected: false,
        isCorrect: true,
      });

      it('should have no outline', () => {
        expect(lineComponent.prop('strokeWidth')).toEqual(0);
      });

      it('should have no icon', () => {
        const imgComponent = polygonComponent.find(Image);
        expect(imgComponent.length).toEqual(0);
      });
    });

    describe('when incorrectly selected', () => {
      const { polygonComponent, lineComponent } = getComponents({
        selected: true,
        isCorrect: false,
      });

      it('should have a red outline', () => {
        expect(lineComponent.prop('stroke')).toEqual('red');
        expect(lineComponent.prop('strokeWidth')).toEqual(defaultModel.strokeWidth);
      });

      it('should have a red x icon', () => {
        const imgComponent = polygonComponent.find(Image);
        expect(imgComponent.length).toEqual(1);
        expect(imgComponent.prop('src')).toEqual(faWrong);
      });
    });

    describe('when incorrectly not selected', () => {
      const { polygonComponent, lineComponent } = getComponents({
        selected: false,
        isCorrect: false,
      });

      it('should have no outline', () => {
        expect(lineComponent.prop('strokeWidth')).toEqual(0);
      });

      it('should have a red x icon', () => {
        const imgComponent = polygonComponent.find(Image);
        expect(imgComponent.length).toEqual(1);
        expect(imgComponent.prop('src')).toEqual(faWrong);
      });
    });

    describe('when showing correct answer (showCorrectEnabled = true)', () => {
      it('should have a green outline', () => {
        const { lineComponent } = getComponents({
          showCorrectEnabled: true,
          markAsCorrect: true,
        });
        expect(lineComponent.prop('stroke')).toEqual('green');
        expect(lineComponent.prop('strokeWidth')).toEqual(defaultModel.strokeWidth);
      });

      it('should have a green checkmark icon', () => {
        const { polygonComponent } = getComponents({
          showCorrectEnabled: true,
          markAsCorrect: true,
        });
        const imgComponent = polygonComponent.find(Image);
        expect(imgComponent.prop('src')).toEqual(faCorrect);
      });

      it('should not be selected if the answer is incorrect', () => {
        const { lineComponent } = getComponents({
          showCorrectEnabled: true,
          markAsCorrect: false,
          selected: true,
          isCorrect: false,
        });
        expect(lineComponent.prop('strokeWidth')).toEqual(0);
      });

      it('should not render an icon if the answer is incorrect', () => {
        const { polygonComponent } = getComponents({
          showCorrectEnabled: true,
          markAsCorrect: false,
          selected: true,
          isCorrect: false,
        });
        const imgComponent = polygonComponent.find(Image);
        expect(imgComponent.length).toEqual(0);
      });
    });
  });
});
