import debug from 'debug';
import isEmpty from 'lodash/isEmpty';
import Translator from '@pie-lib/translator';
import * as mv from '@pie-framework/math-validation';

import defaults from './defaults';
import { partialScoring } from '@pie-lib/controller-utils';

const { translator } = Translator;
const log = debug('@pie-element:math-templated:controller');

const getFeedback = (value) => (value ? 'correct' : 'incorrect');
const getContent = (html) => (html || '').replace(/(<(?!img|iframe|source)([^>]+)>)/gi, '');

const getIsAnswerCorrect = (correctResponse, answerItem) => {
  let answerCorrect = false;

  const opts = {
    mode: correctResponse.validation || defaults.validationDefault,
    ...(correctResponse.validation === 'literal' && {
      literal: {
        allowTrailingZeros: correctResponse.allowTrailingZeros || false,
        ignoreOrder: correctResponse.ignoreOrder || false,
      },
    }),
  };

  if (!answerCorrect) {
    const acceptedValues = [correctResponse.answer, ...Object.values(correctResponse.alternates || {})];

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
    const correctResponsesCount = Object.keys(correctResponses || {}).length;

    Object.keys(correctResponses).forEach((responseId) => {
      const answerItem = sessionResponse['r' + responseId];
      const correctResponse = correctResponses[responseId] || {};

      const answerCorrect = getIsAnswerCorrect(correctResponse, answerItem);
      if (answerCorrect) {
        correctAnswers++;
      }
    });

    const fullyCorrect = correctAnswers === correctResponsesCount;

    // partial credit scoring: each correct answer is worth 1 / total answers point
    // dichotomous scoring: for credit to be awarded, a correct answer must be entered for every response area
    score = (correctAnswers / Object.keys(correctResponses).length).toFixed(2);

    return {
      correctness: getFeedback(fullyCorrect),
      score: correctAnswers > 0 ? score : 0,
      correct: fullyCorrect,
    };
  }
};

export const getCorrectness = (question, env, session) => {
  if (env.mode === 'evaluate') {
    return getResponseCorrectness(question, session && session.answers);
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
    session = normalizeSession(session);

    if (env.mode !== 'evaluate') {
      resolve({ score: undefined, completed: undefined });
    } else {
      const correctness = getCorrectness(question, env, session, true);
      const score = correctness.score;

      resolve({ score: partialScoringEnabled ? score : score === 1 ? 1 : 0 });
    }
  });

export const createDefaultModel = (model = {}) => {
  const { validationDefault, allowTrailingZerosDefault, ignoreOrderDefault, responses = {} } = model;

  const updatedResponses = Object.keys(responses).reduce((acc, responseId) => {
    const correctResponse = responses[responseId];

    acc[responseId] = {
      ...correctResponse,
      validation: correctResponse.validation || validationDefault,
      allowTrailingZeros: correctResponse.allowTrailingZeros || allowTrailingZerosDefault,
      ignoreOrder: correctResponse.ignoreOrder || ignoreOrderDefault,
    };

    return acc;
  }, {});

  return {
    ...defaults.model,
    ...model,
    responses: updatedResponses,
  };
};

export const normalizeSession = (s) => ({ ...s });

const getTextFromHTML = (html) => (html || '').replace(/<\/?[^>]+(>|$)/g, '');

export const prepareVal = (html) => getTextFromHTML(html).trim();

export const model = (question, session, env) => {
  return new Promise((resolve) => {
    session = session || {};
    const normalizedQuestion = createDefaultModel(question);
    const correctness = getCorrectness(normalizedQuestion, env, session);
    const { responses, language } = normalizedQuestion;
    let { note } = normalizedQuestion;
    let showNote = false;

    // check if there is at least one alternate response or if the validation for at least one response is not literal
    Object.keys(responses).forEach((responseId) => {
      const correctResponse = responses[responseId] || {};
      if (correctResponse.alternates && Object.keys(correctResponse.alternates).length > 0) {
        showNote = true;
      } else if (correctResponse.validation !== 'literal') {
        showNote = true;
      }
    });

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
      extraCSSRules: normalizedQuestion.extraCSSRules,
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
      const correctResponse = Object.keys(question.responses).reduce((acc, responseId) => {
        acc['r' + responseId] = { value: question.responses[responseId].answer };
        return acc;
      }, {});

      resolve({ id: '1', answers: correctResponse });
    } else {
      resolve(null);
    }
  });

export const validate = (model = {}, config = {}) => {
  const { responses, markup } = model;
  const { maxResponseAreas } = config;
  const responsesErrors = {};
  const errors = {};

  ['teacherInstructions', 'prompt', 'rationale'].forEach((field) => {
    if (config[field]?.required && !getContent(model[field])) {
      errors[field] = 'This field is required.';
    }
  });

  Object.entries(responses || {}).forEach(([key, response], index) => {
    const { answer } = response;
    const reversedAlternates = [...Object.entries(response.alternates || {})].reverse();
    const alternatesErrors = {};
    const responseError = {};

    if (answer === '') {
      responseError.answer = 'Content should not be empty.';
    }

    reversedAlternates.forEach(([key, value], index) => {
      if (value === '') {
        alternatesErrors[key] = 'Content should not be empty.';
      } else {
        const identicalAnswer =
          answer === value || reversedAlternates.slice(index + 1).some(([, val]) => val === value);

        if (identicalAnswer) {
          alternatesErrors[key] = 'Content should be unique.';
        }
      }
    });

    if (!isEmpty(responseError) || !isEmpty(alternatesErrors)) {
      responsesErrors[index] = { ...responseError, ...alternatesErrors };
    }
  });

  const nbOfResponseAreas = (markup.match(/\{\{(\d+)\}\}/g) || []).length;

  if (nbOfResponseAreas > maxResponseAreas) {
    errors.responseAreas = `No more than ${maxResponseAreas} response areas should be defined.`;
  } else if (nbOfResponseAreas < 1) {
    errors.responseAreas = 'There should be at least 1 response area defined.';
  }

  if (!isEmpty(responsesErrors)) {
    errors.responses = responsesErrors;
  }

  return errors;
};
