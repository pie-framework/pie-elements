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

  assertIsComplete(
    session({
      response: [
        { id: 1, value: 5 },
        { id: 1, value: 3 },
      ],
    }),
    { allowedStudentConfig: false },
    true,
  );
  assertIsComplete(session({ response: [] }), { allowedStudentConfig: false }, false);
  assertIsComplete(
    session({
      noOfModel: 3,
      partsPerModel: 5,
      response: [
        { id: 1, value: 5 },
        { id: 1, value: 3 },
      ],
    }),
    { allowedStudentConfig: true },
    true,
  );
  assertIsComplete(session({ noOfModel: 0, partsPerModel: 0, response: [] }), { allowedStudentConfig: true }, false);
});
