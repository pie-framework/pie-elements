import { isComplete } from '../index';
const session = value => ({
  value
});

describe('isComplete', () => {
  const assertIsComplete = (session, model, expected) => {
    it(`${JSON.stringify(session.value)}, ${JSON.stringify(
      model.config.prompts
    )} = ${expected}`, () => {
      const result = isComplete(session, model);
      expect(result).toEqual(expected);
    });
  };

  const testModel = {
    config: {
      prompts: [
        {
          id: 3,
          title: 'Prompt 3',
          relatedAnswer: 3
        },
        {
          id: 1,
          title: 'Prompt 1',
          relatedAnswer: 1
        },
        {
          id: 4,
          title: 'Prompt 4',
          relatedAnswer: 4
        },
        {
          id: 2,
          title: 'Prompt 2',
          relatedAnswer: 2
        }
      ]
    }
  };

  assertIsComplete(
    session({
      1: 1,
      2: 2,
      3: 3,
      4: 4
    }),
    testModel,
    true
  );
  assertIsComplete(
    session({
      1: 1,
      2: 2,
      3: 3,
      4: undefined
    }),
    testModel,
    false
  );

  assertIsComplete(
    session({
      1: 1,
      2: 2,
      3: 3
    }),
    testModel,
    false
  );
  assertIsComplete(
    session({
      1: 3,
      2: 1,
      3: 4,
      4: 2
    }),
    testModel,
    true
  );

  assertIsComplete(
    session({
      1: 3,
      2: 1,
      3: 4,
      4: 2,
      5: 5
    }),
    testModel,
    true
  );

  assertIsComplete(
    session({
      0: 2,
      1: 1,
      2: 3,
      3: 3,
      4: 0
    }),
    testModel,
    true
  );

  assertIsComplete(
    session({
      0: 2,
      1: undefined,
      2: 3,
      3: 3,
      4: 0
    }),
    testModel,
    false
  );
});
