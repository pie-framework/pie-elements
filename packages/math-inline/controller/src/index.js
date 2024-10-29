import debug from 'debug';
import isEmpty from 'lodash/isEmpty';
import { getActualFeedbackForCorrectness } from '@pie-lib/pie-toolbox/feedback';

import { ResponseTypes } from './utils';
import Translator from '@pie-lib/pie-toolbox/translator';

const { translator } = Translator;
import defaults from './defaults';

import * as mv from '@pie-framework/math-validation';

const log = debug('@pie-element:math-inline:controller');

const getResponseCorrectness = (model, answerItem, isOutcome) => {
  const correctResponses = model.responses;
  const isAdvanced = model.responseType === ResponseTypes.advanced;

  if (!answerItem) {
    return {
      correctness: 'unanswered',
      score: isOutcome ? 0 : '0%',
      correct: false,
    };
  }

  const isAnswerCorrect = getIsAnswerCorrect(isAdvanced ? correctResponses : correctResponses.slice(0, 1), answerItem);

  const correctnessObject = {
    correctness: 'incorrect',
    score: isOutcome ? 0 : '0%',
    correct: false,
  };

  if (isAnswerCorrect) {
    correctnessObject.correctness = 'correct';
    correctnessObject.score = isOutcome ? 1 : '100%';
    correctnessObject.correct = true;
  }

  return correctnessObject;
};

function getIsAnswerCorrect(correctResponseItem, answerItem) {
  let answerCorrect = false;

  (correctResponseItem || []).forEach((correctResponse) => {
    let opts = {
      mode: correctResponse.validation || defaults.validationDefault,
    };

    if (opts.mode == 'literal') {
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
          answerCorrect = mv.latexEqual(answerItem, acceptedValues[i], opts);

          if (answerCorrect) {
            break;
          }
        }
      } catch (e) {
        log('Parse failure when evaluating math', e, correctResponse, answerItem);

        answerCorrect = false;
      }
    }
  });

  return answerCorrect;
}

const getCorrectness = (question, env, session, isOutcome) => {
  if (env.mode === 'evaluate') {
    return getResponseCorrectness(
      question,
      question.responseType === ResponseTypes.advanced
        ? (session && session.completeAnswer) || ''
        : session && session.response,
      isOutcome,
    );
  }

  return undefined;
};

export function createDefaultModel(model = {}) {
  return new Promise((resolve) => {
    resolve({
      config: {
        ...defaults,
        ...model,
      },
    });
  });
}

export const outcome = (question, session, env) => {
  return new Promise((resolve) => {
    if (env.mode !== 'evaluate') {
      resolve({ score: undefined, completed: undefined });
    } else {
      if (!session || isEmpty(session)) {
        resolve({ score: 0, empty: true });
      } else {
        const correctness = getCorrectness(question, env, session, true);

        resolve({ score: correctness.score });
      }
    }
  });
};

export const normalize = (question) => {
  // making sure that defaults are set
  if (!isEmpty(question.responses)) {
    question.responses = question.responses.map((correctResponse) => ({
      ...correctResponse,
      validation: correctResponse.validation || question.validationDefault,
      allowTrailingZeros: correctResponse.allowTrailingZeros || question.allowTrailingZerosDefault,
      ignoreOrder: correctResponse.ignoreOrder || question.ignoreOrderDefault,
    }));
  }

  return { ...defaults, ...question };
};

export const model = (question, session, env) =>
  new Promise((resolve) => {
    const normalizedQuestion = normalize(question);
    const correctness = getCorrectness(normalizedQuestion, env, session);
    const { extraCSSRules, responses, language, ...config } = normalizedQuestion;

    config.responses = config.responseType === ResponseTypes.simple ? responses.slice(0, 1) : responses;

    const feedback =
      env.mode === 'evaluate' && normalizedQuestion.feedbackEnabled
        ? getActualFeedbackForCorrectness(correctness?.correctness, normalizedQuestion.feedback)
        : undefined;

    const out = {
      extraCSSRules,
      config,
      correctness,
      feedback,
      disabled: env.mode !== 'gather',
      view: env.mode === 'view',
    };

    const note = normalizedQuestion.note || translator.t('mathInline.primaryCorrectWithAlternates', { lng: language });
    const showNote =
      config?.responses?.length > 1 ||
      (config?.responses || []).some(
        (response) => response.validation === 'symbolic' || Object.keys(response.alternates || {}).length > 0,
      );

    if (env.mode === 'evaluate') {
      out.correctResponse = {};
      out.config.showNote = showNote;
      out.config.note = note;
    } else {
      out.config.responses = [];
      out.config.showNote = false;
    }

    if (env.role === 'instructor' && (env.mode === 'view' || env.mode === 'evaluate')) {
      out.rationale = normalizedQuestion.rationaleEnabled ? normalizedQuestion.rationale : null;
      out.teacherInstructions = normalizedQuestion.teacherInstructionsEnabled
        ? normalizedQuestion.teacherInstructions
        : null;
    } else {
      out.rationale = null;
      out.teacherInstructions = null;
      out.config.rationale = null;
      out.config.teacherInstructions = null;
    }

    out.config.env = env;
    out.config.prompt = normalizedQuestion.promptEnabled ? normalizedQuestion.prompt : null;
    out.language = language;

    log('out: ', out);
    resolve(out);
  });

