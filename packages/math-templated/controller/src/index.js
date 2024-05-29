import debug from 'debug';
import isEmpty from 'lodash/isEmpty';
import Translator from '@pie-lib/pie-toolbox/translator';
import * as mv from '@pie-framework/math-validation';
import { getFeedbackForCorrectness } from '@pie-lib/pie-toolbox/feedback';

import defaults from './defaults';
import { partialScoring } from '@pie-lib/pie-toolbox/controller-utils';

const { translator } = Translator;
const log = debug('@pie-element:math-templated:controller');

const getFeedback = value => value ? 'correct' : 'incorrect';

const getIsAnswerCorrect = (correctResponse, answerItem) => {
  let answerCorrect = false;

  const opts = {
    mode: correctResponse.validation || defaults.validationDefault,
    ...(correctResponse.validation === 'literal' && {
      literal: {
        allowTrailingZeros: correctResponse.allowTrailingZeros || false,
        ignoreOrder: correctResponse.ignoreOrder || false,
      }
    })
  };

  if (!answerCorrect) {
    const acceptedValues = [
      correctResponse.answer,
      ...Object.values(correctResponse.alternates || {})
    ];

    try {
      for (const value of acceptedValues) {
        answerCorrect = mv.latexEqual(answerItem.value, value, opts);
        if (answerCorrect) break;
      }
    } catch (e) {
      log('Parse failure when evaluating math', e, correctResponse, answerItem);
      answerCorrect = false;
    }
  }

  return answerCorrect;
};

const getResponseCorrectness = (question, sessionResponse) => {
  const correctResponses = question.responses;

  if (!sessionResponse) {
    return {
      correctness: 'unanswered',
      score: 0,
      correct: false,
    };
  } else {
    let correctAnswers = 0;
    let score = 0;
    let correct = false;
    Object.keys(correctResponses).forEach((responseId) => {
      const answerItem = sessionResponse['r' + responseId];
      const correctResponse = correctResponses[responseId];

      const answerCorrect = getIsAnswerCorrect(correctResponse, answerItem);
      if (answerCorrect) {
        correctAnswers++;
      }
    });

    // partial credit scoring: each correct answer is worth 1 / total answers point
    // dichotomous scoring: for credit to be awarded, a correct answer must be entered for every response area
    score = (correctAnswers / Object.keys(correctResponses).length).toFixed(2);

    return {
      correctness: correctAnswers > 0 ? 'correct' : 'incorrect',
      score: correctAnswers > 0 ? score : 0,
      correct
    };
  }
};

export const getCorrectness = (question, env, session) => {
  if (env.mode === 'evaluate') {
    return getResponseCorrectness(
      question,
      session && session.answers
    );
  }
};

export const getPartialScore = (question, session) => {
  if (!session || isEmpty(session)) {
    return 0;
  }

  return 1;
};

export const outcome = (question, session, env) =>
  new Promise((resolve) => {
    if (!session || isEmpty(session)) {
      resolve({ score: 0, empty: true });
    }
    const partialScoringEnabled = partialScoring.enabled(question, env);
    console.log('partialScoringEnabled: ', partialScoringEnabled);
    session = normalizeSession(session);

    if (env.mode !== 'evaluate') {
      resolve({ score: undefined, completed: undefined });
    } else {
      const correctness = getCorrectness(question, env, session, true);
      const score = correctness.score;

      resolve({ score: partialScoringEnabled ? score : score === 1 ? 1 : 0 });
    }
  });

export const createDefaultModel = (model = {}) => ({
  ...defaults.model,
  ...model,
});

export const normalizeSession = (s) => ({ ...s });

const getTextFromHTML = html => (html || '').replace(/<\/?[^>]+(>|$)/g, '');

export const prepareVal = html => getTextFromHTML(html).trim();

export const model = (question, session, env) => {
  return new Promise((resolve) => {
    session = session || {};
    const normalizedQuestion = createDefaultModel(question);
    const correctness = getCorrectness(normalizedQuestion, env, session);
    const { responses, language } = normalizedQuestion;
    let { note } = normalizedQuestion;
    let showNote = (responses?.length > 1);

    if (!note) {
      note = translator.t('mathInline.primaryCorrectWithAlternates', { lng: language });
    }

    const out = {
      prompt: normalizedQuestion.promptEnabled ? normalizedQuestion.prompt : null,
      markup: normalizedQuestion.markup,
      responses: env.mode === 'gather' ? null : normalizedQuestion.responses,
      language: normalizedQuestion.language,
      equationEditor: normalizedQuestion.equationEditor,
      customKeys: normalizedQuestion.customKeys,
      disabled: env.mode !== 'gather',
      view: env.mode === 'view',
      correctness,
      env,
    };

    const { answers = {} } = session || {};
    let feedback = {};

    if (env.mode === 'evaluate') {
      Object.keys(responses).forEach((responseId) => {
        const answerItem = answers['r' + responseId];
        const correctResponse = responses[responseId];
        feedback[responseId] = getIsAnswerCorrect(correctResponse, answerItem);
      });
    }

    if (env.mode === 'evaluate') {
      out.correctResponse = {};
      out.showNote = showNote;
      out.note = note;
      out.feedback = feedback;
    } else {
      out.responses = {};
      out.showNote = false;
    }

    if (env.role === 'instructor' && (env.mode === 'view' || env.mode === 'evaluate')) {
      out.rationale = normalizedQuestion.rationaleEnabled ? normalizedQuestion.rationale : null;
      out.teacherInstructions = normalizedQuestion.teacherInstructionsEnabled
        ? normalizedQuestion.teacherInstructions
        : null;
    } else {
      out.rationale = null;
      out.teacherInstructions = null;
    }

    log('out: ', out);
    resolve(out);
  });
};

export const createCorrectResponseSession = (question, env) =>
  new Promise((resolve) => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      resolve({ id: '1' });
    } else {
      resolve(null);
    }
  });

export const validate = (model = {}, config = {}) => {
  const errors = {};

  return errors;
};
