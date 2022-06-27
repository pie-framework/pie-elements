import {
  compareMarks,
  getBestAnswer,
  model,
  outcome,
  createCorrectResponseSession,
  getAnswerCorrected,
  orderCorrectAnswers,
} from '../index';
import defaults from '../defaults';

describe('compareMarks', () => {
  test.each([
    [undefined, undefined, false],
    [null, null, false],
    [{}, {}, false],
    [{ type: 'a' }, { type: 'b' }, false],
    [{ type: 'a' }, { type: 'a' }, false],
    [{ type: 'point', x: 1, y: 1 }, { type: 'point', x: 1, y: 1 }, true],
    [{ type: 'point', x: 1, y: 1 }, { type: 'point', x: 2, y: 1 }, false],
  ])('mark1 = %j, mark2 = %j => equal = %j', (mark1, mark2, equal) => {
    expect(compareMarks(mark1, mark2)).toEqual(equal);
  });
});

describe('getAnswerCorrected', () => {
  test.each([
    [undefined, undefined, []],
    [null, null, []],
    [[], [], []],
    [
      [{ type: 'point', x: 1, y: 1 }],
      [{ type: 'point', x: 1, y: 1 }],
      [{ type: 'point', x: 1, y: 1, correctness: 'correct' }],
    ],
    [
      [{ type: 'point', x: 0, y: 1 }],
      [{ type: 'point', x: 1, y: 1 }],
      [{ type: 'point', x: 0, y: 1, correctness: 'incorrect' }],
    ],
    [
      [
        { type: 'point', x: 1, y: 1 },
        { type: 'point', x: 0, y: 1 },
      ],
      [{ type: 'point', x: 1, y: 1 }],
      [
        { type: 'point', x: 1, y: 1, correctness: 'correct' },
        { type: 'point', x: 0, y: 1, correctness: 'incorrect' },
      ],
    ],
    [
      [
        { type: 'point', x: 8, y: 1 },
        { type: 'point', x: 0, y: 1 },
      ],
      [{ type: 'point', x: 1, y: 1 }],
      [
        { type: 'point', x: 8, y: 1, correctness: 'incorrect' },
        {
          type: 'point',
          x: 0,
          y: 1,
          correctness: 'incorrect',
        },
      ],
    ],
  ])(
    'sessionAnswers = %j, marks = %j => correctedMarks = %j',
    (sessionAnswers, marks, correctedMarks) => {
      expect(getAnswerCorrected({ sessionAnswers, marks })).toEqual(
        correctedMarks
      );
    }
  );
});

