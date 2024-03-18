import { compareMarks, model, createCorrectResponseSession, getAnswerCorrected } from '../index';
import defaults from '../defaults';

describe('compareMarks', () => {
  test.each([
    [undefined, undefined, false],
    [null, null, false],
    [{}, {}, false],
    [{ type: 'a' }, { type: 'b' }, false],
    [{ type: 'a' }, { type: 'a' }, false],
    [
      { type: 'line', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
      { type: 'line', from: { x: 1, y: 1 }, to: { x: 2, y: 2 } },
      true,
    ],
    [
      { type: 'line', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
      { type: 'line', from: { x: 2, y: 3 }, to: { x: 3, y: 2 } },
      false,
    ],
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
      [{ type: 'line', from: { x: 0, y: 0 }, to: { x: 1, y: 1 }, fill: 'Solid' }],
      [{ type: 'line', from: { x: 0, y: 0 }, to: { x: 1, y: 1 }, fill: 'Solid' }],
      [{ type: 'line', from: { x: 0, y: 0 }, to: { x: 1, y: 1 }, fill: 'Solid', correctness: 'correct' }],
    ],
  ])('sessionAnswers = %j, marks = %j => correctedMarks = %j', (sessionAnswers, marks, correctedMarks) => {
    expect(getAnswerCorrected({ sessionAnswers, marks })).toEqual(correctedMarks);
  });
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
    [{ mode: 'view', role: 'instructor' }, { promptEnabled: true }, { disabled: true, showToggle: false }, {}],
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
      {
        answers: {
          correctAnswer: { marks: [{ type: 'line', from: { x: 0, y: 0 }, to: { x: 1, y: 1 }, fill: 'Solid' }] },
        },
      },
      {
        disabled: true,
        showToggle: true,
        answersCorrected: [
          { correctness: 'missing', type: 'line', from: { x: 0, y: 0 }, to: { x: 1, y: 1 }, fill: 'Solid' },
        ],
        correctResponse: [{ type: 'line', from: { x: 0, y: 0 }, to: { x: 1, y: 1 }, fill: 'Solid' }],
      },
      {},
    ],
    [
      { mode: 'evaluate' },
      {
        answers: {
          correctAnswer: { marks: [{ type: 'line', from: { x: 0, y: 0 }, to: { x: 1, y: 1 }, fill: 'Solid' }] },
        },
      },
      {
        disabled: true,
        rationale: null,
        teacherInstructions: null,
        showToggle: false,
        answersCorrected: [
          { type: 'line', from: { x: 0, y: 0 }, to: { x: 1, y: 1 }, fill: 'Solid', correctness: 'correct' },
        ],
        correctResponse: [{ type: 'line', from: { x: 0, y: 0 }, to: { x: 1, y: 1 }, fill: 'Solid' }],
      },
      { answer: [{ type: 'line', from: { x: 0, y: 0 }, to: { x: 1, y: 1 }, fill: 'Solid' }] },
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
        correctResponse: [],
      },
      undefined,
    ],
  ])('model env = %j', async (env, extraQuestionProps, expectedResult, session) => {
    const question = {
      ...defaults,
      answers: {},
      prompt: 'This is prompt',
      rationale: 'Rationale',
      teacherInstructions: 'Teacher Instructions',
      defaultTool: 'line',
      ...extraQuestionProps,
    };
    const { prompt, promptEnabled, graph, answers, ...questionProps } = question;

    const result = await model(question, session || {}, env);
    const expected = {
      ...questionProps,
      answers,
      prompt,
      size: question.graph,
      ...expectedResult,
    };

    expect(result).toEqual(expected);
  });
});

describe('createCorrectResponseSession', () => {
  const question = {
    toolbarTools: ['polygon', 'line'],
    answers: {
      correctAnswer: {
        name: 'Correct Answer',
        marks: [
          {
            type: 'line',
            from: { x: 0, y: 0 },
            to: { x: 1, y: 1 },
            fill: 'Solid',
          },
        ],
      },
    },
    prompt: 'Here goes item stem!',
    rationale: 'Rationale goes here!',
  };

  it('returns correct response if role is instructor and mode is gather', async () => {
    const sess = await createCorrectResponseSession(question, {
      mode: 'gather',
      role: 'instructor',
    });

    expect(sess).toEqual({
      answer: [
        {
          type: 'line',
          from: { x: 0, y: 0 },
          to: { x: 1, y: 1 },
          fill: 'Solid',
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
          type: 'line',
          from: { x: 0, y: 0 },
          to: { x: 1, y: 1 },
          fill: 'Solid',
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
