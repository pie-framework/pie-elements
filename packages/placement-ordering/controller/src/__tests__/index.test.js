import _ from 'lodash';
import * as controller from '../index';

describe('index', () => {
  let base = o => {
    o = _.merge(
      {
        itemStem: 'hi',
        choices: [],
        correctResponse: []
      },
      o
    );
    return o;
  };

  describe('model', () => {
    let assertModel = (q, s, e, partialExpected) => {
      return async () => {
        if (_.isFunction(partialExpected) && partialExpected.name === 'Error') {
          expect(() => controller.model(q, s, e)).toThrow(Error);
          return Promise.resolve();
        } else {
          const result = await controller.model(q, s, e);
          if (_.isFunction(partialExpected)) {
            return partialExpected(result);
          } else {
            expect(result).toMatchObject(partialExpected);
          }
        }
      };
    };

    it(
      'returns prompt',
      assertModel(base(), {}, {}, m => expect(m.prompt).toEqual('hi'))
    );

    it(
      'returns empty config for mode=gather',
      assertModel(base(), {}, { mode: 'gather' }, {})
    );

    it(
      'returns empty config for mode=view',
      assertModel(base(), {}, { mode: 'view' }, { disabled: true })
    );

    it(
      'returns config.disabled=true for mode=evaluate',
      assertModel(base(), {}, { mode: 'evaluate' }, { disabled: true })
    );

    it(
      'returns feedback',
      assertModel(
        base({
          correctResponse: ['a', 'b'],
          feedback: { correct: { type: 'custom', custom: 'foo' } }
        }),
        { value: ['a', 'b'] },
        { mode: 'evaluate' },
        { feedback: 'foo' }
      )
    );

    describe('choices and outcomes', () => {
      let model, session, env;

      model = base({
        correctResponse: ['a', 'b'],
        choices: [{ label: 'a', id: 'a' }, { label: 'b', id: 'b' }]
      });

      session = { value: ['a', 'b'] };
      env = { mode: 'evaluate' };

      it(
        'choices',
        assertModel(
          model,
          {},
          {},
          {
            choices: [{ id: 'a', label: 'a' }, { id: 'b', label: 'b' }]
          }
        )
      );

      it(
        'returns outcomes - 2 correct',
        assertModel(model, session, env, {
          outcomes: [
            { id: 'a', outcome: 'correct' },
            { id: 'b', outcome: 'correct' }
          ]
        })
      );

      it(
        'returns outcomes - 1 correct',
        assertModel(model, { value: ['a'] }, env, {
          outcomes: [{ id: 'a', outcome: 'correct' }]
        })
      );

      it(
        'does not return config.correctResponse - 1 correct',
        assertModel(model, session, env, { disabled: true })
      );

      it(
        'returns outcomes - 2 incorrect',
        assertModel(model, { value: ['b', 'a'] }, env, {
          outcomes: [
            { id: 'b', outcome: 'incorrect' },
            { id: 'a', outcome: 'incorrect' }
          ]
        })
      );

      it(
        'returns config.correctResponse - 2 - incorrect',
        assertModel(model, { value: ['b', 'a'] }, env, {
          correctResponse: ['a', 'b']
        })
      );
    });

    describe('shuffle', () => {
      let model = {
        correctResponse: ['a', 'b'],
        itemStem: 'this is a prompt',
        choices: [
          { label: 'one', id: '1', shuffle: false },
          { label: 'two', id: '2' },
          { label: 'three', id: '3' }
        ],
        shuffle: true
      };

      let session = {};
      let env = {};

      it('does not shuffle choice marked "shuffle": false', () =>
        controller.model(model, session, env).then(result => {
          expect(result.choices[0]).toEqual({
            label: 'one',
            id: '1',
            shuffle: false
          });
        }));

      it('shuffles choices not marked "shuffle": false', () =>
        controller.model(model, session, env).then(result => {
          expect(result.choices[1]).not.toEqual({
            label: 'one',
            id: '1',
            shuffle: false
          });
          expect(result.choices[2]).not.toEqual({
            label: 'one',
            id: '1',
            shuffle: false
          });
        }));
    });
  });

  describe('outcome', () => {
    const assertOutcome = (question, value, expectedScore, env) => {
      it(`${expectedScore} when answer: ${value} and question: ${JSON.stringify(
        question
      )}, env: ${JSON.stringify(env)}`, async () => {
        const result = await controller.outcome(question, { value }, env);
        expect(result.score).toEqual(expectedScore);
      });
    };
    const assertOutcomeError = (question, session, env) => {
      it(`throws error for ${JSON.stringify(question)}`, () =>
        expect(controller.outcome(question, session, env)).rejects.toThrow(
          controller.questionError()
        ));
    };
    assertOutcomeError(null, {}, {});
    assertOutcomeError({}, {}, {});
    assertOutcomeError({ correctResponse: [] }, {}, {});
    assertOutcome({ partialScoring: true, correctResponse: ['a'] }, ['a'], 1);
    assertOutcome({ partialScoring: true, correctResponse: ['a'] }, ['b'], 0);
    assertOutcome({ correctResponse: ['a', 'b', 'c'] }, ['a', 'b'], 0.33);
    assertOutcome(
      { partialScoring: true, correctResponse: ['a', 'b', 'c'] },
      ['a', 'b'],
      0.33
    );
    assertOutcome(
      { partialScoring: false, correctResponse: ['a', 'b', 'c'] },
      ['a', 'b'],
      0
    );
    assertOutcome(
      { partialScoring: false, correctResponse: ['a', 'b', 'c'] },
      ['a', 'b'],
      0.33,
      { partialScoring: true }
    );
  });
});
