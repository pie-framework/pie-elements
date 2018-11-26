import { model } from '../index';
// import { defaults as feedbackDefaults } from '@pie-lib/feedback';

describe('model', () => {
  let result, question, session, env;

  const defaultModel = {
    feedback: {
      correct: {
        type: 'none',
        default: 'Correct'
      },
      partial: {
        type: 'none',
        default: 'Nearly'
      },
      incorrect: {
        type: 'none',
        default: 'Incorrect'
      }
    },
  };

  const mkQuestion = model => model || defaultModel;

  describe('gather', () => {
    beforeEach(async () => {
      question = mkQuestion();
      session = {};
      env = { mode: 'gather' };
      result = await model(question, session, env);
    });

    it('returns disabled:false', () => {
      expect(result.disabled).toEqual(false);
    });

    // it('returns undefined for correctness ', () => {
    //   expect(result.correctness.correctness).toEqual(undefined);
    // });
    //
    // it('returns undefined for feedback', () => {
    //   expect(result.feedback).toEqual(undefined);
    // });
  });

  // describe('view', () => {
  //   beforeEach(async () => {
  //     question = mkQuestion();
  //     session = {};
  //     env = { mode: 'view' };
  //     result = await model(question, session, env);
  //   });
  //
  //   it('returns disabled:true', () => {
  //     expect(result.disabled).toEqual(true);
  //   });
  //
  //   it('returns undefined for correctness ', () => {
  //     expect(result.correctness.correctness).toEqual(undefined);
  //   });
  //
  //   it('returns default correct for feedback', () => {
  //     expect(result.feedback).toEqual(undefined);
  //   });
  // });
  //
  // describe('evaluate - empty', () => {
  //   beforeEach(async () => {
  //     question = mkQuestion();
  //     session = { answers: {} };
  //     env = { mode: 'evaluate' };
  //     result = await model(question, session, env);
  //   });
  //
  //   it('returns disabled:true', () => {
  //     expect(result.disabled).toEqual(true);
  //   });
  //
  //   it('returns empty for correctness', () => {
  //     expect(result.correctness).toEqual({
  //       correctness: 'unanswered',
  //       score: '0%'
  //     });
  //   });
  //
  //   it('returns empty for correctness with empty session', async () => {
  //     session = { answers: {} };
  //     result = await model(question, session, env);
  //     expect(result.correctness).toEqual({
  //       correctness: 'unanswered',
  //       score: '0%'
  //     });
  //   });
  //
  //   it('returns default for feedback', async () => {
  //     expect(result.feedback).toEqual(feedbackDefaults.unanswered.default);
  //   });
  // });
  //
  // describe('evaluate - partially correct', () => {
  //   beforeEach(async () => {
  //     env = { mode: 'evaluate' };
  //   });
  //
  //   it('does not return partially-correct for correctness when partial scores are not allowed', async () => {
  //     question = mkQuestion({
  //       ...defaultModel,
  //       allowPartialScoring: false,
  //     });
  //
  //     session = {
  //       answers: {
  //         1: [false, false],
  //         2: [false, false],
  //         3: [false, false]
  //       }
  //     };
  //
  //     result = await model(question, session, env);
  //
  //     expect(result.correctness.correctness).toEqual('incorrect');
  //     expect(result.correctness.score).toEqual('0%');
  //   });
  //
  //   it('returns partially-correct for correctness', async () => {
  //     question = mkQuestion({
  //       ...defaultModel,
  //       allowPartialScoring: true,
  //       partialScoring: true
  //     });
  //
  //     session = {
  //       answers: {
  //         1: [false, false]
  //       }
  //     };
  //
  //     result = await model(question, session, env);
  //
  //     expect(result.correctness.correctness).toEqual('partial');
  //     expect(result.correctness.score).toEqual('25%');
  //
  //     session = {
  //       answers: {
  //         2: [false, false]
  //       }
  //     };
  //
  //     result = await model(question, session, env);
  //
  //     expect(result.correctness.correctness).toEqual('partial');
  //     expect(result.correctness.score).toEqual('25%');
  //
  //     session = {
  //       answers: {
  //         1: [false, false],
  //         2: [false, false]
  //       }
  //     };
  //
  //     result = await model(question, session, env);
  //
  //     expect(result.correctness.correctness).toEqual('partial');
  //     expect(result.correctness.score).toEqual('50%');
  //
  //     session = {
  //       answers: {
  //         2: [false, false],
  //         4: [false, false]
  //       }
  //     };
  //
  //     result = await model(question, session, env);
  //
  //     expect(result.correctness.correctness).toEqual('partial');
  //     expect(result.correctness.score).toEqual('50%');
  //
  //     session = {
  //       answers: {
  //         2: [false, false],
  //         3: [false, false],
  //         4: [false, false]
  //       }
  //     };
  //
  //     result = await model(question, session, env);
  //
  //     expect(result.correctness.correctness).toEqual('partial');
  //     expect(result.correctness.score).toEqual('75%');
  //
  //     session = {
  //       answers: {
  //         1: [false, false],
  //         3: [false, false],
  //         4: [false, true]
  //       }
  //     };
  //
  //     result = await model(question, session, env);
  //
  //     expect(result.correctness.correctness).toEqual('partial');
  //     expect(result.correctness.score).toEqual('63%');
  //
  //     session = {
  //       answers: {
  //         1: [true, false],
  //         3: [true, false],
  //         4: [false, false]
  //       }
  //     };
  //
  //     result = await model(question, session, env);
  //
  //     expect(result.correctness.correctness).toEqual('partial');
  //     expect(result.correctness.score).toEqual('50%');
  //   });
  //
  //   it('returns correct for correctness when partial correctness is enabled', async () => {
  //     question = mkQuestion({
  //       ...defaultModel,
  //       allowPartialScoring: true,
  //       partialScoring: true
  //     });
  //
  //     session = {
  //       answers: {
  //         1: [false, false],
  //         2: [false, false],
  //         3: [false, false],
  //         4: [false, false]
  //       }
  //     };
  //
  //     result = await model(question, session, env);
  //
  //     expect(result.correctness.correctness).toEqual('correct');
  //     expect(result.correctness.score).toEqual('100%');
  //
  //     session = {
  //       answers: {
  //         2: [false, false],
  //         3: [false, false],
  //         1: [false, false],
  //         4: [false, false]
  //       }
  //     };
  //
  //     result = await model(question, session, env);
  //
  //     expect(result.correctness.correctness).toEqual('correct');
  //     expect(result.correctness.score).toEqual('100%');
  //
  //     session = {
  //       answers: {
  //         4: [false, false],
  //         2: [false, false],
  //         3: [false, false],
  //         1: [false, false]
  //       }
  //     };
  //
  //     result = await model(question, session, env);
  //
  //     expect(result.correctness.correctness).toEqual('correct');
  //     expect(result.correctness.score).toEqual('100%');
  //   });
  // });
  //
  // describe('evaluate - correct', () => {
  //   beforeEach(async () => {
  //     env = { mode: 'evaluate' };
  //   });
  //
  //   it('returns correct for correctness when partial correctness is not enabled', async () => {
  //     question = mkQuestion({
  //       ...defaultModel,
  //       allowPartialScoring: false,
  //       partialScoring: false
  //     });
  //
  //     session = {
  //       answers: {
  //         1: [false, false],
  //         2: [false, false],
  //         3: [false, false],
  //         4: [false, false]
  //       }
  //     };
  //
  //     result = await model(question, session, env);
  //
  //     expect(result.correctness.correctness).toEqual('correct');
  //     expect(result.correctness.score).toEqual('100%');
  //
  //     session = {
  //       answers: {
  //         1: [false, false],
  //         4: [false, false],
  //         2: [false, false],
  //         3: [false, false]
  //       }
  //     };
  //     result = await model(question, session, env);
  //
  //     expect(result.correctness.correctness).toEqual('correct');
  //     expect(result.correctness.score).toEqual('100%');
  //
  //   });
  // });
});
