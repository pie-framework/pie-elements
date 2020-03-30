import {
  setCorrectness,
  checkLabelsEquality,
  filterCategories,
  getScore,
  createCorrectResponseSession,
  outcome,
  model
} from '../index';

describe('setCorrectness', () => {
  it('sets correctness on answers for partial scoring: incorrect', () => {
    const corectnessAnswers = setCorrectness([
      { value: 0, label: 'A' },
      { value: 1, label: 'B' },
      { value: 2, label: 'C' }
    ], true);

    expect(corectnessAnswers).toEqual([
      { value: 0, label: 'A', correctness: { value: 'incorrect', label: 'incorrect' } },
      { value: 1, label: 'B', correctness: { value: 'incorrect', label: 'incorrect' } },
      { value: 2, label: 'C', correctness: { value: 'incorrect', label: 'incorrect' } }
    ]);
  });

  it('sets correctness on answers for all or nothing: correct', () => {
    const corectnessAnswers = setCorrectness([
      { value: 0, label: 'A' },
      { value: 1, label: 'B' },
      { value: 2, label: 'C' }
    ]);

    expect(corectnessAnswers).toEqual([
      { value: 0, label: 'A', correctness: { value: 'correct', label: 'correct' } },
      { value: 1, label: 'B', correctness: { value: 'correct', label: 'correct' } },
      { value: 2, label: 'C', correctness: { value: 'correct', label: 'correct' } }
    ]);
  });

  it('sets correctness on answers if answers not set', () => {
    expect(setCorrectness([])).toEqual([]);
    expect(setCorrectness()).toEqual([]);
  });
});

describe('checkLabelsEquality', () => {
  it('returns equality between labels', () => {
    expect(checkLabelsEquality('label', 'Label')).toEqual(true);
    expect(checkLabelsEquality('label', 'LABEL')).toEqual(true);
    expect(checkLabelsEquality('label', 'lAbEl')).toEqual(true);
    expect(checkLabelsEquality('label', 'Test')).toEqual(false);
    expect(checkLabelsEquality('label', 'Test')).not.toEqual(true);
  });
});

describe('filterCategories', () => {
  it('returns categories filtered with correct values', () => {
    expect(filterCategories(null, true)).toEqual([]);
    expect(filterCategories([
      { value: 0, label: 'A', interactive: true },
      { value: 1, label: 'B', interactive: true },
      { value: 2, label: 'C', interactive: true }
    ], true)).toEqual([
      { value: 0, label: 'A', interactive: true, deletable: false, initial: true, editable: true },
      { value: 1, label: 'B', interactive: true, deletable: false, initial: true, editable: true },
      { value: 2, label: 'C', interactive: true, deletable: false, initial: true, editable: true }
    ]);
    expect(filterCategories([
      { value: 0, label: 'A', interactive: true },
      { value: 1, label: 'B', interactive: true },
      { value: 2, label: 'C', interactive: true }
    ], false)).toEqual([
      { value: 0, label: 'A', interactive: true, deletable: false, initial: true, editable: false },
      { value: 1, label: 'B', interactive: true, deletable: false, initial: true, editable: false },
      { value: 2, label: 'C', interactive: true, deletable: false, initial: true, editable: false }
    ]);
  });
});

