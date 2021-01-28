import {
  model,
  outcome,
  getCorrectness,
  createCorrectResponseSession,
  getTotalScore,
  getPartialScore,
} from '../index';
import React from 'react';

jest.mock('@pie-lib/categorize', () => ({
  // used this algorithm in order to control the value of correct; check `fakeCorrect` below
  buildState: (mockedCategories, choices, answers) => ({
    categories: mockedCategories,
    correct: mockedCategories === answers,
  }),
}));
jest.mock('@pie-lib/controller-utils', () => ({
  ...jest.requireActual('@pie-lib/controller-utils'),
  getShuffledChoices: (choices, session, updateSession, key) => {
    const currentShuffled = ((session || {}).shuffledValues || []).filter(
      (v) => v
    );

    if (
      session &&
      !currentShuffled.length &&
      updateSession &&
      typeof updateSession === 'function'
    ) {
      updateSession();
    }

    return choices;
  },
  partialScoring: {
    enabled: (config, env) => {
      config = config || {};
      env = env || {};

      if (config.partialScoring === false) {
        return false;
      }

      if (env.partialScoring === false) {
        return false;
      }

      return true;
    },
  },
}));

const categories = [{ id: '1', label: 'One' }];
const choices = [
  { id: '1', content: 'Foo' },
  { id: '2', content: 'Bar' },
];

const category10 = { id: '10', label: 'SUM=10' };
const category11 = { id: '11', label: 'SUM=11' };

const choice3 = { id: '3', content: '3' };
const choice4 = { id: '4', content: '4' };
const choice5 = { id: '5', content: '5' };
const choice6 = { id: '6', content: '6' };
const choice7 = { id: '7', content: '7' };
const scoringCorrectResponseNoAlternates = [
  { category: '10', choices: ['3', '7'] },
  { category: '11', choices: ['4', '7'] },
];
const scoringCorrectResponseWithAlternates = [
  { category: '10', choices: ['3', '7'], alternateResponses: [['4', '6']] },
  { category: '11', choices: ['4', '7'], alternateResponses: [['5', '6']] },
];

const makeQuestion = (extras) => ({
  categories,
  choices,
  correctResponse: [{ category: '1', choices: ['1', '2'] }],
  lockChoiceOrder: true,
  ...extras,
});

