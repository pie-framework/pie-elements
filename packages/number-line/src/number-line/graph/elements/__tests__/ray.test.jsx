import React from 'react';
import { shallow } from 'enzyme';
import _ from 'lodash';
import { assertProp, stubContext } from './utils';

import { Ray } from '../ray';
import Arrow from '../../arrow';
import Point from '../point';

jest.mock('../point', () => () => <text>Point</text>);

describe('ray', () => {
  let wrapper;

  const mkWrapper = (props, context) => {
    const onMove = jest.fn();
    const onToggleSelect = jest.fn();

    const defaults = {
      classes: {
        ray: 'ray',
        selected: 'selected',
        correct: 'correct',
        incorrect: 'incorrect'
      },
      domain: { min: 0, max: 1 },
      selected: false,
      correct: false,
      empty: false,
      direction: 'positive',
      position: 1,
      onMove: onMove,
      interval: 10,
      width: 100,
      onToggleSelect: onToggleSelect
    };

    props = _.merge(defaults, props);
    const opts = _.merge({ context: stubContext }, { context: context });
    return shallow(<Ray {...props} />, opts);
  };

  describe('init', () => {
    beforeEach(() => {
      wrapper = mkWrapper();
    });

    it('sets the className', () => {
      expect(wrapper.find('g').hasClass('ray')).toBe(true);
    });

    it('sets the transform', () => {
      const g = wrapper.find('g');
      expect(wrapper.find('g').prop('transform')).toEqual('translate(0, 0)');
    });

    describe('line', () => {
      const assert = assertProp.bind(null, () => wrapper.find('line'));

      assert('x1', 1);
      assert('x2', 92);
    });

    describe('Point', () => {
      const assert = assertProp.bind(null, () => wrapper.find(Point));
      assert('disabled', false);
      assert('correct', false);
      assert('selected', false);
      assert('empty', false);
      assert('interval', 10);
      assert('bounds', { left: -1, right: 0 });
    });
  });

  describe('className', () => {
    assertProp(
      () => mkWrapper({ selected: true }).find('g'),
      'className',
      'ray selected incorrect'
    );
    assertProp(
      () => mkWrapper({ selected: true, correct: true }).find('g'),
      'className',
      'ray selected correct'
    );
  });

  describe('Arrow.arrowDirection', () => {
    assertProp(() => mkWrapper().find(Arrow), 'direction', 'right');
    assertProp(
      () => mkWrapper({ direction: 'negative' }).find(Arrow),
      'direction',
      'left'
    );
  });

  describe('drag', () => {
    it('sets does not set state.dragPosition if position < domain.min', () => {
      wrapper.instance().drag(-5);
      expect(wrapper.state('dragPosition')).toEqual(null);
    });

    it('sets does not set state.dragPosition if position > domain.max', () => {
      wrapper.instance().drag(100);
      expect(wrapper.state('dragPosition')).toEqual(null);
    });

    it('sets state.dragPosition', () => {
      wrapper.instance().drag(0);
      expect(wrapper.state('dragPosition')).toEqual(0);
    });
  });

  describe('stopDrag', () => {
    it('sets state.dragPosition', () => {
      wrapper.instance().drag(0);
      expect(wrapper.state('dragPosition')).toEqual(0);
      wrapper.instance().stopDrag();
      expect(wrapper.state('dragPosition')).toEqual(null);
    });
  });
});