describe('getScore partialScoring test', () => {
  const editCategoryEnabled = true;
  const mkQuestion = extras => ({
    scoringType: 'all or nothing',
    correctAnswer: {
      data: [
        { label: 'A', value: 0 },
        { label: 'B', value: 1 },
        { label: 'C', value: 2 },
      ]
    },
    data: [],
    editCategoryEnabled,
    ...extras
  });

  const assertGetScore = (message, question, session, env, expected) => {
    it(message, () => {
      expect(getScore(question, session, env)).toEqual(expect.objectContaining(expected));
    });
  };

  assertGetScore(
    'element.partialScoring = true',
    mkQuestion({ scoringType: 'partial scoring' }),
    {
      answer: filterCategories(
        [
          { label: 'A', value: 0 },
          { label: 'C', value: 2 },
        ],
        editCategoryEnabled
      )
    },
    { mode: 'evaluate' },
    { score: 0.33 }
  );

  assertGetScore(
    'element.partialScoring = false',
    mkQuestion(),
    {
      answer: filterCategories(
        [
          { label: 'A', value: 0 },
          { label: 'C', value: 2 },
        ],
        editCategoryEnabled
      )
    },
    { mode: 'evaluate' },
    { score: 0 }
  );

  assertGetScore(
    'element.partialScoring = false, env.partialScoring = true',
    mkQuestion(),
    {
      answer: filterCategories(
        [
          { label: 'A', value: 0 },
          { label: 'C', value: 2 },
        ],
        editCategoryEnabled
      )
    },
    { mode: 'evaluate', partialScoring: true },
    { score: 0.33 }
  );

  assertGetScore(
    'element.partialScoring = true, env.partialScoring = false',
    mkQuestion({ scoringType: 'partial scoring' }),
    {
      answer: filterCategories(
        [
          { label: 'A', value: 0 },
          { label: 'C', value: 2 },
        ],
        editCategoryEnabled
      )
    },
    { mode: 'evaluate', partialScoring: false },
    { score: 0 }
  );
});

describe('getScore all or nothing', () => {
  const scoringType = 'all or nothing';
  const editCategoryEnabled = true;
  const question = {
    correctAnswer: {
      data: [
        { label: 'A', value: 0 },
        { label: 'B', value: 1 },
        { label: 'C', value: 2 },
      ]
    },
    data: [],
    scoringType,
    editCategoryEnabled
  };

  const assertGetScore = (message, session, expected) => {
    it(message, () => {
      expect(getScore(question, session)).toEqual(expected);
    });
  };

  assertGetScore(
    'response is correct',
    {
      answer: filterCategories(
        [
          { label: 'A', value: 0 },
          { label: 'B', value: 1 },
          { label: 'C', value: 2 },
        ],
        editCategoryEnabled
      )
    },
    {
      score: 1,
      answers: filterCategories(
        [
          { label: 'A', value: 0, correctness: { value: 'correct', label: 'correct' } },
          { label: 'B', value: 1, correctness: { value: 'correct', label: 'correct' } },
          { label: 'C', value: 2, correctness: { value: 'correct', label: 'correct' } },
        ],
        editCategoryEnabled
      )
    }
  );

  assertGetScore(
    'response is incorrect: incorrect value',
    {
      answer: filterCategories(
        [
          { label: 'A', value: 0 },
          { label: 'B', value: 2 },
          { label: 'C', value: 2 },
        ],
        editCategoryEnabled
      )
    },
    {
      score: 0,
      answers: filterCategories(
        [
          { label: 'A', value: 0, correctness: { value: 'correct', label: 'correct' } },
          { label: 'B', value: 2, correctness: { value: 'incorrect', label: 'correct' } },
          { label: 'C', value: 2, correctness: { value: 'correct', label: 'correct' } },
        ],
        editCategoryEnabled
      )
    }
  );

  assertGetScore(
    'response is incorrect: incorrect label',
    {
      answer: filterCategories(
        [
          { label: 'A', value: 0 },
          { label: 'D', value: 1 },
          { label: 'C', value: 2 },
        ],
        editCategoryEnabled
      )
    },
    {
      score: 0,
      answers: filterCategories(
        [
          { label: 'A', value: 0, correctness: { value: 'correct', label: 'correct' } },
          { label: 'D', value: 1, correctness: { value: 'correct', label: 'incorrect' } },
          { label: 'C', value: 2, correctness: { value: 'correct', label: 'correct' } },
        ],
        editCategoryEnabled
      )
    }
  );

  assertGetScore(
    'response is incorrect: incorrect value & label',
    {
      answer: filterCategories(
        [
          { label: 'A', value: 0 },
          { label: 'D', value: 2 },
          { label: 'C', value: 2 },
        ],
        editCategoryEnabled
      )
    },
    {
      score: 0,
      answers: filterCategories(
        [
          { label: 'A', value: 0, correctness: { value: 'correct', label: 'correct' } },
          { label: 'D', value: 2, correctness: { value: 'incorrect', label: 'incorrect' } },
          { label: 'C', value: 2, correctness: { value: 'correct', label: 'correct' } },
        ],
        editCategoryEnabled
      )
    }
  );

  assertGetScore(
    'response is incorrect: more categories in given answer',
    {
      answer: filterCategories(
        [
          { label: 'A', value: 0 },
          { label: 'B', value: 1 },
          { label: 'C', value: 2 },
          { label: 'D', value: 3 },
        ],
        editCategoryEnabled
      )
    },
    {
      score: 0,
      answers: filterCategories(
        [
          { label: 'A', value: 0, correctness: { value: 'correct', label: 'correct' } },
          { label: 'B', value: 1, correctness: { value: 'correct', label: 'correct' } },
          { label: 'C', value: 2, correctness: { value: 'correct', label: 'correct' } },
          { label: 'D', value: 3, correctness: { value: 'incorrect', label: 'incorrect' } },
        ],
        editCategoryEnabled
      )
    }
  );

  assertGetScore(
    'response is incorrect: less categories in given answer',
    {
      answer: filterCategories(
        [
          { label: 'A', value: 0 },
          { label: 'B', value: 1 },
        ],
        editCategoryEnabled
      )
    },
    {
      score: 0,
      answers: filterCategories(
        [
          { label: 'A', value: 0, correctness: { value: 'correct', label: 'correct' } },
          { label: 'B', value: 1, correctness: { value: 'correct', label: 'correct' } },
        ],
        editCategoryEnabled
      )
    }
  );

  assertGetScore(
    'session is undefined',
    undefined,
    { score: 0, answers: [] }
  );

  assertGetScore(
    'session is null',
    null,
    { score: 0, answers: [] }
  );

  assertGetScore(
    'session is empty',
    {},
    { score: 0, answers: [] }
  );
});

