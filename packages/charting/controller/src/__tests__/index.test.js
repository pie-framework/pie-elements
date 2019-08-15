import {
  setCorrectness,
  checkLabelsEquality,
  filterCategories,
  getScore
} from '../index';

describe('setCorrectness', () => {
  it('sets correctness on answers for partial scoring: incorrect', () => {
    const corectnessAnswers = setCorrectness([
      { value: 0, label: 'A' },
      { value: 1, label: 'B' },
      { value: 2, label: 'C' }
      ], true);

    expect(corectnessAnswers).toEqual([
      { value: 0, label: 'A', correctness: { value: 'incorrect', label: 'incorrect' }},
      { value: 1, label: 'B', correctness: { value: 'incorrect', label: 'incorrect' }},
      { value: 2, label: 'C', correctness: { value: 'incorrect', label: 'incorrect' }}
    ]);
  });

  it('sets correctness on answers for all or nothing: correct', () => {
    const corectnessAnswers = setCorrectness([
      { value: 0, label: 'A' },
      { value: 1, label: 'B' },
      { value: 2, label: 'C' }
      ]);

    expect(corectnessAnswers).toEqual([
      { value: 0, label: 'A', correctness: { value: 'correct', label: 'correct' }},
      { value: 1, label: 'B', correctness: { value: 'correct', label: 'correct' }},
      { value: 2, label: 'C', correctness: { value: 'correct', label: 'correct' }}
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
