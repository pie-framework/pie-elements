import * as React from 'react';
import { render } from '@testing-library/react';
import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';
import { AnswerArea } from '../answer-area';
import { model, answer } from '../../docs/demo/config';

jest.mock('../arrow', () => (props) => <div data-testid="arrow" {...props} />);
jest.mock('../answer', () => (props) => <div data-testid="drag-drop-answer" {...props} />);

describe('AnswerArea', () => {
  const defaultProps = {
    model: model('1'),
    session: {},
    classes: {},
    instanceId: '1',
    disabled: false,
    showCorrect: false,
  };

  const wrapper = (props = {}) => {
    return render(<AnswerArea {...defaultProps} {...props} />);
  };

  const createInstance = (props = {}) => {
    const instanceProps = {
      ...defaultProps,
      ...props,
    };
    return new AnswerArea(instanceProps);
  };

  describe('logic', () => {
    describe('getCorrectOrIncorrectArray', () => {
      const mkTestForFn = (title, extraProps, val) => {
        it(title, () => {
          const instance = createInstance(extraProps);
          const value = instance.getCorrectOrIncorrectMap();

          expect(isObject(value)).toBe(true);
          expect(value).toEqual(val);
        });
      };

      mkTestForFn(
        'returns an empty object for modes different than evaluate',
        {
          model: model('1', {
            mode: 'gather',
          }),
        },
        {},
      );

      mkTestForFn(
        'returns an empty object for modes different than evaluate',
        {
          model: model('1', {
            mode: 'gather',
          }),
        },
        {},
      );

      mkTestForFn(
        'returns an object with appropriate values when mode is evaluate',
        {
          model: model('1', {
            mode: 'evaluate',
          }),
        },
        { 1: false, 2: false, 3: false, 4: false },
      );
      mkTestForFn(
        'returns an array with appropriate values',
        {
          model: model('1', {
            mode: 'evaluate',
          }),
          session: {
            value: { 1: 1, 3: 3, 4: 4, 2: 2 },
          },
        },
        { 1: true, 2: true, 3: true, 4: true },
      );

      mkTestForFn(
        'returns an object with true as value for each index when showCorrect is true',
        {
          model: model('1', {
            mode: 'evaluate',
          }),
          showCorrect: true,
        },
        { 1: true, 2: true, 3: true, 4: true },
      );
    });

    describe('getAnswerFromSession', () => {
      const mkTestForFn = (title, extraProps, index, val) => {
        const indexes = isArray(index) ? index : [index];
        const values = isArray(val) ? val : [val];

        it(title, () => {
          const instance = createInstance(extraProps);

          indexes.forEach((i, key) => {
            const value = instance.getAnswerFromSession(i);

            expect(value).toEqual(values[key]);
          });
        });
      };

      mkTestForFn(
        'returns an empty object for an empty session',
        {
          model: model('1', {
            mode: 'gather',
          }),
        },
        0,
        {},
      );

      mkTestForFn(
        'returns an appropriate answer for filled session',
        {
          model: model('1', {
            mode: 'gather',
          }),
          session: { value: { 1: 2, 2: 1, 3: 4, 4: 3 } },
        },
        1,
        { id: 2, title: 'Answer 2' },
      );

      mkTestForFn(
        'returns all correct values when showCorrect is true',
        {
          model: model('1', {
            mode: 'gather',
            showCorrect: true,
          }),
          session: { value: { 1: 1, 3: 3, 4: 4, 2: 2 } },
        },
        [1, 2, 3, 4],
        [answer(1), answer(2), answer(3), answer(4)],
      );
    });
  });
});