describe('getScore partial scoring - editable - interactive', () => {
  const scoringType = 'partial scoring';
  const editCategoryEnabled = true;
  const question = {
    correctAnswer: {
      data: [
        { label: 'A', value: 0 },
        { label: 'B', value: 1 },
        { label: 'C', value: 2 },
      ]
    },
    data: filterCategories(
      [
        { label: 'A', value: 0, interactive: true },
        { label: 'B', value: 1, interactive: true },
      ],
      editCategoryEnabled
    ),
    scoringType,
    editCategoryEnabled
  };

  const assertGetScore = (message, questionExtra, session, expected) => {
    it(message, () => {
      expect(getScore({ ...question, ...questionExtra }, session)).toEqual(expected);
    });
  };

  assertGetScore(
    'Answer is default answer, 4/6 correct answers',
    {},
    {},
    {
      score: 0.67,
      answers: filterCategories(
        [
          { label: 'A', value: 0, interactive: true, correctness: { value: 'correct', label: 'correct' } },
          { label: 'B', value: 1, interactive: true, correctness: { value: 'correct', label: 'correct' } },
        ],
        editCategoryEnabled
      )
    }
  );

  assertGetScore(
    '5/6 correct answers',
    {},
    {
      answer: filterCategories(
        [
          { label: 'A', value: 0, interactive: true },
          { label: 'B', value: 1, interactive: true },
          { label: 'C', value: 1, interactive: true },
        ],
        editCategoryEnabled
      )
    },
    {
      score: 0.83,
      answers: filterCategories(
        [
          { label: 'A', value: 0, interactive: true, correctness: { value: 'correct', label: 'correct' } },
          { label: 'B', value: 1, interactive: true, correctness: { value: 'correct', label: 'correct' } },
          { label: 'C', value: 1, interactive: true, correctness: { value: 'incorrect', label: 'correct' } },
        ],
        editCategoryEnabled
      )
    }
  );

  assertGetScore(
    'Default answer edited with incorrect answer, 4/6 correct answers',
    {},
    {
      answer: filterCategories(
        [
          { label: 'A', value: 0, interactive: true },
          { label: 'D', value: 1, interactive: true },
          { label: 'C', value: 1, interactive: true },
        ],
        editCategoryEnabled
      )
    },
    {
      score: 0.67,
      answers: filterCategories(
        [
          { label: 'A', value: 0, interactive: true, correctness: { value: 'correct', label: 'correct' } },
          { label: 'D', value: 1, interactive: true, correctness: { value: 'correct', label: 'incorrect' } },
          { label: 'C', value: 1, interactive: true, correctness: { value: 'incorrect', label: 'correct' } },
        ],
        editCategoryEnabled
      )
    }
  );

  assertGetScore(
    'Default answer was incorrect and edited, 4/6 correct answers',
    {
      data: filterCategories(
        [
          { label: 'A-wrong', value: 0, interactive: true },
          { label: 'B', value: 1, interactive: true },
        ],
        editCategoryEnabled
      )
    },
    {
      answer: filterCategories(
        [
          { label: 'A', value: 0, interactive: true },
          { label: 'B', value: 1, interactive: true },
          { label: 'C', value: 2, interactive: true },
        ],
        editCategoryEnabled
      )
    },
    {
      score: 1,
      answers: filterCategories(
        [
          { label: 'A', value: 0, interactive: true, correctness: { value: 'correct', label: 'correct' } },
          { label: 'B', value: 1, interactive: true, correctness: { value: 'correct', label: 'correct' } },
          { label: 'C', value: 2, interactive: true, correctness: { value: 'correct', label: 'correct' } },
        ],
        editCategoryEnabled
      )
    }
  );
});

