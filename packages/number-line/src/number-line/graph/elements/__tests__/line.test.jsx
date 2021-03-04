import React from 'react';
import { shallow } from 'enzyme';
import _ from 'lodash';
import { assertProp, stubContext } from './utils';
import Draggable from '../../../../draggable';

import { Line } from '../line';
import Point from '../point';

jest.mock('../point', () => () => <text>Point</text>);

describe('line', () => {
  const mkWrapper = (props, context) => {
    const onMoveLine = jest.fn();
    const onToggleSelect = jest.fn();
    const onDragStart = jest.fn();
    const onDragStop = jest.fn();

    const defaults = {
      classes: {
        line: 'line',
        selected: 'selected',
        correct: 'correct',
        incorrect: 'incorrect'
      },
      domain: {
        min: 0,
        max: 10
      },
      empty: {
        left: true,
        right: false
      },
      position: {
        left: 2,
        right: 3
      },
      y: 0,
      selected: false,
      disabled: false,
      correct: false,
      interval: 10,
      onMoveLine,
      onToggleSelect,
      onDragStart,
      onDragStop
    };

    props = _.merge(defaults, props);
    const opts = _.merge({ context: stubContext }, { context: context });
    const out = shallow(<Line {...props} />, opts);
    return out;
  };

  describe('className', () => {
    const f = opts => () =>
      mkWrapper(opts)
        .find('g')
        .first();
    assertProp(f({ selected: true }), 'className', 'line selected incorrect');
    assertProp(f({ selected: false }), 'className', 'line incorrect');
    assertProp(
      f({ selected: true, correct: true }),
      'className',
      'line selected correct'
    );
  });

  let w;
  describe('onMove', () => {
    beforeEach(() => {
      w = mkWrapper();
    });

    describe('left', () => {
      beforeEach(() => {
        w
          .find(Point)
          .first()
          .prop('onMove')(1);
      });

      it('calls onMoveLine callback', () => {
        expect(w.instance().props.onMoveLine).toBeCalledWith({
          left: 1,
          right: 3
        });
      });
    });

    describe('right', () => {
      beforeEach(() => {
        w
          .find(Point)
          .get(1)
          .props.onMove(4);
      });

      it('calls onMoveLine callback', () => {
        expect(w.instance().props.onMoveLine).toBeCalledWith({
          left: 2,
          right: 4
        });
      });
    });

    describe('line', () => {
      beforeEach(() => {
        w.find(Draggable).prop('onStop')({ clientX: 0 }, { lastX: 2 });
      });

      it('calls onMoveLine callback', () => {
        expect(w.instance().props.onMoveLine).toBeCalledWith({
          left: 4,
          right: 5
        });
      });
    });
  });

  describe('onToggleSelect', () => {
    beforeEach(() => {
      w = mkWrapper();
      w
        .find('rect')
        .props()
        .onClick();
    });

    it('calls onToggleSelect callback', () => {
      expect(w.instance().props.onToggleSelect).toBeCalled();
    });
  });

  describe('onDrag', () => {
    beforeEach(() => {
      w = mkWrapper();
      w.instance().onDrag('left', 0);
    });

    xit('sets drag state', () => {
      w.state('left', 0);
    });
  });
});