const escape = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string

const simpleSessionResponse = (question) =>
  new Promise((resolve) => {
    const { responses, id } = question;
    const { answer } = responses && responses.length ? responses[0] : {};

    resolve({
      id,
      response: answer || '',
      completeAnswer: answer || '',
    });
  });

// use this for items like E672793
const removeTrailingEscape = (str) => (str.endsWith('\\') ? str.slice(0, -1) : str);

const advancedSessionResponse = (question) =>
  new Promise((resolve) => {
    const { responses, id } = question;
    const { answer } = responses && responses.length ? responses[0] : {};

    if (!answer) {
      resolve({
        id,
        answers: {},
        completeAnswer: '',
      });

      return;
    }

    try {
      const e = question.expression;
      const RESPONSE_TOKEN = /\\{\\{\s*response\s*\\}\\}/g;

      const o = escape(e).split(RESPONSE_TOKEN);
      const to = o.map((t) => (t === '' ? t : t.replace(/\s+/g, () => '\\s*')));
      const tt = to.join('(.*)');

      const m = answer.match(new RegExp(tt));

      const count = o.length - 1;

      if (!m) {
        resolve({
          id,
          answers: {},
          completeAnswer: answer,
        });

        // eslint-disable-next-line no-console
        console.log(`can not find match: ${o} in ${answer}`);

        return;
      }

      m.shift();

      const answers = {};

      for (var i = 0; i < count; i++) {
        answers[`r${i + 1}`] = { value: removeTrailingEscape(m[i].trim()) };
      }

      resolve({
        id,
        answers,
        completeAnswer: answer,
      });
    } catch (e) {
      resolve({
        id,
        answers: {},
        completeAnswer: answer,
      });
      // eslint-disable-next-line no-console
      console.error(e.toString());
    }
  });

export const createCorrectResponseSession = (question, env) => {
  if (env.mode === 'evaluate' || env.role !== 'instructor') {
    // eslint-disable-next-line no-console
    console.error('can not create correct response session if mode is evaluate or role is not instructor');

    return Promise.resolve(null);
  }

  if ((question.responseType || '').toLowerCase() === 'simple') {
    return simpleSessionResponse(question, env);
  } else {
    return advancedSessionResponse(question, env);
  }
};

// remove all html tags
const getInnerText = (html) => (html || '').replaceAll(/<[^>]*>/g, '');

// remove all html tags except img and iframe
const getContent = (html) => (html || '').replace(/(<(?!img|iframe)([^>]+)>)/gi, '');

export const validate = (model = {}, config = {}) => {
  const { expression = '', responses, responseType } = model;
  const { maxResponseAreas } = config;
  const responsesErrors = {};
  const errors = {};

  ['teacherInstructions', 'prompt', 'rationale'].forEach((field) => {
    if (config[field]?.required && !getContent(model[field])) {
      errors[field] = 'This field is required.';
    }
  });

  (responses || []).forEach((response, index) => {
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

  if (responseType === 'Advanced Multi') {
    const nbOfResponseAreas = (expression.match(/\{\{response\}\}/g) || []).length;

    if (nbOfResponseAreas > maxResponseAreas) {
      errors.responseAreasError = `No more than ${maxResponseAreas} response areas should be defined.`;
    } else if (nbOfResponseAreas < 1) {
      errors.responseAreasError = 'There should be at least 1 response area defined.';
    }
  }

  if (!isEmpty(responsesErrors)) {
    errors.responsesErrors = responsesErrors;
  }

  return errors;
};