describe('getScore partial scoring - NOT editable - interactive', () => {
  const scoringType = 'partial scoring';
  const editCategoryEnabled = false;
  const question = {
    correctAnswer: {
      data: [
        { label: 'A', value: 0 },
        { label: 'B', value: 1 },
        { label: 'C', value: 2 },
      ]
    },
    data: filterCategories(
      [
        { label: 'A', value: 0, interactive: true },
        { label: 'B', value: 1, interactive: true },
      ],
      editCategoryEnabled
    ),
    scoringType,
    editCategoryEnabled
  };

  const assertGetScore = (message, questionExtra, session, expected) => {
    it(message, () => {
      expect(getScore({ ...question, ...questionExtra }, session)).toEqual(expected);
    });
  };

  assertGetScore(
    'Answer is default answer, 2/4 correct answers (3 values + 1 label)',
    {},
    {},
    {
      score: 0.5,
      answers: filterCategories(
        [
          { label: 'A', value: 0, interactive: true, correctness: { value: 'correct', label: 'correct' } },
          { label: 'B', value: 1, interactive: true, correctness: { value: 'correct', label: 'correct' } },
        ],
        editCategoryEnabled
      )
    }
  );

  assertGetScore(
    '2/4 correct answers (3 values + 1 label)',
    {},
    {
      answer: filterCategories(
        [
          { label: 'A', value: 0, interactive: true },
          { label: 'B', value: 1, interactive: true },
          { label: 'C', value: 1, interactive: true },
        ],
        editCategoryEnabled
      )
    },
    {
      score: 0.75,
      answers: filterCategories(
        [
          { label: 'A', value: 0, interactive: true, correctness: { value: 'correct', label: 'correct' } },
          { label: 'B', value: 1, interactive: true, correctness: { value: 'correct', label: 'correct' } },
          { label: 'C', value: 1, interactive: true, correctness: { value: 'incorrect', label: 'correct' } },
        ],
        editCategoryEnabled
      )
    }
  );

  assertGetScore(
    'Default answer plus extra incorrect answer, 2/4 correct answers (3 values + 1 label)',
    {},
    {
      answer: filterCategories(
        [
          { label: 'A', value: 0, interactive: true },
          { label: 'B', value: 1, interactive: true },
          { label: 'D', value: 1, interactive: true },
        ],
        editCategoryEnabled
      )
    },
    {
      score: 0.5,
      answers: filterCategories(
        [
          { label: 'A', value: 0, interactive: true, correctness: { value: 'correct', label: 'correct' } },
          { label: 'B', value: 1, interactive: true, correctness: { value: 'correct', label: 'correct' } },
          { label: 'D', value: 1, interactive: true, correctness: { value: 'incorrect', label: 'incorrect' } },
        ],
        editCategoryEnabled
      )
    }
  );

  assertGetScore(
    'Default answer was incorrect, 4/4 correct answers (3 values + 1 label)',
    {
      data: filterCategories(
        [
          { label: 'A-wrong', value: 0, interactive: true },
          { label: 'B', value: 1, interactive: true },
        ],
        editCategoryEnabled
      )
    },
    {
      answer: filterCategories(
        [
          { label: 'A-wrong', value: 0, interactive: true },
          { label: 'B', value: 1, interactive: true },
          { label: 'C', value: 2, interactive: true },
        ],
        editCategoryEnabled
      )
    },
    {
      score: 1,
      answers: filterCategories(
        [
          { label: 'A-wrong', value: 0, interactive: true, correctness: { value: 'correct', label: 'correct' } },
          { label: 'B', value: 1, interactive: true, correctness: { value: 'correct', label: 'correct' } },
          { label: 'C', value: 2, interactive: true, correctness: { value: 'correct', label: 'correct' } },
        ],
        editCategoryEnabled
      )
    }
  );
});

