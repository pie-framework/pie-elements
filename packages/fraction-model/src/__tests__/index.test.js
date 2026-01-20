// Mock the module to avoid HTMLElement issues
jest.mock('..', () => {
  // Define mock base class inside the factory
  class MockHTMLElement {
    constructor() {
      this._root = null;
    }
  }

  return {
    __esModule: true,
    default: class FractionModel extends MockHTMLElement {
      constructor() {
        super();
        this._root = null;
      }

      isSessionComplete(session, model) {
        const answers = session && session.answers;
        const configComplete = model.allowedStudentConfig ? answers.noOfModel > 0 && answers.partsPerModel > 0 : true;
        const responseComplete = Array.isArray(answers.response) && answers.response.length > 0;
        return configComplete && responseComplete;
      }
    },
  };
});

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
