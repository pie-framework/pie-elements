import debug from 'debug';
import isEmpty from 'lodash/isEmpty';
import Translator from '@pie-lib/pie-toolbox/translator';
import * as mv from '@pie-framework/math-validation';
import { getFeedbackForCorrectness } from '@pie-lib/pie-toolbox/feedback';

import defaults from './defaults';

const { translator } = Translator;
const log = debug('@pie-element:math-templated:controller');

const getIsAnswerCorrect = (correctResponse, answerItem) => {
  let answerCorrect = false;

  let opts = {
    mode: correctResponse.validation || defaults.validationDefault,
  };

  if (opts.mode === 'literal') {
    opts.literal = {
      allowTrailingZeros: correctResponse.allowTrailingZeros || false,
      ignoreOrder: correctResponse.ignoreOrder || false,
    };
  }

  if (!answerCorrect) {
    const acceptedValues =
      [correctResponse.answer].concat(
        Object.keys(correctResponse.alternates || {}).map((alternateId) => correctResponse.alternates[alternateId]),
      ) || [];

    try {
      for (let i = 0; i < acceptedValues.length; i++) {
        console.log(answerItem, acceptedValues[i])
        answerCorrect = mv.latexEqual(answerItem.value, acceptedValues[i], opts);

        if (answerCorrect) {
          break;
        }
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

  console.log('sessionResponse ---->', sessionResponse);
  if (!sessionResponse) {
    return {
      correctness: 'unanswered',
      score: 0,
      correct: false,
    };
  } else {
    let correctAnswers= 0;
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

    return {
      //todo: need to update this to return 'partially-correct' if correctAnswers > 0 but < total responses
      // and calculate the score accordingly
      correctness: correctAnswers > 0 ? 'correct' : 'incorrect',
      score: correctAnswers > 0 ? 1 : 0,
      correct
    };
  }
};

export const getCorrectness = (question, env, session) => {
  console.log('session ---->', session);
  if (env.mode === 'evaluate') {
    return getResponseCorrectness(
      question,
      session && session.answers,
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

    session = normalizeSession(session);

    if (env.mode !== 'evaluate') {
      resolve({ score: undefined, completed: undefined });
    } else {
      const correctness = getCorrectness(question, env, session, true);

      resolve({ score: correctness.score });
    }
  });

export const createDefaultModel = (model = {}) => ({
  ...defaults.model,
  ...model,
});
export const normalizeSession = (s) => ({
  ...s,
});

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

    const fbPromise =
      env.mode === 'evaluate' && normalizedQuestion.feedbackEnabled
        ? getFeedbackForCorrectness(correctness, normalizedQuestion.feedback)
        : Promise.resolve(undefined);

    fbPromise.then((feedback) => {
      const out = {
        prompt: normalizedQuestion.promptEnabled ? normalizedQuestion.prompt : null,
        markup: normalizedQuestion.markup,
        responses: env.mode === 'gather' ? null : normalizedQuestion.responses,
        language: normalizedQuestion.language,
        env,
        equationEditor: normalizedQuestion.equationEditor,
        customKeys: normalizedQuestion.customKeys,
        disabled: env.mode !== 'gather',
        view: env.mode === 'view',
        correctness,
        feedback
      };

      if (env.mode === 'evaluate') {
        out.correctResponse = {};
        out.showNote = showNote;
        out.note = note;
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
  });
};

export const createCorrectResponseSession = (question, env) => {
  return new Promise((resolve) => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      resolve({ id: '1' });
    } else {
      resolve(null);
    }
  });
};

export const validate = (model = {}, config = {}) => {
  const errors = {};

  return errors;
};
