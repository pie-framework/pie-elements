import FractionModel from '..';

const component = new FractionModel();
const session = (answers) => ({
  answers,
});

describe('isSessionComplete', () => {
  const assertIsComplete = (session, model, expected) => {
    it(`${JSON.stringify(session.answers)}, ${JSON.stringify(model.allowedStudentConfig)} = ${expected}`, () => {
      const result = component.isSessionComplete(session, model);
      expect(result).toEqual(expected);
    });
  };

  assertIsComplete(session({ selection: [3,5] }), { allowedStudentConfig: false }, true);
  assertIsComplete(session({ selection: [] }), { allowedStudentConfig: false }, false);
  assertIsComplete(session({ noOfModel: 3, partsPerModel: 5, selection: [3,5] }), { allowedStudentConfig: true }, true);
  assertIsComplete(session({ noOfModel: 0, partsPerModel: 0, selection: [] }), { allowedStudentConfig: true }, false);
  // assertIsComplete(session({ 0: [false, false] }), { allowedStudentConfig: [{ id: '0' }] }, false);
  // assertIsComplete(session({ 0: [true, false] }), { allowedStudentConfig: [{ id: '1' }] }, false);
  // assertIsComplete(session({ 0: [true, false], 1: [false, true] }), { rows: [{ id: '0' }, { id: '1' }] }, true);
});