describe('getScore partial scoring - editable - randomly interactive', () => {
  const scoringType = 'partial scoring';
  const editCategoryEnabled = true;
  const question = {
    correctAnswer: {
      data: [
        { label: 'A', value: 0 },
        { label: 'B', value: 1 },
        { label: 'C', value: 2 },
      ]
    },
    data: filterCategories(
      [
        { label: 'A', value: 0, interactive: false },
        { label: 'B', value: 1, interactive: true },
      ],
      editCategoryEnabled
    ),
    scoringType,
    editCategoryEnabled
  };

  const assertGetScore = (message, questionExtra, session, expected) => {
    it(message, () => {
      expect(getScore({ ...question, ...questionExtra }, session)).toEqual(expected);
    });
  };

  assertGetScore(
    'Answer is default answer, 2/4 correct answers (2 values + 2 labels)',
    {},
    {},
    {
      score: 0.5,
      answers: filterCategories(
        [
          { label: 'A', value: 0, interactive: false, correctness: { value: 'correct', label: 'correct' } },
          { label: 'B', value: 1, interactive: true, correctness: { value: 'correct', label: 'correct' } },
        ],
        editCategoryEnabled
      )
    }
  );

  assertGetScore(
    ' correct answers 3/4 (2 values + 2 labels)',
    {},
    {
      answer: filterCategories(
        [
          { label: 'A', value: 0, interactive: false },
          { label: 'B', value: 1, interactive: true },
          { label: 'C', value: 1, interactive: true },
        ],
        editCategoryEnabled
      )
    },
    {
      score: 0.75,
      answers: filterCategories(
        [
          { label: 'A', value: 0, interactive: false, correctness: { value: 'correct', label: 'correct' } },
          { label: 'B', value: 1, interactive: true, correctness: { value: 'correct', label: 'correct' } },
          { label: 'C', value: 1, interactive: true, correctness: { value: 'incorrect', label: 'correct' } },
        ],
        editCategoryEnabled
      )
    }
  );

  assertGetScore(
    'Default answer edited with incorrect answer, 2/4 correct answers (2 labels + 2 values)',
    {},
    {
      answer: filterCategories(
        [
          { label: 'A', value: 0, interactive: false },
          { label: 'D', value: 1, interactive: true },
          { label: 'C', value: 1, interactive: true },
        ],
        editCategoryEnabled
      )
    },
    {
      score: 0.5,
      answers: filterCategories(
        [
          { label: 'A', value: 0, interactive: false, correctness: { value: 'correct', label: 'correct' } },
          { label: 'D', value: 1, interactive: true, correctness: { value: 'correct', label: 'incorrect' } },
          { label: 'C', value: 1, interactive: true, correctness: { value: 'incorrect', label: 'correct' } },
        ],
        editCategoryEnabled
      )
    }
  );

  assertGetScore(
    'Default answer was incorrect and edited, 4/4 correct answers (2 labels + 2 values)',
    {
      data: filterCategories(
        [
          { label: 'A-wrong', value: 0, interactive: false },
          { label: 'B', value: 1, interactive: true },
        ],
        editCategoryEnabled
      )
    },
    {
      answer: filterCategories(
        [
          { label: 'A-wrong', value: 0, interactive: false },
          { label: 'B', value: 1, interactive: true },
          { label: 'C', value: 2, interactive: true },
        ],
        editCategoryEnabled
      )
    },
    {
      score: 1,
      answers: filterCategories(
        [
          { label: 'A-wrong', value: 0, interactive: false, correctness: { value: 'correct', label: 'correct' } },
          { label: 'B', value: 1, interactive: true, correctness: { value: 'correct', label: 'correct' } },
          { label: 'C', value: 2, interactive: true, correctness: { value: 'correct', label: 'correct' } },
        ],
        editCategoryEnabled
      )
    }
  );
});

