import { model, outcome, createCorrectResponseSession } from '../index';

describe('controller', () => {
  let modelMocked, session, env;

  beforeEach(() => {
    modelMocked = {
      id: '1',
      element: 'matrix',
      promptEnabled: true,
      feedbackEnabled: true,
      labelType: 'agreement',
      rowLabels: [
        "I'm interested in politics.",
        "I'm interested in economics."
      ],
      columnLabels: ['Disagree', 'Unsure', 'Agree'],
      matrixValues: {},
      prompt: 'How interested are you in the following domains?'
    };
  });

  describe('model', () => {
    describe('mode: gather', () => {
      let result;
      beforeEach(async () => {
        session = {};
        env = { mode: 'gather' };
        result = await model(modelMocked, session, env);
      });

      it('returns disabled', () => {
        expect(result.disabled).toEqual(false);
      });

      it('returns mode', () => {
        expect(result.mode).toEqual('gather');
      });

      it('returns prompt', () => {
        expect(result.prompt).toEqual('How interested are you in the following domains?');
      });

      it('returns rowLabels', () => {
        expect(result.rowLabels).toEqual(['I\'m interested in politics.', 'I\'m interested in economics.']);
      });

      it('returns columnLabels', () => {
        expect(result.columnLabels).toEqual(['Disagree', 'Unsure', 'Agree']);
      });
    });

    describe('mode: view', () => {
      it('returns disabled', async () => {
        session = {};
        env = { mode: 'view' };
        const result = await model(modelMocked, session, env);
        expect(result.disabled).toEqual(true);
      });
    });

    describe('mode: evaluate', () => {
      it('returns choices w/ correct', async () => {
        session = {};
        env = { mode: 'evaluate' };
        const result = await model(modelMocked, session, env);

        expect(result).toEqual({
          "columnLabels": ["Disagree", "Unsure", "Agree"],
          "disabled": true,
          "element": "matrix",
          "feedbackEnabled": true,
          "id": "1",
          "labelType": "agreement",
          "matrixValues": {},
          "mode": "evaluate",
          "prompt": "How interested are you in the following domains?",
          "promptEnabled": true,
          "rowLabels": ["I'm interested in politics.", "I'm interested in economics."],
          "teacherInstructions": null
        });
      });
    });
  });

  describe('outcome', () => {
    it('returns score 0 if session is empty object', async () => {
      session = {};
      env = { mode: 'evaluate' };
      const outcomeResult = await outcome(modelMocked, session, env);
      expect(outcomeResult).toEqual({ score: 0, empty: true });
    });

    it('returns score 0 if session is null', async () => {
      session = null;
      env = { mode: 'evaluate' };
      const outcomeResult = await outcome(modelMocked, session, env);
      expect(outcomeResult).toEqual({ score: 0, empty: true });
    });

    it('returns score 9 if session is filled', async () => {
      const modelMocked = {
        id: '1',
        element: 'matrix',
        promptEnabled: true,
        feedbackEnabled: true,
        labelType: 'agreement',
        rowLabels: [
          "I'm interested in politics.",
          "I'm interested in economics."
        ],
        columnLabels: ['Disagree', 'Unsure', 'Agree'],
        matrixValues: { '0-0': 1, '0-1': 2, '0-2': 3, '1-0': 4, '1-1': 5, '1-2': 6 },
        prompt: 'How interested are you in the following domains?'
      };
      const session = {
        value: { '0-2': 3, '1-2': 6 }
      };
      env = { mode: 'evaluate' };
      const outcomeResult = await outcome(modelMocked, session, env);
      expect(outcomeResult).toEqual({ score: 9, empty: false });
    });
  });

  describe('correct response', () => {
    it('returns correct response if env is correct', async () => {
      const sess = await createCorrectResponseSession(modelMocked, { mode: 'gather', role: 'instructor' });
      expect(sess).toEqual({ 'id': '1', 'value': {} });
    });

    it('returns null env is student', async () => {
      const noResult = await createCorrectResponseSession(modelMocked, { mode: 'gather', role: 'student' });
      expect(noResult).toBeNull();
    });
  });
});
