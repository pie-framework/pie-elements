import { isResponseCorrect } from '../utils';

describe('utils', () => {

  describe('isResponseCorrect', () => {
    const question = {
      choices: {
        0: [
          { label: "Jumped", value: "Jumped", correct: true },
          { label: "Climbed", value: "Climbed", correct: false },
          { label: "Flew", value: "Flew", correct: false }
        ],
        1: [
          { label: "Laughed", value: "Laughed", correct: true },
          { label: "Cried", value: "Cried", correct: false },
          { label: "Sang", value: "Sang", correct: false }
        ]
      }
    };
    const createTestForFn = (params, val, extra) => it(`should return ${val} for${extra}`, () => {
      expect(isResponseCorrect.apply({}, params)).toEqual(val);
    });

    createTestForFn([undefined, undefined], false, ' undefined model or session');

    createTestForFn([{}, { value: undefined }], false, ' undefined value in session');

    createTestForFn([question, { value: { 0: "Climbed", 1: "Sang" } }], false, ' wrong answer');

    createTestForFn([question, { value: { 0: "Jumped", 1: "Sang" } }], false, ' partial correct answer');

    createTestForFn([question, { value: { 0: "Jumped", 1: "Laughed" } }], true, ' correct answer');

  })
});