describe('getScore partial scoring - NOT editable - randomly interactive', () => {
  const scoringType = 'partial scoring';
  const editCategoryEnabled = false;
  const question = {
    correctAnswer: {
      data: [
        { label: 'A', value: 0 },
        { label: 'B', value: 1 },
        { label: 'C', value: 2 },
      ]
    },
    data: filterCategories(
      [
        { label: 'A', value: 0, interactive: false },
        { label: 'B', value: 1, interactive: true },
      ],
      editCategoryEnabled
    ),
    scoringType,
    editCategoryEnabled
  };

  const assertGetScore = (message, questionExtra, session, expected) => {
    it(message, () => {
      expect(getScore({ ...question, ...questionExtra }, session)).toEqual(expected);
    });
  };

  assertGetScore(
    'Answer is default answer, 1/3 correct answers (2 values + 1 label)',
    {},
    {},
    {
      score: 0.33,
      answers: filterCategories(
        [
          { label: 'A', value: 0, interactive: false, correctness: { value: 'correct', label: 'correct' } },
          { label: 'B', value: 1, interactive: true, correctness: { value: 'correct', label: 'correct' } },
        ],
        editCategoryEnabled
      )
    }
  );

  assertGetScore(
    ' correct answers 2/3 (2 values + 1 label)',
    {},
    {
      answer: filterCategories(
        [
          { label: 'A', value: 0, interactive: false },
          { label: 'B', value: 1, interactive: true },
          { label: 'C', value: 1, interactive: true },
        ],
        editCategoryEnabled
      )
    },
    {
      score: 0.67,
      answers: filterCategories(
        [
          { label: 'A', value: 0, interactive: false, correctness: { value: 'correct', label: 'correct' } },
          { label: 'B', value: 1, interactive: true, correctness: { value: 'correct', label: 'correct' } },
          { label: 'C', value: 1, interactive: true, correctness: { value: 'incorrect', label: 'correct' } },
        ],
        editCategoryEnabled
      )
    }
  );

  assertGetScore(
    'Default answer edited with incorrect answer, 2/3 correct answers (2 values + 1 label)',
    {},
    {
      answer: filterCategories(
        [
          { label: 'A', value: 0, interactive: false },
          { label: 'D', value: 1, interactive: true },
          { label: 'C', value: 1, interactive: true },
        ],
        editCategoryEnabled
      )
    },
    {
      score: 0.67,
      answers: filterCategories(
        [
          { label: 'A', value: 0, interactive: false, correctness: { value: 'correct', label: 'correct' } },
          { label: 'D', value: 1, interactive: true, correctness: { value: 'correct', label: 'correct' } },
          { label: 'C', value: 1, interactive: true, correctness: { value: 'incorrect', label: 'correct' } },
        ],
        editCategoryEnabled
      )
    }
  );

  assertGetScore(
    'Default answer was incorrect and edited, 3/3 correct answers (1 label + 2 values)',
    {
      data: filterCategories(
        [
          { label: 'A-wrong', value: 0, interactive: false },
          { label: 'B', value: 1, interactive: true },
        ],
        editCategoryEnabled
      )
    },
    {
      answer: filterCategories(
        [
          { label: 'A-wrong', value: 0, interactive: false },
          { label: 'B', value: 1, interactive: true },
          { label: 'C', value: 2, interactive: true },
        ],
        editCategoryEnabled
      )
    },
    {
      score: 1,
      answers: filterCategories(
        [
          { label: 'A-wrong', value: 0, interactive: false, correctness: { value: 'correct', label: 'correct' } },
          { label: 'B', value: 1, interactive: true, correctness: { value: 'correct', label: 'correct' } },
          { label: 'C', value: 2, interactive: true, correctness: { value: 'correct', label: 'correct' } },
        ],
        editCategoryEnabled
      )
    }
  );
});

