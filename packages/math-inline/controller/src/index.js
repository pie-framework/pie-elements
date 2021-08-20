import debug from 'debug';
import isEmpty from 'lodash/isEmpty';
import { getFeedbackForCorrectness } from '@pie-lib/feedback';
import { ResponseTypes } from './utils';

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

  const isAnswerCorrect = getIsAnswerCorrect(
    isAdvanced ? correctResponses : correctResponses.slice(0, 1),
    answerItem
  );

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

  correctResponseItem.forEach(correctResponse => {

    let opts = {
      mode: correctResponse.validation || 'literal'
    }

    if (opts.mode == 'literal') {
      opts.literal = {
        allowTrailingZeros: correctResponse.allowTrailingZeros || false,
        ignoreOrder: correctResponse.ignoreOrder || false,
      };
    }

    if (!answerCorrect) {
      const acceptedValues = [correctResponse.answer].concat(
        Object.keys(correctResponse.alternates || {}).map(
          alternateId => correctResponse.alternates[alternateId]
        )
      );

      for (let i = 0; i < acceptedValues.length; i++) {
        answerCorrect = mv.latexEqual(answerItem, acceptedValues[i], opts)
        if (answerCorrect) {
          break;
        }
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
      isOutcome
    );
  }
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

  // making sure that validation type is set
  if (!isEmpty(question.responses)) {
    question.responses = question.responses.map(correctResponse => ({ ...correctResponse, validation: correctResponse.validation || 'literal', allowTrailingZeros: correctResponse.allowTrailingZeros || false, ignoreOrder: correctResponse.ignoreOrder || false }))
  }

  return {
    ...defaults,
    feedbackEnabled: true,
    promptEnabled: true,
    rationaleEnabled: true,
    teacherInstructionsEnabled: true,
    studentInstructionsEnabled: true,
    ...question,
  }
}



export function model(question, session, env) {
  return new Promise((resolve) => {
    const normalizedQuestion = normalize(question);
    const correctness = getCorrectness(normalizedQuestion, env, session);
    const correctResponse = {};
    const { responses, ...config } = normalizedQuestion;

    if (config.responseType === ResponseTypes.simple) {
      config.responses = responses.slice(0, 1);
    } else {
      config.responses = responses;
    }

    const fb =
      env.mode === 'evaluate' && normalizedQuestion.feedbackEnabled
        ? getFeedbackForCorrectness(correctness, normalizedQuestion.feedback)
        : Promise.resolve(undefined);

    fb.then((feedback) => {
      const base = {
        config,
        correctness,
        feedback,
        disabled: env.mode !== 'gather',
        view: env.mode === 'view',
      };

      let out;
      let showNote = false;

      ((config && config.responses) || []).forEach((response) => {
        if (
          response.validation === 'symbolic' ||
          Object.keys(response.alternates || {}).length > 0
        ) {
          showNote = true;
          return;
        }
      });

      if (env.mode === 'evaluate') {

        out = Object.assign(base, {
          correctResponse,
        });

        out.config.showNote = showNote;
      } else {
        out = base;

        out.config.responses = [];
        out.config.showNote = false;
      }

      if (
        env.role === 'instructor' &&
        (env.mode === 'view' || env.mode === 'evaluate')
      ) {
        out.rationale = normalizedQuestion.rationaleEnabled
          ? normalizedQuestion.rationale
          : null;
        out.teacherInstructions = normalizedQuestion.teacherInstructionsEnabled
          ? normalizedQuestion.teacherInstructions
          : null;
        out.config.showNote = showNote;
      } else {
        out.rationale = null;
        out.teacherInstructions = null;
        out.config.rationale = null;
        out.config.teacherInstructions = null;
      }

      out.config.env = env;
      out.config.prompt = normalizedQuestion.promptEnabled
        ? normalizedQuestion.prompt
        : null;

      log('out: ', out);
      resolve(out);
    });
  });
}

const escape = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string

const simpleSessionResponse = (question) =>
  new Promise((resolve) => {
    const { responses } = question;
    const { answer } = responses ? responses[0] : {};
    resolve({
      id: question.id,
      response: answer,
      completeAnswer: answer,
    });
  });

const advancedSessionResponse = (question) =>
  new Promise((resolve, reject) => {
    const { responses } = question;
    const { answer } = responses ? responses[0] : {};

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
          answers: {},
          completeAnswer: answer,
          id: question.id,
        });

        console.log(`can not find match: ${o} in ${answer}`);

        return;
      }

      m.shift();

      const answers = {};

      for (var i = 0; i < count; i++) {
        answers[`r${i + 1}`] = { value: m[i].trim() };
      }

      resolve({
        answers,
        completeAnswer: answer,
        id: question.id,
      });
    } catch (e) {
      resolve({
        answers: {},
        completeAnswer: answer,
        id: question.id,
      });

      console.error(e.toString());
    }
  });

export const createCorrectResponseSession = (question, env) => {
  if (env.mode === 'evaluate' || env.role !== 'instructor') {
    // eslint-disable-next-line no-console
    console.error(
      'can not create correct response session if mode is evaluate or role is not instructor'
    );

    return Promise.resolve(null);
  }

  if ((question.responseType || '').toLowerCase() === 'simple') {
    return simpleSessionResponse(question, env);
  } else {
    return advancedSessionResponse(question, env);
  }
};
