import React from 'react';
import { shallow } from 'enzyme';
import _ from 'lodash';
import { assertProp, stubContext } from './utils';
import Draggable from '../../../../draggable';
import { Point } from '../point';
describe('point', () => {
  let w;

  const mkWrapper = (props, context) => {
    const onMove = jest.fn();
    const onClick = jest.fn();
    const onDragStart = jest.fn();
    const onDragStop = jest.fn();
    const onDrag = jest.fn();

    const defaults = {
      classes: {
        point: 'point',
        selected: 'selected',
        correct: 'correct',
        incorrect: 'incorrect',
        empty: 'empty'
      },
      interval: 10,
      position: 1,
      bounds: {
        left: -1,
        right: 9
      },
      selected: false,
      disabled: false,
      correct: false,
      empty: false,
      y: 0,
      onMove,
      onClick,
      onDragStart,
      onDragStop,
      onDrag
    };

    props = _.merge(defaults, props);
    const opts = _.merge({ context: stubContext }, { context: context });
    return shallow(<Point {...props} />, opts);
  };

  describe('className', () => {
    const f = opts => () => mkWrapper(opts).find('circle');

    assertProp(f({ selected: true }), 'className', 'point selected incorrect');
    assertProp(f({ selected: false }), 'className', 'point incorrect');
    assertProp(
      f({ selected: true, correct: true }),
      'className',
      'point selected correct'
    );
    assertProp(
      f({ empty: true, selected: true, correct: true }),
      'className',
      'point selected correct empty'
    );
  });

  describe('Draggable', () => {
    const f = opts => () => mkWrapper(opts).find(Draggable);
    assertProp(f(), 'axis', 'x');
    assertProp(f(), 'grid', [10]);
    assertProp(f(), 'bounds', { left: -1, right: 9 });

    describe('onStart', () => {
      beforeEach(() => {
        w = mkWrapper();
        w.find(Draggable).prop('onStart')({ clientX: 0 });
      });

      it('sets state.startX', () => {
        expect(w.state('startX')).toEqual(0);
      });

      it('calls onDragStart callback', () => {
        expect(w.instance().props.onDragStart).toBeCalled();
      });
    });

    describe('onStop', () => {
      beforeEach(() => {
        w = mkWrapper({ position: 1 });
        w.setState({ startX: 0 });
        w.find(Draggable).prop('onStop')({ clientX: 100 }, { lastX: 100 });
      });

      it('calls onDragStop callback', () => {
        expect(w.instance().props.onDragStop).toBeCalled();
      });

      it('calls onMove callback', () => {
        expect(w.instance().props.onMove).toBeCalledWith(101);
      });
    });

    describe('onDrag', () => {
      beforeEach(() => {
        w = mkWrapper();
        w.find(Draggable).prop('onDrag')({}, { x: 10 });
      });

      it('calls onDrag callback', () => {
        expect(w.instance().props.onDrag).toBeCalledWith(11);
      });
    });
  });
});