describe('createCorrectResponseSession', () => {
  const question = {
    categoryDefaultLabel: 'Category',
    chartType: 'lineCross',
    correctAnswer: {
      data: [
        {
          label: 'A',
          value: 1,
          initial: true,
          interactive: false,
          editable: true,
          deletable: true
        },
        {
          label: 'B',
          value: 1,
          initial: true,
          interactive: true,
          editable: true,
          deletable: true
        },
        {
          label: 'C',
          value: 1,
          initial: true,
          interactive: true,
          editable: true,
          deletable: true
        },
      ]
    },
    data: [
      {
        label: 'A',
        value: 1,
        initial: true,
        interactive: false,
        editable: true,
        deletable: true
      },
      {
        label: 'B',
        value: 1,
        initial: true,
        interactive: true,
        editable: true,
        deletable: true
      },
      {
        label: 'D',
        value: 1,
        initial: true,
        interactive: true,
        editable: true,
        deletable: true
      },
    ],
    domain: {
      label: 'Fruits',
    },
    graph: {
      width: 480,
      height: 480
    },
    prompt: 'Here goes item stem!',
    rationale: 'Rationale goes here!',
    range: {
      label: 'Amount',
      max: 5.5,
      min: 0,
      labelStep: 1,
    },
    scoringType: 'partial scoring',
    title: 'This is a chart!',
  };

  it('returns correct response if role is instructor and mode is gather', async () => {
    const sess = await createCorrectResponseSession(question, {
      mode: 'gather',
      role: 'instructor'
    });

    expect(sess).toEqual({
      answer: [
        {
          label: 'A',
          value: 1,
          initial: true,
          interactive: false,
          editable: true,
          deletable: true
        },
        {
          label: 'B',
          value: 1,
          initial: true,
          interactive: true,
          editable: true,
          deletable: true
        },
        {
          label: 'C',
          value: 1,
          initial: true,
          interactive: true,
          editable: true,
          deletable: true
        }
      ],
      id: '1'
    });
  });

  it('returns correct response if role is instructor and mode is view', async () => {
    const sess = await createCorrectResponseSession(question, {
      mode: 'view',
      role: 'instructor'
    });

    expect(sess).toEqual({
      answer: [
        {
          label: 'A',
          value: 1,
          initial: true,
          interactive: false,
          editable: true,
          deletable: true
        },
        {
          label: 'B',
          value: 1,
          initial: true,
          interactive: true,
          editable: true,
          deletable: true
        },
        {
          label: 'C',
          value: 1,
          initial: true,
          interactive: true,
          editable: true,
          deletable: true
        }
      ],
      id: '1'
    });
  });

  it('returns null if mode is evaluate', async () => {
    const noResult = await createCorrectResponseSession(question, { mode: 'evaluate', role: 'instructor' });

    expect(noResult).toBeNull();
  });

  it('returns null if role is student', async () => {
    const noResult = await createCorrectResponseSession(question, { mode: 'gather', role: 'student' });

    expect(noResult).toBeNull();
  });
});

