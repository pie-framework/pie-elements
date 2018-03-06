import _ from 'lodash';
import * as controller from '../index';


describe('index', () => {

  let base = (o) => {
    o = _.merge({
      model: {
        prompt: 'hi',
        choices: []
      },
      correctResponse: []
    }, o);
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
      }
    };

    it('throws an error for an empty model', assertModel({}, {}, {}, Error));
    it('returns prompt', assertModel(base(), {}, {}, m => expect(m.prompt).toEqual('hi')));

    it('returns empty config for mode=gather', assertModel(base(), {}, { mode: 'gather' }, {}));
    it('returns empty config for mode=view', assertModel(base(), {}, { mode: 'view' }, { disabled: true }));
    it('returns config.disabled=true for mode=evaluate', assertModel(base(), {}, { mode: 'evaluate' }, { disabled: true }));

    it('returns feedback', assertModel(
      base({ correctResponse: ['a', 'b'], feedback: { correctFeedback: 'foo', correctFeedbackType: 'custom' } }),
      { value: ['a', 'b'] },
      { mode: 'evaluate' },
      { feedback: 'foo' }
    ));

    describe('choices and outcomes', () => {
      let model, session, env;

      model = base({
        correctResponse: ['a', 'b'],
        model: {
          choices: [
            { label: 'a', id: 'a' },
            { label: 'b', id: 'b' }
          ]
        }
      });
      session = { value: ['a', 'b'] };
      env = { mode: 'evaluate' };

      it('choices', assertModel(model, {}, {}, {
        choices: [{ id: 'a', label: 'a' }, { id: 'b', label: 'b' }]
      }));

      it('returns outcomes - 2 correct', assertModel(model, session, env, {
        outcomes: [{ id: 'a', outcome: 'correct' }, { id: 'b', outcome: 'correct' }]
      }));

      it('returns outcomes - 1 correct', assertModel(model, { value: ['a'] }, env, {
        outcomes: [{ id: 'a', outcome: 'correct' }]
      }));


      it('does not return config.correctResponse - 1 correct', assertModel(model, session, env, { disabled: true }));

      it('returns outcomes - 2 incorrect', assertModel(model, { value: ['b', 'a'] }, env, {
        outcomes: [
          { id: 'b', outcome: 'incorrect' },
          { id: 'a', outcome: 'incorrect' }]
      }));

      it('returns config.correctResponse - 2 - incorrect', assertModel(model, { value: ['b', 'a'] }, env, {
        correctResponse: ['a', 'b']
      }));
    });

    describe('shuffle', () => {
      let model = {
        correctResponse: ['a', 'b'],
        model: {
          prompt: 'this is a prmopt',
          choices: [
            { label: 'one', id: '1', shuffle: false },
            { label: 'two', id: '2' },
            { label: 'three', id: '3' }
          ]
        },
        config: {
          shuffle: true
        }
      };

      let session = {};
      let env = {};

      it('does not shuffle choice marked "shuffle": false', () => controller.model(model, session, env)
        .then(result => {
          expect(result.choices[0]).toEqual({ label: 'one', id: '1', shuffle: false });
        }));

      it('shuffles choices not marked "shuffle": false', () => controller.model(model, session, env)
        .then(result => {
          expect(result.choices[1]).not.toEqual({ label: 'one', id: '1', shuffle: false });
          expect(result.choices[2]).not.toEqual({ label: 'one', id: '1', shuffle: false });
        }));
    });

  });

  describe('outcome', () => {
    let outcome = (q, s, e, handler) => {
      return (done) => {
        controller.outcome(q, s, e)
          .then(o => {
            handler(o);
            done();
          })
          .catch(e => {
            handler(e);
            done();
          });
      }
    }

    it('returns an error if the question is null', outcome(null, {}, {}, (result) => {
      expect(result.message).toEqual('Question is missing required array: correctResponse');
    }));

    it('returns an error if the question.correctResponse', outcome({}, {}, {}, (result) => {
      expect(result.message).toEqual('Question is missing required array: correctResponse');
    }));

    it('returns an error if the question.correctResponse is empty', outcome({ correctResponse: [] }, {}, {}, (result) => {
      expect(result.message).toEqual('Question is missing required array: correctResponse');
    }));

    it('returns score.scaled: 1 for a correct response', outcome({
      correctResponse: ['a']
    }, { value: ['a'] }, null, (result) => {
      expect(result).toEqual({
        score: {
          scaled: 1
        }
      })
    }));

    it('returns score.scaled: 0 for an incorrect response', outcome({
      correctResponse: ['a']
    }, { value: ['b'] }, null, (result) => {
      expect(result).toEqual({
        score: {
          scaled: 0
        }
      })
    }));
  });
});