describe('model', () => {
  test.each([
    [
      { mode: 'gather' },
      { promptEnabled: true },
      {
        disabled: false,
        rationale: null,
        showToggle: false,
        teacherInstructions: null,
      },
      {},
    ],
    [
      { mode: 'gather' },
      { promptEnabled: false },
      {
        disabled: false,
        rationale: null,
        prompt: null,
        showToggle: false,
        teacherInstructions: null,
      },
      {},
    ],
    [
      { mode: 'view' },
      { promptEnabled: true },
      {
        disabled: true,
        rationale: null,
        showToggle: false,
        teacherInstructions: null,
      },
      {},
    ],
    [
      { mode: 'view', role: 'instructor' },
      { promptEnabled: true },
      { disabled: true, showToggle: false },
      {},
    ],
    [
      { mode: 'view', role: 'instructor' },
      {
        promptEnabled: false,
        rationaleEnabled: false,
        teacherInstructionsEnabled: false,
      },
      {
        disabled: true,
        prompt: null,
        rationale: null,
        teacherInstructions: null,
        showToggle: false,
      },
      {},
    ],
    [
      { mode: 'evaluate', role: 'instructor' },
      { promptEnabled: true },
      {
        disabled: true,
        showToggle: false,
        answersCorrected: [],
        correctResponse: [],
      },
      {},
    ],
    [
      { mode: 'evaluate', role: 'instructor' },
      { answers: { a1: { marks: [{ type: 'point', x: 1, y: 1 }] } } },
      {
        disabled: true,
        showToggle: true,
        answersCorrected: [],
        correctResponse: [{ type: 'point', x: 1, y: 1 }],
      },
      {},
    ],
    [
      { mode: 'evaluate' },
      { answers: { a1: { marks: [{ type: 'point', x: 1, y: 1 }] } } },
      {
        disabled: true,
        rationale: null,
        teacherInstructions: null,
        showToggle: false,
        answersCorrected: [
          { type: 'point', x: 1, y: 1, correctness: 'correct' },
        ],
        correctResponse: [{ type: 'point', x: 1, y: 1 }],
      },
      { answer: [{ type: 'point', x: 1, y: 1 }] },
    ],
    [
      { mode: 'evaluate' },
      { answers: { a1: { marks: [{ type: 'point', x: 1, y: 1 }] } } },
      {
        disabled: true,
        rationale: null,
        teacherInstructions: null,
        showToggle: true,
        answersCorrected: [
          { type: 'point', x: 0, y: 1, correctness: 'incorrect' },
        ],
        correctResponse: [{ type: 'point', x: 1, y: 1 }],
      },
      { answer: [{ type: 'point', x: 0, y: 1 }] },
    ],
    [
      { mode: 'evaluate' },
      { answers: {} },
      {
        disabled: true,
        rationale: null,
         teacherInstructions: null,
        showToggle: false,
        answersCorrected: [],
        correctResponse: []
      },
      undefined
    ],
  ])(
    'model env = %j',
    async (env, extraQuestionProps, expectedResult, session) => {
      const question = {
        ...defaults,
        prompt: 'This is prompt',
        rationale: 'Rationale',
        teacherInstructions: 'Teacher Instructions',
        defaultTool: 'circle',
        ...extraQuestionProps,
      };
      const {
        prompt,
        promptEnabled,
        graph,
        answers,
        ...questionProps
      } = question;

      const result = await model(question, session || {}, env);
      const expected = {
        ...questionProps,
        answers,
        prompt,
        size: question.graph,
        ...expectedResult,
      };

      expect(result).toEqual(expected);
    }
  );
});