describe('outcome', () => {
  const session = {
    "answer": [
      {
        "interactive": true,
        "deletable": false,
        "initial": true,
        "value": 3,
        "label": "Three"
      },
      {
        "deletable": false,
        "initial": true,
        "value": 2,
        "label": "Four",
        "interactive": true
      },
      {
        "value": 4,
        "label": "Five",
        "interactive": true,
        "deletable": false,
        "initial": true
      },
      {
        "interactive": true,
        "editable": true,
        "deletable": true,
        "value": 0.25,
        "label": "six"
      },
      {
        "deletable": true,
        "value": 1,
        "label": "seven",
        "interactive": true,
        "editable": true
      },
      {
        "interactive": true,
        "editable": true,
        "deletable": true,
        "value": 1,
        "label": "eight"
      }
    ],
    "id": "4028e4a24e6f8eaf014ed1b0833635d3"
  };
  const question = {
    "addCategoryEnabled": true,
    "chartType": "bar",
    "data": [
      {
        "interactive": true,
        "value": 3,
        "label": "Three",
        "deletable": false,
        "initial": true
      },
      {
        "interactive": true,
        "value": 0,
        "label": "Four",
        "deletable": false,
        "initial": true
      },
      {
        "interactive": true,
        "value": 0,
        "label": "Five",
        "deletable": false,
        "initial": true
      }
    ],
    "correctAnswer": {
      "data": [
        {
          "value": 3,
          "label": "Three"
        },
        {
          "value": 2,
          "label": "Four"
        },
        {
          "value": 4,
          "label": "Five"
        },
        {
          "value": 0,
          "label": "Six"
        },
        {
          "value": 1,
          "label": "Seven"
        },
        {
          "value": 1,
          "label": "Eight"
        }
      ]
    },
    "domain": {
      "label": "Number of Letters"
    },
    "graph": {
      "height": 500,
      "width": 500
    },
    "prompt": "<p>Ms. Byrd shows her third grade students how to make a bar graph. She uses the number of letters in some of her students&#39; first names. The students&#39; names she uses for the bar graph are shown below.</p><p><img alt=\"image 2eade8e8a2fa445dae432c417e8a2731\" id=\"2eade8e8a2fa445dae432c417e8a2731\" src=\"https://storage.googleapis.com/pie-prod-221718-assets/image/cf2c334e-340c-4523-9a47-cb835fddfefe\"></p><p>Ms. Byrd starts the bar graph by writing some of the labels.&#160;Finish the bar graph below by dragging the bars to show the correct number of first name letters of all the students and adding labels as needed.</p><p></p><p></p><p></p>",
    "range": {
      "label": "Number of Students",
      "max": 6,
      "labelStep": 0.25,
      "step": 0.25,
      "min": 0
    },
    "rationale": null,
    "title": "Number of Letters in First Name",
    "disabled": false,
    "teacherInstructions": null,
  };

  it.each`
      mode          |       partialScoring        |       expected
      ${'evaluate'} |       ${true}               |       ${0.89}
      ${'evaluate'} |       ${false}              |       ${0}
      ${'gather'}   |       ${true}               |       ${0}
    `('mode ${mode}, partialScoring ${partialScoring} => $expected', async ({ mode, partialScoring, expected }) => {
    const env = { mode, partialScoring };

    const mod =  await model(question, session, env);
    const result = await outcome(mod, session, env);

    expect(result.score).toEqual(expected);
  });
});
