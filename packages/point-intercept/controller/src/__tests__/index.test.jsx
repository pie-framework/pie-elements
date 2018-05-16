import { model } from '../index';
import { defaults as feedbackDefaults } from '@pie-lib/feedback';

describe('model', () => {
  let result, question, session, env;

  const defaultModel = {
    minimumWidth: 500,
    correctResponse: ['0,0', '1,1', '2,2', '3,3'],
    partialScoring: [],
    feedback: {
      correctFeedbackType: 'none',
      correctFeedbackValue: '',
      partialFeedbackType: 'none',
      partialFeedbackValue: '',
      incorrectFeedbackType: 'none',
      incorrectFeedbackValue: ''
    },
    model: {
      config: {
        graphTitle: '',
        graphWidth: 500,
        graphHeight: 500,
        maxPoints: '',
        labelsType: 'present',
        pointLabels: ['A', 'B', 'C', 'D'],
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
        allowPartialScoring: false,
        pointsMustMatchLabels: false,
        showCoordinates: false,
        showPointLabels: true,
        showInputs: true,
        showAxisLabels: true,
        showFeedback: true
      }
    }
  };

  const mkQuestion = model => model || defaultModel;

  describe('gather', () => {
    beforeEach(async () => {
      question = mkQuestion();
      session = { points: [{ x: 0, y: 0, label: 'A' }] };
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
      session = { points: [{ x: 0, y: 0, label: 'A' }] };
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
      session = { points: [] };
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

    it('returns empty for correctness, with no points defined ', async () => {
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
        model: {
          ...defaultModel.model,
          config: {
            ...defaultModel.model.config,
            allowPartialScoring: false,
            pointsMustMatchLabels: false
          }
        }
      });

      session = {
        points: [{ x: 0, y: 0, label: 'A' }]
      };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('incorrect');
      expect(result.correctness.score).toEqual('0%');
    });

    it('returns partially-correct for correctness when labels must not match', async () => {
      question = mkQuestion({
        ...defaultModel,
        model: {
          ...defaultModel.model,
          config: {
            ...defaultModel.model.config,
            allowPartialScoring: true,
            pointsMustMatchLabels: false
          }
        },
        partialScoring: [
          { numberOfCorrect: 1, scorePercentage: 50 },
          { numberOfCorrect: 2, scorePercentage: 60 },
          { numberOfCorrect: 3, scorePercentage: 70 }
        ]
      });

      session = {
        points: [{ x: 0, y: 0, label: 'A' }]
      };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('partial');
      expect(result.correctness.score).toEqual('50%');

      session = {
        points: [{ x: 0, y: 0, label: 'C' }]
      };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('partial');
      expect(result.correctness.score).toEqual('50%');

      session = {
        points: [{ x: 0, y: 0, label: 'A' }, { x: 1, y: 1, label: 'B' }]
      };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('partial');
      expect(result.correctness.score).toEqual('60%');

      session = {
        points: [{ x: 0, y: 0, label: 'B' }, { x: 1, y: 1, label: 'A' }]
      };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('partial');
      expect(result.correctness.score).toEqual('60%');

      session = {
        points: [
          { x: 0, y: 0, label: 'B' },
          { x: 1, y: 1, label: 'A' },
          { x: 2, y: 2, label: 'C' }
        ]
      };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('partial');
      expect(result.correctness.score).toEqual('70%');

      session = {
        points: [
          { x: 0, y: 0, label: 'C' },
          { x: 1, y: 1, label: 'A' },
          { x: 2, y: 5, label: 'B' }
        ]
      };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('partial');
      expect(result.correctness.score).toEqual('60%');
    });

    it('returns partially-correct for correctness when labels must match', async () => {
      question = mkQuestion({
        ...defaultModel,
        model: {
          ...defaultModel.model,
          config: {
            ...defaultModel.model.config,
            allowPartialScoring: true,
            pointsMustMatchLabels: true
          }
        },
        partialScoring: [
          { numberOfCorrect: 1, scorePercentage: 50 },
          { numberOfCorrect: 2, scorePercentage: 60 },
          { numberOfCorrect: 3, scorePercentage: 70 }
        ]
      });

      session = {
        points: [{ x: 0, y: 0, label: 'A' }]
      };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('partial');
      expect(result.correctness.score).toEqual('50%');

      session = {
        points: [{ x: 0, y: 0, label: 'C' }]
      };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('incorrect');
      expect(result.correctness.score).toEqual('0%');

      session = {
        points: [{ x: 0, y: 0, label: 'A' }, { x: 1, y: 1, label: 'B' }]
      };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('partial');
      expect(result.correctness.score).toEqual('60%');

      session = {
        points: [{ x: 0, y: 0, label: 'B' }, { x: 1, y: 1, label: 'A' }]
      };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('incorrect');
      expect(result.correctness.score).toEqual('0%');

      session = {
        points: [
          { x: 0, y: 0, label: 'B' },
          { x: 1, y: 1, label: 'A' },
          { x: 2, y: 2, label: 'C' }
        ]
      };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('partial');
      expect(result.correctness.score).toEqual('50%');

      session = {
        points: [
          { x: 0, y: 0, label: 'C' },
          { x: 1, y: 1, label: 'A' },
          { x: 2, y: 5, label: 'B' }
        ]
      };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('incorrect');
      expect(result.correctness.score).toEqual('0%');

      session = {
        points: [
          { x: 0, y: 0, label: 'C' },
          { x: 1, y: 1, label: 'A' },
          { x: 3, y: 3, label: 'D' },
          { x: 5, y: 3, label: 'B' }
        ]
      };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('partial');
      expect(result.correctness.score).toEqual('50%');
    });

    it('returns correct for correctness when partial correctness is enabled', async () => {
      question = mkQuestion({
        ...defaultModel,
        model: {
          ...defaultModel.model,
          config: {
            ...defaultModel.model.config,
            allowPartialScoring: true,
            pointsMustMatchLabels: true
          }
        },
        partialScoring: [
          { numberOfCorrect: 1, scorePercentage: 50 },
          { numberOfCorrect: 2, scorePercentage: 60 },
          { numberOfCorrect: 3, scorePercentage: 70 }
        ]
      });

      session = {
        points: [
          { x: 0, y: 0, label: 'A' },
          { x: 1, y: 1, label: 'B' },
          { x: 2, y: 2, label: 'C' },
          { x: 3, y: 3, label: 'D' }
        ]
      };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('correct');
      expect(result.correctness.score).toEqual('100%');

      question = mkQuestion({
        ...defaultModel,
        model: {
          ...defaultModel.model,
          config: {
            ...defaultModel.model.config,
            allowPartialScoring: true,
            pointsMustMatchLabels: false
          }
        },
        partialScoring: [
          { numberOfCorrect: 1, scorePercentage: 50 },
          { numberOfCorrect: 2, scorePercentage: 60 },
          { numberOfCorrect: 3, scorePercentage: 70 }
        ]
      });

      session = {
        points: [
          { x: 0, y: 0, label: 'B' },
          { x: 1, y: 1, label: 'D' },
          { x: 2, y: 2, label: 'C' },
          { x: 3, y: 3, label: 'A' }
        ]
      };

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
        model: {
          ...defaultModel.model,
          config: {
            ...defaultModel.model.config,
            allowPartialScoring: false,
            pointsMustMatchLabels: true
          }
        }
      });

      session = {
        points: [
          { x: 0, y: 0, label: 'A' },
          { x: 1, y: 1, label: 'B' },
          { x: 2, y: 2, label: 'C' },
          { x: 3, y: 3, label: 'D' }
        ]
      };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('correct');
      expect(result.correctness.score).toEqual('100%');

      question = mkQuestion({
        ...defaultModel,
        model: {
          ...defaultModel.model,
          config: {
            ...defaultModel.model.config,
            allowPartialScoring: false,
            pointsMustMatchLabels: false
          }
        }
      });

      session = {
        points: [
          { x: 0, y: 0, label: 'B' },
          { x: 1, y: 1, label: 'D' },
          { x: 2, y: 2, label: 'C' },
          { x: 3, y: 3, label: 'A' }
        ]
      };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('correct');
      expect(result.correctness.score).toEqual('100%');
    });
  });
});
