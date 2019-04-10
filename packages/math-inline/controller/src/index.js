import debug from 'debug';
import { getFeedbackForCorrectness } from '@pie-lib/feedback';
import areValuesEqual from '@pie-lib/math-evaluator';
import { partialScoring } from '@pie-lib/controller-utils';

import defaults from './defaults';

const log = debug('@pie-element:math-inline:controller');

function trimSpaces(str = '') {
  return str.replace(/\\ /g, '').replace(/ /g, '');
}

const getResponseCorrectness = (model, answerItem, partialScoringEnabled) => {
  const correctResponses = model.responses;
  const isAdvanced = model.mode === 'advanced';

  if (!answerItem || (isAdvanced && answerItem.length === 0)) {
    return {
      correctness: 'unanswered',
      score: '0%',
      info: {}
    };
  }

  const correctAnswers = getCorrectAnswers(
    isAdvanced ? correctResponses : model.response,
    answerItem,
    isAdvanced,
    model
  );
  const correctnessObject = {
    correctness: 'incorrect',
    score: '0%',
    info: correctAnswers.info
  };

  if (!isAdvanced && correctAnswers.count !== 0) {
    correctnessObject.correctness = 'correct';
    correctnessObject.score = '100%';
  }

  if (isAdvanced) {
    if (correctResponses.length === correctAnswers.count) {
      correctnessObject.correctness = 'correct';
      correctnessObject.score = '100%';
    } else if (partialScoringEnabled) {
      correctnessObject.correctness = 'partially-correct';
      correctnessObject.score = `${(
        (correctAnswers.count * 100) /
        correctResponses.length
      ).toFixed(2)}%`;
    }
  }

  return correctnessObject;
};

function getCorrectAnswers(correctResponseItem, answerItem, isAdvanced, model) {
  let correct = 0;
  const answerInfo = {};

  if (isAdvanced) {
    correctResponseItem.forEach(correctResponse => {
      let answerCorrect = false;
      const correspondingAnswer = answerItem[correctResponse.id];
      const acceptedValues = [correctResponse.answer].concat(
        Object.keys(correctResponse.alternates).map(
          alternateId => correctResponse.alternates[alternateId].answer
        )
      );

      if (correspondingAnswer && correspondingAnswer.value) {
        if (correctResponse.validation === 'literal') {
          for (let i = 0; i < acceptedValues.length; i++) {
            if (
              acceptedValues[i] ===
              (correctResponse.allowSpaces
                ? trimSpaces(correspondingAnswer.value)
                : correspondingAnswer.value)
            ) {
              answerCorrect = true;
              break;
            }
          }
        } else {
          answerCorrect = areValuesEqual(
            correctResponse.answer,
            correspondingAnswer.value,
            { isLatex: true, allowDecimals: correctResponse.allowDecimals }
          );
        }
      }

      if (answerCorrect) {
        answerInfo[correctResponse.id] = true;
        correct++;
      } else {
        answerInfo[correctResponse.id] = false;
      }
    });
  } else {
    let answerCorrect = false;
    const acceptedValues = [correctResponseItem.answer].concat(
      Object.keys(correctResponseItem.alternates).map(
        alternateId => correctResponseItem.alternates[alternateId].answer
      )
    );

    if (correctResponseItem.validation === 'literal') {
      for (let i = 0; i < acceptedValues.length; i++) {
        if (acceptedValues[i] === answerItem) {
          answerCorrect = true;
          break;
        }
      }
    } else {
      answerCorrect = areValuesEqual(correctResponseItem.answer, answerItem, {
        isLatex: true
      });
    }

    if (answerCorrect) {
      correct++;
    }

    answerInfo.defaultResponse = answerCorrect;
  }

  return {
    info: answerInfo,
    count: correct
  };
}

const getCorrectness = (question, env, session, partialScoringEnabled) => {
  if (env.mode === 'evaluate') {
    return getResponseCorrectness(
      question,
      question.mode === 'advanced' ? session.answers : session.response,
      partialScoringEnabled
    );
  }
};

export function createDefaultModel(model = {}) {
  return new Promise(resolve => {
    resolve({
      config: {
        ...defaults,
        ...model
      }
    });
  });
}

export function model(question, session, env) {
  return new Promise(resolve => {
    const partialScoringEnabled = partialScoring.enabled(question, env);
    const correctness = getCorrectness(
      question,
      env,
      session,
      partialScoringEnabled
    );
    const correctResponse = {};

    const fb =
      env.mode === 'evaluate'
        ? getFeedbackForCorrectness(correctness, question.feedback)
        : Promise.resolve(undefined);

    fb.then(feedback => {
      const base = {
        config: question,
        correctness,
        feedback,
        disabled: env.mode !== 'gather',
        view: env.mode === 'view'
      };

      const out = Object.assign(base, {
        correctResponse
      });
      log('out: ', out);
      resolve(out);
    });
  });
}