describe('controller', () => {
  let question = makeQuestion();

  describe('model', () => {
    it('returns model', async () => {
      const result = await model(question, {}, { mode: 'gather' }, jest.fn());
      expect(result).toMatchObject({ ...question, correctResponse: undefined });
    });

    describe('disabled', () => {
      it('disabled false for gather', async () => {
        const result = await model(question, {}, { mode: 'gather' }, jest.fn());
        expect(result).toMatchObject({ disabled: false });
      });

      it('disabled true for view', async () => {
        const result = await model(question, {}, { mode: 'view' }, jest.fn());
        expect(result).toMatchObject({ disabled: true });
      });

      it('disabled true for evaluate', async () => {
        const result = await model(
          question,
          {},
          { mode: 'evaluate' },
          jest.fn()
        );
        expect(result).toMatchObject({ disabled: true });
      });
    });

    it('adds correctResponse for evaluate', async () => {
      const result = await model(question, {}, { mode: 'evaluate' }, jest.fn());
      expect(result).toMatchObject({
        correctResponse: [{ category: '1', choices: ['1', '2'] }],
      });
    });

    it('adds default config', async () => {
      const result = await model(question, {}, { mode: 'gather' }, jest.fn());
      expect(result).toMatchObject({
        choicesPerRow: 2,
        categoriesPerRow: 2,
        choicesLabel: '',
      });
    });

    describe('model - with updateSession', () => {
      it('calls updateSession', async () => {
        const session = { id: '1', element: 'categorize-element' };
        const env = { mode: 'gather' };
        const updateSession = jest.fn().mockResolvedValue();
        await model(
          {
            id: '1',
            element: 'categorize-element',
            ...question,
            lockChoiceOrder: false,
          },
          session,
          env,
          updateSession
        );
        expect(updateSession).toHaveBeenCalled();
      });
    });
  });

  describe('correct response', () => {
    it('returns correct response if env is correct', async () => {
      const sess = await createCorrectResponseSession(question, {
        mode: 'gather',
        role: 'instructor',
      });
      expect(sess).toEqual({
        answers: [
          {
            category: '1',
            choices: ['1', '2'],
          },
        ],
        id: 1,
      });
    });

    it('returns null env is student', async () => {
      const noResult = await createCorrectResponseSession(question, {
        mode: 'gather',
        role: 'student',
      });
      expect(noResult).toBeNull();
    });
  });

  const mC1 = [
    {
      id: '10',
      label: 'SUM=10',
      correct: true,
      choices: [
        { ...choice3, correct: true },
        { ...choice7, correct: true },
      ],
    },
    {
      id: '11',
      label: 'SUM=11',
      correct: false,
      choices: [
        { ...choice3, correct: true },
        { ...choice7, correct: false },
      ],
    },
  ];
  const mC2 = [
    {
      id: '10',
      label: 'SUM=10',
      correct: true,
      choices: [
        { ...choice3, correct: true },
        { ...choice7, correct: true },
      ],
    },
    {
      id: '11',
      label: 'SUM=11',
      correct: true,
      choices: [
        { ...choice3, correct: true },
        { ...choice7, correct: true },
      ],
    },
  ];
  const mC3 = [
    {
      id: '10',
      label: 'SUM=10',
      correct: true,
      choices: [
        { ...choice3, correct: true },
        { ...choice3, correct: false },
        { ...choice7, correct: true },
      ],
    },
    {
      id: '11',
      label: 'SUM=11',
      correct: true,
      choices: [
        { ...choice3, correct: true },
        { ...choice7, correct: true },
      ],
    },
  ];
  const mC4 = [
    {
      id: '10',
      label: 'SUM=10',
      correct: true,
      choices: [
        { ...choice3, correct: true },
        { ...choice3, correct: false },
        { ...choice7, correct: true },
      ],
    },
    {
      id: '11',
      label: 'SUM=11',
      correct: true,
      choices: [
        { ...choice3, correct: true },
        { ...choice7, correct: true },
        { ...choice7, correct: false },
      ],
    },
  ];
  const mC5 = [
    {
      id: '10',
      label: 'SUM=10',
      correct: false,
      choices: [
        { ...choice3, correct: false },
        { ...choice3, correct: false },
        { ...choice7, correct: false },
      ],
    },
    {
      id: '11',
      label: 'SUM=11',
      correct: false,
      choices: [
        { ...choice3, correct: false },
        { ...choice7, correct: false },
        { ...choice7, correct: false },
      ],
    },
  ];

  describe('getCorrectness', () => {
    it('mode: gather -> resolves undefined', () => {
      expect(getCorrectness(question, {}, { mode: 'gather' })).resolves.toEqual(
        undefined
      );
    });

    it('mode: view -> resolves undefined', () => {
      expect(getCorrectness(question, {}, { mode: 'view' })).resolves.toEqual(
        undefined
      );
    });

    const sessionCorrect = { answers: mC2 };
    const sessionPartially = { answers: mC1 };

    it.skip.each`
      session             | expected
      ${undefined}        | ${'incorrect'}
      ${null}             | ${'incorrect'}
      ${{}}               | ${'incorrect'}
      ${sessionCorrect}   | ${'correct'}
      ${sessionPartially} | ${'partially-correct'}
    `(
      'mode: evaluate -> resolves $expected if session is $session',
      async ({ session, expected }) => {
        const res = await getCorrectness(
          {
            ...question,
            partialScoring: true,
            categories: mC1,
            correctResponse: scoringCorrectResponseNoAlternates,
          },
          session,
          { mode: 'evaluate' }
        );

        expect(res).toEqual(expected);
      }
    );
  });

  describe('getTotalScore', () => {
    it.each`
      partialScoring | mockedCategories | fakeCorrect | expected
      ${true}        | ${mC1}           | ${false}    | ${0}
      ${false}       | ${mC1}           | ${false}    | ${0}
      ${true}        | ${mC1}           | ${true}     | ${1}
      ${false}       | ${mC1}           | ${true}     | ${1}
    `(
      'With Alternates, partialScoring = $partialScoring -> dychotomous: $expected',
      ({ partialScoring, mockedCategories, fakeCorrect, expected }) => {
        const totalScore = getTotalScore(
          {
            ...question,
            partialScoring,
            categories: mockedCategories,
            correctResponse: scoringCorrectResponseWithAlternates,
          },
          { answers: fakeCorrect ? mockedCategories : [] },
          {}
        );

        expect(totalScore).toEqual(expected);
      }
    );

    it.each`
      partialScoring | mockedCategories | expected
      ${true}        | ${mC1}           | ${0.75}
      ${false}       | ${mC1}           | ${0}
      ${true}        | ${mC2}           | ${1}
      ${false}       | ${mC2}           | ${0}
      ${true}        | ${mC3}           | ${0.75}
      ${true}        | ${mC4}           | ${0.5}
      ${true}        | ${mC5}           | ${0}
    `(
      'Without Alternates, partialScoring = $partialScoring -> $expected',
      ({ partialScoring, mockedCategories, expected }) => {
        const totalScore = getTotalScore(
          {
            ...question,
            partialScoring,
            categories: mockedCategories,
            correctResponse: scoringCorrectResponseNoAlternates,
          },
          { answers: [] },
          {}
        );

        expect(totalScore).toEqual(expected);
      }
    );
  });

  describe('getPartialScore', () => {
    it.each`
      mockedCategories | expected
      ${mC1}           | ${0.75}
      ${mC2}           | ${1}
      ${mC3}           | ${0.75}
      ${mC4}           | ${0.5}
      ${mC5}           | ${0}
    `(
      'Without Alternates, partialScoring = $partialScoring -> $expected',
      ({ mockedCategories, expected }) => {
        const totalScore = getPartialScore(
          scoringCorrectResponseNoAlternates,
          mockedCategories
        );

        expect(totalScore).toEqual(expected);
      }
    );
  });

  describe('outcome', () => {
    describe('mode: gather', () => {
      it('rejects with an error for gather', () => {
        expect(outcome(question, {}, { mode: 'gather' })).rejects.toEqual(
          expect.any(Error)
        );
      });
    });

    describe('mode: view', () => {
      it('rejects with an error for gather', () => {
        expect(outcome(question, {}, { mode: 'view' })).rejects.toEqual(
          expect.any(Error)
        );
      });
    });

    describe('mode: evaluate', () => {
      it.each`
        partialScoring | envPartialScoring | expected
        ${true}        | ${undefined}      | ${{ empty: false, score: 0.75 }}
        ${false}       | ${undefined}      | ${{ empty: false, score: 1 }}
        ${true}        | ${false}          | ${{ empty: false, score: 1 }}
        ${false}       | ${true}           | ${{ empty: false, score: 1 }}
      `(
        'element.partialScoring = $partialScoring, env.partialScoring = $envPartialScoring',
        async ({ partialScoring, envPartialScoring, expected }) => {
          const result = await outcome(
            {
              ...question,
              partialScoring,
              correctResponse: scoringCorrectResponseNoAlternates,
              categories: mC1,
            },
            { answers: mC1 },
            { mode: 'evaluate', partialScoring: envPartialScoring }
          );
          expect(result).toEqual(expected);
        }
      );
    });
  });
});