describe('getBestAnswer', () => {
  const answers = {
    a1: {
      marks: [
        { x: 1, y: 1, type: 'point' },
        { x: 2, y: 2, type: 'point' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment' },
      ],
    },
    a2: {
      marks: [
        { x: 1, y: 1, type: 'point' },
        { x: 2, y: 2, type: 'point' },
        { x: 3, y: 3, type: 'point' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment' },
      ],
    },
  };
  const question = { answers };

  describe('scores item accordingly', () => {
    const answer = [
      { x: 1, y: 1, type: 'point' },
      { x: 4, y: 4, type: 'point' },
      { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment' },
    ];

    test.each([
      [{ scoringType: 'partial scoring' }, undefined, 0.67],
      [{ scoringType: 'dichotomous' }, undefined, 0],
      [{ scoringType: 'dichotomous' }, true, 0],
      [{ scoringType: 'partial scoring' }, false, 0],
    ])(
      '%j & env.partialScoring = %j => score = %d',
      (extraQuestionProps, partialScoring, expectedScore) => {
        const result = getBestAnswer(
          { answers, ...extraQuestionProps },
          { answer },
          {
            mode: 'evaluate',
            partialScoring,
          }
        );

        expect(result.bestScore).toEqual(expectedScore);
      }
    );
  });

  describe('returns proper results', () => {
    const answer1 = [
      { x: 1, y: 1, type: 'point' },
      { x: 2, y: 2, type: 'point' },
      { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment' },
    ];
    const answer2 = [
      { x: 1, y: 1, type: 'point' },
      { x: 2, y: 2, type: 'point' },
      { x: 3, y: 3, type: 'point' },
      { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment' },
    ];
    const answer3 = [
      { x: 1, y: 1, type: 'point' },
      { x: 4, y: 4, type: 'point' },
      { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment' },
    ];

    const correctMarks1 = [
      { x: 1, y: 1, type: 'point', correctness: 'correct' },
      { x: 2, y: 2, type: 'point', correctness: 'correct' },
      {
        from: { x: 1, y: 1 },
        to: { x: 2, y: 2 },
        type: 'segment',
        correctness: 'correct',
      },
    ];
    const correctMarks2 = [
      { x: 1, y: 1, type: 'point', correctness: 'correct' },
      { x: 2, y: 2, type: 'point', correctness: 'correct' },
      { x: 3, y: 3, type: 'point', correctness: 'correct' },
      {
        from: { x: 1, y: 1 },
        to: { x: 2, y: 2 },
        type: 'segment',
        correctness: 'correct',
      },
    ];
    const correctMarks3 = [
      { x: 1, y: 1, type: 'point', correctness: 'correct' },
      { x: 4, y: 4, type: 'point', correctness: 'incorrect' },
      {
        from: { x: 1, y: 1 },
        to: { x: 2, y: 2 },
        type: 'segment',
        correctness: 'correct',
      },
    ];

    test.each([
      ['dichotomous', answer1, correctMarks1, 1],
      ['partial scoring', answer1, correctMarks1, 1],
      ['dichotomous', answer2, correctMarks2, 1],
      ['partial scoring', answer2, correctMarks2, 1],
      ['dichotomous', answer3, correctMarks3, 0],
      ['partial scoring', answer3, correctMarks3, 0.67],
    ])(
      'scoringType = %s, answer = %j, correctMarks = %j => score = %d',
      (scoringType, answer, correctMarks, score) => {
        const result = getBestAnswer({ ...question, scoringType }, { answer });

        expect(result.bestScore).toEqual(score);
        expect(result.answersCorrected).toEqual(correctMarks);
      }
    );
  });

  describe('returns proper results if params are incorrectly defined', () => {
    it.each`
      session
      ${undefined}
      ${null}
      ${{}}
    `('returns score: 0 if session = $session', ({ session }) => {
      const result = getBestAnswer(question, session);

      expect(result.bestScore).toEqual(0);
    });

    it.each`
      question
      ${undefined}
      ${null}
      ${{}}
    `(
      'returns score: 0, answersCorrected: [] if question = $question',
      ({ question }) => {
        const result = getBestAnswer(question, {});

        expect(result).toEqual({
          answersCorrected: [],
          bestScore: 0,
          bestScoreAnswerKey: null,
          foundOneSolution: false,
        });
      }
    );

    it.each`
      answers
      ${{ correctAnswer: undefined }}
      ${undefined}
      ${null}
      ${{}}
    `(
      'returns score: 0, answersCorrected: [] if answers = $answers',
      ({ answers }) => {
        const result = getBestAnswer({ ...question, answers }, {});

        expect(result).toEqual({
          answersCorrected: [],
          bestScore: 0,
          bestScoreAnswerKey: null,
          foundOneSolution: false,
        });
      }
    );
  });
});

describe('outcome', () => {
  // if model.scoringType = 'all or nothing'
  //    if env.partialScoring = false                                       => dichotomous
  //    else env.partialScoring = true || env.partialScoring = undefined    => dichotomous
  // else model.scoringType = 'partial scoring' || model.scoringType = undefined
  //    if env.partialScoring = false                                       => dichotomous
  //    else env.partialScoring = true || model.partialScoring = undefined  => partial-credit scoring

  it.each`
    mode          | partialScoring | scoringType          | expected
    ${'evaluate'} | ${false}       | ${'all or nothing'}  | ${0}
    ${'evaluate'} | ${true}        | ${'all or nothing'}  | ${0}
    ${'evaluate'} | ${undefined}   | ${'all or nothing'}  | ${0}
    ${'evaluate'} | ${false}       | ${'partial scoring'} | ${0}
    ${'evaluate'} | ${true}        | ${'partial scoring'} | ${0.67}
    ${'evaluate'} | ${undefined}   | ${'partial scoring'} | ${0.67}
    ${'evaluate'} | ${false}       | ${undefined}         | ${0}
    ${'evaluate'} | ${true}        | ${undefined}         | ${0.67}
    ${'evaluate'} | ${undefined}   | ${undefined}         | ${0.67}
    ${'gather'}   | ${false}       | ${'partial scoring'} | ${0}
    ${'gather'}   | ${true}        | ${'partial scoring'} | ${0}
    ${'gather'}   | ${undefined}   | ${'partial scoring'} | ${0}
  `(
    'env.mode $mode, env.partialScoring $partialScoring, model.scoringType $scoringType => $expected',
    async ({ mode, partialScoring, scoringType, expected }) => {
      const env = { mode, partialScoring };
      const answers = {
        a1: {
          marks: [
            { x: 1, y: 1, type: 'point' },
            { x: 2, y: 2, type: 'point' },
            { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment' },
          ],
        },
        a2: {
          marks: [
            { x: 1, y: 1, type: 'point' },
            { x: 2, y: 2, type: 'point' },
            { x: 3, y: 3, type: 'point' },
            { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment' },
          ],
        },
      };
      const question = { answers, scoringType };
      const session = {
        answer: [
          { x: 1, y: 1, type: 'point' },
          { x: 4, y: 4, type: 'point' },
          { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment' },
        ],
      };

      const mod = await model({ ...question, scoringType }, session, env);

      const result = await outcome(mod, session, env);

      expect(result.score).toEqual(expected);
    }
  );

  it.each`
    session
    ${undefined}
    ${null}
    ${{}}
  `(
    'returns score: 0 and empty: true if session is $session',
    async ({ session }) => {
      const o = await outcome({}, session, { mode: 'evaluate' });

      expect(o).toEqual({ score: 0, empty: true });
    }
  );

  it('Lines are correctly scored (ch3729)', async () => {
    const m = {
      element: 'pie-element-graphing',
      range: {
        labelStep: 50,
        step: 10,
        min: -220,
        axisLabel: 'f(n)',
        max: 220,
      },
      rationale: 'Rationale',
      prompt: 'Prompt',
      domain: {
        max: 220,
        labelStep: 50,
        step: 10,
        min: -220,
        axisLabel: 'n',
      },
      id: '4028e4a24c574edc014c900663fb529d',
      graph: { height: 500, width: 500 },
      answers: {
        correctAnswer: {
          marks: [
            { from: { y: 60, x: 30 }, type: 'line', to: { x: 110, y: 60 } },
            { type: 'line', to: { x: 0, y: 160 }, from: { y: 190, x: 0 } },
          ],
        },
      },
      toolbarTools: ['line'],
    };
    const session = {
      answer: [
        { from: { x: -1, y: 60 }, to: { x: 1, y: 60 }, type: 'line' },
        { from: { x: 0, y: 50 }, to: { x: 0, y: 100 }, type: 'line' },
      ],
    };

    const mod = await model(m, session, {});
    const result = await outcome(mod, session, { mode: 'evaluate' });

    expect(result.score).toEqual(1);
  });

  it('Sines are correctly scored (ch4146)', async () => {
    const m = {
      rationale: 'Rationale',
      prompt: 'Prompt',
      domain: {
        min: -7,
        axisLabel: '<i>x</i>',
        max: 7,
        labelStep: 1,
        step: 0.5,
      },
      id: '4028e4a24b9010f8014ba33810fd2c5c',
      graph: { width: 500, height: 500 },
      answers: {
        correctAnswer: {
          marks: [
            { edge: { x: 0.5, y: 5 }, root: { y: 3, x: 0 }, type: 'sine' },
          ],
        },
      },
      toolbarTools: ['sine'],
      element: 'pie-element-graphing',
      range: {
        min: -7,
        axisLabel: '<i>f</i>(<i>x</i>)',
        max: 7,
        labelStep: 1,
        step: 1,
      },
    };
    const session = {
      answer: [{ edge: { x: -0.5, y: 1 }, root: { y: 3, x: 0 }, type: 'sine' }],
    };

    const mod = await model(m, session, {});
    const result = await outcome(mod, session, { mode: 'evaluate' });

    expect(result.score).toEqual(1);
  });

  it('Lines are correctly scored (ch4126)', async () => {
    const m = {
      id: '4028e4a24ca05186014cbae62f752be7',
      graph: {
        height: 500,
        width: 500,
      },
      answers: {
        correctAnswer: {
          marks: [
            { type: 'line', to: { x: 0, y: -4 }, from: { y: -6, x: 0 } },
            { from: { y: 0, x: -6 }, type: 'line', to: { x: 4, y: 0 } },
            { from: { x: -4, y: -6 }, type: 'line', to: { x: -4, y: -4 } },
          ],
        },
      },
      toolbarTools: ['line'],
      element: 'pie-element-graphing',
      range: {
        min: -11,
        axisLabel: 'f(x)',
        max: 11,
        labelStep: 1,
        step: 1,
      },
      title: 'Electric Field as a Function of Location',
      rationale: 'Rationale',
      prompt: 'Prompt',
      labels: {},
      domain: {
        min: -11,
        axisLabel: 'x',
        max: 11,
        labelStep: 1,
        step: 1,
      },
    };
    const session = {
      answer: [
        { from: { x: 0, y: 1 }, type: 'line', to: { x: 0, y: 3 } },
        { from: { x: 1, y: 0 }, type: 'line', to: { x: 3, y: 0 } },
      ],
    };
    const env = { mode: 'evaluate' };

    const mod = await model(m, session, env);
    const result = await outcome(mod, session, env);

    expect(result.score).toEqual(0.67);

    const session2 = {
      answer: [
        { from: { x: 0, y: 3 }, type: 'line', to: { x: 0, y: 1 } },
        { from: { x: 3, y: 0 }, type: 'line', to: { x: 1, y: 0 } },
      ],
    };

    expect(
      (await outcome(await model(m, session2, env), session2, env)).score
    ).toEqual(0.67);

    const session3 = {
      answer: [
        { from: { x: 0, y: 3 }, type: 'line', to: { x: 0, y: 1 } },
        { from: { x: 3, y: 0 }, type: 'line', to: { x: 1, y: 0 } },
        { from: { x: -4, y: -8 }, type: 'line', to: { x: -4, y: 4 } },
      ],
    };

    expect(
      (await outcome(await model(m, session3, env), session3, env)).score
    ).toEqual(1);

    const session4 = {
     answer: [],
    };

    expect(
      (await outcome(await model(m, session4, env), session4, env)).score
    ).toEqual(0);
  });
});

describe('createCorrectResponseSession', () => {
  const question = {
    toolbarTools: [
      'point',
      'circle',
      'polygon',
      'segment',
      'ray',
      'vector',
      'line',
      'sine',
      'parabola',
      'label',
    ],
    answers: {
      alternate1: {
        pname: 'Alternate 1',
        marks: [
          {
            type: 'segment',
            from: { x: 0, y: 0 },
            to: { x: 1, y: 1 },
          },
          {
            type: 'point',
            x: 3,
            y: 3,
            label: 'Point',
            showLabel: true,
          },
        ],
      },
      correctAnswer: {
        name: 'Correct Answer',
        marks: [
          {
            type: 'point',
            x: 0,
            y: 0,
          },
        ],
      },
    },
    backgroundMarks: [],
    prompt: 'Here goes item stem!',
    rationale: 'Rationale goes here!',
    scoringType: 'partial scoring',
  };

  it('returns correct response if role is instructor and mode is gather', async () => {
    const sess = await createCorrectResponseSession(question, {
      mode: 'gather',
      role: 'instructor',
    });

    expect(sess).toEqual({
      answer: [
        {
          type: 'segment',
          from: { x: 0, y: 0 },
          to: { x: 1, y: 1 },
        },
        {
          type: 'point',
          x: 3,
          y: 3,
          label: 'Point',
          showLabel: true,
        },
      ],
      id: '1',
    });
  });

  it('returns correct response if role is instructor and mode is view', async () => {
    const sess = await createCorrectResponseSession(question, {
      mode: 'view',
      role: 'instructor',
    });

    expect(sess).toEqual({
      answer: [
        {
          type: 'segment',
          from: { x: 0, y: 0 },
          to: { x: 1, y: 1 },
        },
        {
          type: 'point',
          x: 3,
          y: 3,
          label: 'Point',
          showLabel: true,
        },
      ],
      id: '1',
    });
  });

  it('returns null if mode is evaluate', async () => {
    const noResult = await createCorrectResponseSession(question, {
      mode: 'evaluate',
      role: 'instructor',
    });

    expect(noResult).toBeNull();
  });

  it('returns null if role is student', async () => {
    const noResult = await createCorrectResponseSession(question, {
      mode: 'gather',
      role: 'student',
    });

    expect(noResult).toBeNull();
  });
});
