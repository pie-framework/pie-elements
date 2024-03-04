import { isComplete } from '../index';

const session = (answers) => ({
  answers,
});

describe('isComplete', () => {
  const assertIsComplete = (session, model, expected) => {
    it(`${JSON.stringify(session.answers)}, ${JSON.stringify(model.rows)} = ${expected}`, () => {
      const result = isComplete(session, model);
      expect(result).toEqual(expected);
    });
  };

  assertIsComplete(session({ 0: [true, false] }), { rows: [{ id: '0' }] }, true);
  assertIsComplete(session({ 0: [false, false] }), { rows: [{ id: '0' }] }, false);
  assertIsComplete(session({ 0: [true, false] }), { rows: [{ id: '1' }] }, false);
  assertIsComplete(session({ 0: [true, false], 1: [false, true] }), { rows: [{ id: '0' }, { id: '1' }] }, true);
});
