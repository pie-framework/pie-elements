import React from 'react';
import _ from 'lodash';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Konva from 'konva';
import { Rect } from 'react-konva';

import { shallowChild } from '@pie-lib/pie-toolbox/test-utils';

import Rectangle from '../hotspot/rectangle';
import ImageComponent from '../hotspot/image-konva-tooltip';
import { faCorrect, faWrong } from '../hotspot/icons';

global.MutationObserver = class {
  constructor(callback) {}
  disconnect() {}
  observe(element, initObject) {}
};

Konva.isBrowser = false;

describe('Rectangle', () => {
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
        width: 300,
        x: 5,
        y: 5,
      },
      opts,
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
        const wrapper = mkWrapper({ isEvaluateMode: true, isCorrect: true, evaluateText: 'Correctly\nselected' });
        expect(toJson(wrapper)).toMatchSnapshot();
      });
    });
  });

  describe('in evaluate mode', () => {
    const defaultModel = {
      onClick,
      id: '1',
      height: 200,
      hotspotColor: 'rgba(137, 183, 244, 0.65)',
      disabled: true,
      width: 300,
      x: 5,
      y: 5,
      selected: false,
      isCorrect: false,
      isEvaluateMode: true,
      evaluateText: null,
      strokeWidth: 5,
      outlineColor: 'blue',
      markAsCorrect: false,
      showCorrectEnabled: false,
    };

    const getComponents = (model) => {
      const testWrapper = shallowChild(
        Rectangle,
        {
          ...defaultModel,
          ...model,
        },
        1,
      );
      const rectangleComponent = testWrapper();
      const rectComponent = rectangleComponent.find(Rect);
      return {
        rectangleComponent,
        rectComponent,
      };
    };

    describe('when correctly selected', () => {
      const { rectangleComponent, rectComponent } = getComponents({
        selected: true,
        isCorrect: true,
      });

      it('should have a blue outline', () => {
        expect(rectComponent.prop('stroke')).toEqual('blue');
        expect(rectComponent.prop('strokeWidth')).toEqual(defaultModel.strokeWidth);
      });

      it('should have a green checkmark icon', () => {
        const imgComponent = rectangleComponent.find(ImageComponent);
        expect(imgComponent.length).toEqual(1);
        expect(imgComponent.prop('src')).toEqual(faCorrect);
      });
    });

    describe('when correctly not selected', () => {
      const { rectangleComponent, rectComponent } = getComponents({
        selected: false,
        isCorrect: true,
      });

      it('should have no outline', () => {
        expect(rectComponent.prop('strokeWidth')).toEqual(0);
      });

      it('should have no icon', () => {
        const imgComponent = rectangleComponent.find(ImageComponent);
        expect(imgComponent.length).toEqual(0);
      });
    });

    describe('when incorrectly selected', () => {
      const { rectangleComponent, rectComponent } = getComponents({
        selected: true,
        isCorrect: false,
      });

      it('should have a red outline', () => {
        expect(rectComponent.prop('stroke')).toEqual('red');
        expect(rectComponent.prop('strokeWidth')).toEqual(defaultModel.strokeWidth);
      });

      it('should have a red x icon', () => {
        const imgComponent = rectangleComponent.find(ImageComponent);
        expect(imgComponent.length).toEqual(1);
        expect(imgComponent.prop('src')).toEqual(faWrong);
      });
    });

    describe('when incorrectly not selected', () => {
      const { rectangleComponent, rectComponent } = getComponents({
        selected: false,
        isCorrect: false,
      });

      it('should have no outline', () => {
        expect(rectComponent.prop('strokeWidth')).toEqual(0);
      });

      it('should have a red x icon', () => {
        const imgComponent = rectangleComponent.find(ImageComponent);
        expect(imgComponent.length).toEqual(1);
        expect(imgComponent.prop('src')).toEqual(faWrong);
      });
    });

    describe('when showing correct answer (showCorrectEnabled = true)', () => {
      it('should have a green outline', () => {
        const { rectComponent } = getComponents({
          showCorrectEnabled: true,
          markAsCorrect: true,
        });
        expect(rectComponent.prop('stroke')).toEqual('green');
        expect(rectComponent.prop('strokeWidth')).toEqual(defaultModel.strokeWidth);
      });

      it('should have a green checkmark icon', () => {
        const { rectangleComponent } = getComponents({
          showCorrectEnabled: true,
          markAsCorrect: true,
        });
        const imgComponent = rectangleComponent.find(ImageComponent);
        expect(imgComponent.prop('src')).toEqual(faCorrect);
      });

      it('should not be selected if the answer is incorrect', () => {
        const { rectComponent } = getComponents({
          showCorrectEnabled: true,
          markAsCorrect: false,
          selected: true,
          isCorrect: false,
        });
        expect(rectComponent.prop('strokeWidth')).toEqual(0);
      });

      it('should not render an icon if the answer is incorrect', () => {
        const { rectangleComponent } = getComponents({
          showCorrectEnabled: true,
          markAsCorrect: false,
          selected: true,
          isCorrect: false,
        });
        const imgComponent = rectangleComponent.find(ImageComponent);
        expect(imgComponent.length).toEqual(0);
      });
    });
  });
});
