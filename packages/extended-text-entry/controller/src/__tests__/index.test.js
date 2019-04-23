import { model } from '../index';
import isFunction from 'lodash/isFunction';

const q = extras =>
  Object.assign(
    {
      feedback: { type: 'default', default: 'this is default feedback' },
      width: '500px',
      height: '100px',
      mathInput: false
    },
    extras
  );

const s = extras => Object.assign({}, extras);

const e = (mode = 'gather') => ({ mode });

describe('controller', () => {
  const assert = (label, question, session, env, expected) => {
    it(label, async () => {
      const result = await model(question, session, env);
      if (isFunction(expected)) {
        expected(result);
      } else {
        expect(result).toMatchObject(expected);
      }
    });
  };

  describe('model', () => {
    describe('disabled', () => {
      assert('gather', q(), s(), e(), { disabled: false });
      assert('view', q(), s(), e('view'), { disabled: true });
      assert('evaluate', q(), s(), e('evaluate'), { disabled: true });
    });

    describe('feedback', () => {
      assert('none for gather', q(), s(), e(), { feedback: undefined });
      assert('none for view', q(), s(), e('view'), { feedback: undefined });
      assert('none for gather', q(), s(), e('evaluate'), {
        feedback: q().feedback.default
      });
    });
  });
});
