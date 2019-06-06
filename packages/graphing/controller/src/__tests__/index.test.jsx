import { model } from '../index';
import { defaults as feedbackDefaults } from '@pie-lib/feedback';
import defaultValues from '../defaults';

describe('model', () => {
  let result, question, session, env;

  const defaultModel = {
    id: '1',
    element: 'graphing',
    minimumWidth: 500,
    multiple: false,
    partialScoring: [],
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
    configure: defaultValues.configure,
    graph: {
      lines: [{
        label: 'Line One',
        correctLine: '3x+2',
        initialView: '3x+3'
      }],
      graphTitle: '',
      graphWidth: 500,
      graphHeight: 500,
      domainLabel: '',
      domainMin: -10,
      domainMax: 10,
      domainStepValue: 1,
      domainSnapValue: 1,
      domainLabelFrequency: 1,
      domainGraphPadding: 50,
      rangeLabel: '',
      rangeMin: -10,
      rangeMax: 10,
      rangeStepValue: 1,
      rangeSnapValue: 1,
      rangeLabelFrequency: 1,
      rangeGraphPadding: 50,
      sigfigs: -1,
      showCoordinates: false,
      showPointLabels: true,
      showInputs: true,
      showAxisLabels: true,
      showFeedback: true
    }
  };

  const mkQuestion = model => model || defaultModel;

  describe('gather', () => {
    beforeEach(async () => {
      question = mkQuestion();
      session = { lines: [ { from: { x: 0, y: 0 }, to: { x: 1, y: 1} } ] };
      env = { mode: 'gather' };
      result = await model(question, session, env);
    });

    it('returns disabled:false', () => {
      expect(result.disabled).toEqual(false);
    });

    it('returns undefined for correctness ', () => {
      expect(result.correctness).toEqual(undefined);
    });

    it('returns undefined for correstResponse ', () => {
      expect(result.correctResponse).toEqual(undefined);
    });

    it('returns undefined for feedback', () => {
      expect(result.feedback).toEqual(undefined);
    });
  });

  describe('view', () => {
    beforeEach(async () => {
      question = mkQuestion();
      session = { lines: [ { from: { x: 0, y: 0 }, to: { x: 1, y: 1} } ] };
      env = { mode: 'view' };
      result = await model(question, session, env);
    });

    it('returns disabled:true', () => {
      expect(result.disabled).toEqual(true);
    });

    it('returns undefined for correctness ', () => {
      expect(result.correctness).toEqual(undefined);
    });

    it('returns undefined for correstResponse ', () => {
      expect(result.correctResponse).toEqual(undefined);
    });

    it('returns default correct for feedback', () => {
      expect(result.feedback).toEqual(undefined);
    });
  });

  describe('evaluate - empty', () => {
    beforeEach(async () => {
      question = mkQuestion();
      session = { lines: [] };
      env = { mode: 'evaluate' };
      result = await model(question, session, env);
    });

    it('returns disabled:true', () => {
      expect(result.disabled).toEqual(true);
    });

    it('returns empty for correctness ', () => {
      expect(result.correctness).toEqual({
        correctness: 'unanswered',
        score: '0%'
      });
    });

    it('returns empty for correctness, with no lines defined ', async () => {
      session = {};
      result = await model(question, session, env);
      expect(result.correctness).toEqual({
        correctness: 'unanswered',
        score: '0%'
      });
    });

    it('returns default for feedback', () => {
      expect(result.feedback).toEqual(feedbackDefaults.unanswered.default);
    });
  });

  describe('evaluate - partially correct', () => {
    beforeEach(async () => {
      env = { mode: 'evaluate' };
    });

    it('does not return partially-correct for correctness when partial scores are not allowed', async () => {
      question = mkQuestion({
        ...defaultModel,
        configure: {
          ...defaultModel.configure,
          allowPartialScoring: false,
        }
      });

      session = { lines: [{ from: { x: 0, y: 0 }, to: { x: 1, y: 1} }] };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('incorrect');
      expect(result.correctness.score).toEqual('0%');
    });

    it('returns partially-correct for correctness', async () => {
      question = mkQuestion({
          ...defaultModel,
          configure: {
            ...defaultModel.configure,
            allowPartialScoring: true,
          },
          graph: {
            lines: [{
              label: 'Line One',
              correctLine: '3x+1',
              initialView: '3x+3'
            }, {
              label: 'Line Two',
              correctLine: '3x+2',
              initialView: '3x+3'
            }, {
              label: 'Line Three',
              correctLine: '3x+3',
              initialView: '3x+4'
            }, {
              label: 'Line Four',
              correctLine: '3x+4',
              initialView: '3x+5'
            }]
          },
          partialScoring: [
            { numberOfCorrect: 1, scorePercentage: 50 },
            { numberOfCorrect: 2, scorePercentage: 60 },
            { numberOfCorrect: 3, scorePercentage: 70 }
          ]
        }
      );

      session = { lines: [{ from: { x: -1, y: -2 }, to: { x: 1, y: 4 } }] };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('partial');
      expect(result.correctness.score).toEqual('50%');

      session = { lines: [{ from: { x: -2, y: -4 }, to: { x: 0, y: 2 } }] };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('partial');
      expect(result.correctness.score).toEqual('50%');

      session = { lines: [
        { from: { x: -1, y: -2 }, to: { x: 1, y: 4 } },
        { from: { x: -2, y: -4 }, to: { x: 0, y: 2 } }
      ] };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('partial');
      expect(result.correctness.score).toEqual('60%');

      session = { lines: [
          { from: { x: -2, y: -4 }, to: { x: 0, y: 2 } },
          { from: { x: -1, y: -2 }, to: { x: 1, y: 4 } }
        ] };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('partial');
      expect(result.correctness.score).toEqual('60%');

      session = { lines: [
          { from: { x: -2, y: -4 }, to: { x: 0, y: 2 } },
          { from: { x: -1, y: -2 }, to: { x: 1, y: 4 } },
          { from: { x: -3, y: -6 }, to: { x: 0, y: 3 } }
        ] };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('partial');
      expect(result.correctness.score).toEqual('70%');

      session = { lines: [
          { from: { x: -3, y: -6 }, to: { x: 0, y: 3 } },
          { from: { x: -1, y: -2 }, to: { x: 1, y: 4 } },
          { from: { x: -2, y: -4 }, to: { x: 0, y: 1 } }
        ] };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('partial');
      expect(result.correctness.score).toEqual('60%');

      session = { lines: [
          { from: { x: -3, y: -6 }, to: { x: 0, y: 1 } },
          { from: { x: -1, y: -2 }, to: { x: 1, y: 4 } },
          { from: { x: -2, y: -4 }, to: { x: 0, y: 1 } }
        ] };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('partial');
      expect(result.correctness.score).toEqual('50%');
    });

    it('returns correct for correctness when partial correctness is enabled', async () => {
      question = mkQuestion({
        ...defaultModel,
        configure: {
          ...defaultModel.configure,
          allowPartialScoring: true,
        },
        graph: {
          ...defaultModel.graph,
          lines: [{
            label: 'Line One',
            correctLine: '3x+1',
            initialView: '3x+3'
          }, {
            label: 'Line Two',
            correctLine: '3x+2',
            initialView: '3x+3'
          }, {
            label: 'Line Three',
            correctLine: '3x+3',
            initialView: '3x+4'
          }, {
            label: 'Line Four',
            correctLine: '3x+4',
            initialView: '3x+5'
          }]
        },
        partialScoring: [
          { numberOfCorrect: 1, scorePercentage: 50 },
          { numberOfCorrect: 2, scorePercentage: 60 },
          { numberOfCorrect: 3, scorePercentage: 70 }
        ]
      });

      session = { lines: [
          { from: { x: -2, y: -4 }, to: { x: 0, y: 2 } },
          { from: { x: -1, y: -2 }, to: { x: 1, y: 4 } },
          { from: { x: -3, y: -6 }, to: { x: 0, y: 3 } },
          { from: { x: -2, y: -3 }, to: { x: -1, y: 0 } }
        ] };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('correct');
      expect(result.correctness.score).toEqual('100%');

      session = { lines: [
          { from: { x: -2, y: -4 }, to: { x: 0, y: 2 } },
          { from: { x: -3, y: -6 }, to: { x: 0, y: 3 } },
          { from: { x: -2, y: -3 }, to: { x: -1, y: 0 } },
          { from: { x: -1, y: -2 }, to: { x: 1, y: 4 } }
        ] };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('correct');
      expect(result.correctness.score).toEqual('100%');

      session = { lines: [
          { from: { x: -3, y: -6 }, to: { x: 0, y: 3 } },
          { from: { x: -1, y: -2 }, to: { x: 1, y: 4 } },
          { from: { x: -2, y: -3 }, to: { x: -1, y: 0 } },
          { from: { x: -2, y: -4 }, to: { x: 0, y: 2 } }
        ] };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('correct');
      expect(result.correctness.score).toEqual('100%');
    });
  });

  describe('evaluate - correct', () => {
    beforeEach(async () => {
      env = { mode: 'evaluate' };
    });

    it('returns correct for correctness when partial correctness is not enabled', async () => {
      question = mkQuestion({
        ...defaultModel,
        configure: {
          ...defaultModel.configure,
          allowPartialScoring: false,
        },
        graph: {
          ...defaultModel.graph,
          lines: [{
            label: 'Line One',
            correctLine: '3x+1',
            initialView: '3x+3'
          }, {
            label: 'Line Two',
            correctLine: '3x+2',
            initialView: '3x+3'
          }, {
            label: 'Line Three',
            correctLine: '3x+3',
            initialView: '3x+4'
          }, {
            label: 'Line Four',
            correctLine: '3x+4',
            initialView: '3x+5'
          }]
        },
        partialScoring: [
          { numberOfCorrect: 1, scorePercentage: 50 },
          { numberOfCorrect: 2, scorePercentage: 60 },
          { numberOfCorrect: 3, scorePercentage: 70 }
        ]
      });

      session = { lines: [
          { from: { x: -2, y: -4 }, to: { x: 0, y: 2 } },
          { from: { x: -1, y: -2 }, to: { x: 1, y: 4 } },
          { from: { x: -3, y: -6 }, to: { x: 0, y: 3 } },
          { from: { x: -2, y: -3 }, to: { x: -1, y: 0 } }
        ] };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('correct');
      expect(result.correctness.score).toEqual('100%');

      session = { lines: [
          { from: { x: -1, y: -2 }, to: { x: 1, y: 4 } },
          { from: { x: -2, y: -3 }, to: { x: -1, y: 0 } },
          { from: { x: -2, y: -4 }, to: { x: 0, y: 2 } },
          { from: { x: -3, y: -6 }, to: { x: 0, y: 3 } }
        ] };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('correct');
      expect(result.correctness.score).toEqual('100%');

    });
  });
});
