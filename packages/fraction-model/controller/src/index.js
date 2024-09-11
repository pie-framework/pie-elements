import isEmpty from 'lodash/isEmpty';
import defaults from './defaults';

/*
 * Function to check the correctness of the response
 * @param {model} model contains the model object
 * @param {answers} answers contains the answers object
 * @param {env} env contains the environment object
 * @returns {string} returns the correctness of the response
 * */
export const getResponseCorrectness = (model, answers, env = {}) => {
  let correct;
  if (model.allowedStudentConfig) {
    correct = !!(
      answers.partsPerModel === model.partsPerModel &&
      partialFillCheck(answers.response, model.partsPerModel) &&
      numeratorCheck(model.correctResponse, answers.response)
    );
  } else {
    correct = !!(
      partialFillCheck(answers.response, model.partsPerModel) && numeratorCheck(model.correctResponse, answers.response)
    );
  }
  return correct ? 'correct' : 'incorrect';
};

/*
 * Function to get the correctness of the response
 * @param {question} question contains the question object
 * @param {env} env contains the environment object
 * @param {answers} answers contains the answers object
 * @returns {string} returns the correctness
 * */
const getCorrectness = (question, env, answers = {}) => {
  if (env.mode === 'evaluate') {
    return getResponseCorrectness(question, answers, env);
  }
};

/*
 * Function to get the outcome score
 * @param {question} question contains the question object
 * @param {env} env contains the environment object
 * @param {answers} answers contains the answers object
 * @returns {number} returns the score
 * */
const getOutComeScore = (question, env, answers = {}) => {
  const correctness = getCorrectness(question, env, answers);
  return correctness === 'correct' ? 1 : 0;
};

/*
 * Function to check outcome of the session
 * @param {model} model contains the model object
 * @param {session} session contains the session object
 * @param {env} env contains the environment object
 * @returns {Promise} returns the score
 */
export const outcome = (model, session, env) =>
  new Promise((resolve) => {
    if (!session || isEmpty(session)) {
      resolve({ score: 0, empty: true });
    } else {
      if (env.mode !== 'evaluate') {
        resolve({ score: undefined, completed: undefined });
      } else {
        resolve({ score: getOutComeScore(model, env, session.answers) });
      }
    }
  });

/*
 * Function to check if the numerator of the response matches the numerator of the correct response
 * @param {correctResponse} correctResponse contains the correct response object
 * @param {response} response contains the response object
 * @returns {boolean} returns true if the numerators match
 * */
const numeratorCheck = (correctResponse, response) => {
  let correctNumerator = 0;
  let responseNumerator = 0;
  for (let i = 0; i < correctResponse.length; i++) {
    correctNumerator += correctResponse[i].value;
  }
  for (let i = 0; i < response.length; i++) {
    responseNumerator += response[i].value;
  }
  return correctNumerator === responseNumerator;
};

/*
 * Function to check if the response contains more than one partially-filled model
 * @param {response} response contains the response object
 * @param {partsPerModel} partsPerModel contains the number of parts per model
 * */
const partialFillCheck = (response, partsPerModel) => {
  if (response.length > 0) {
    let partialModelCount = 0;
    response.forEach((selection) => {
      if (selection.value !== partsPerModel) {
        partialModelCount++;
      }
    });
    return partialModelCount <= 1;
  } else {
    return false;
  }
};

/*
 * Function to create a default model
 * @param {model} model contains the model object
 * */
export const createDefaultModel = (model = {}) => ({
  ...defaults.model,
  ...model,
});

/*
 * Return the model object
 * */
export const model = (question, session, env) => {
  return new Promise((resolve) => {
    session = session || {};
    const model = createDefaultModel(question);
    let correctness, score;
    if ((!session || isEmpty(session)) && env.mode === 'evaluate') {
      correctness = 'unanswered';
      score = '0%';
    } else {
      correctness = getCorrectness(model, env, session && session.answers);
      score = `${getOutComeScore(model, env, session && session.answers) * 100}%`;
    }
    const correctInfo = {
      score,
      correctness,
    };
    const out = {
      env,
      ...model,
      view: env.mode === 'view' || env.mode === 'evaluate',
    };
    if (env.mode === 'evaluate') {
      Object.assign(out, {
        correctness: correctInfo,
      });
    }
    resolve(out);
  });
};

/*
 * Function to create a correct response session
 * @param {model} model contains the model object
 * @param {env} env contains the environment object
 * @returns {Promise} returns the correct response session
 * */
export const createCorrectResponseSession = (model, env) => {
  return new Promise((resolve) => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      const { correctResponse, maxModelSelected, partsPerModel } = model;
      resolve({
        answers: {
          response: correctResponse,
          noOfModel: maxModelSelected,
          partsPerModel,
        },
        id: '1',
      });
    } else {
      resolve(null);
    }
  });
};

/*
 * Function to validate the model
 * @param {model} model contains the model object
 * @param {config} config contains the config object
 * */
export const validate = (model = {}, config = {}) => {
  const errors = {};
  if (model.correctResponse.length === 0) {
    errors.correctResponse = 'To save the item, at least one section must be marked as correct.';
  }
  if (model.correctResponse.length > 0) {
    let partialModelCount = 0;
    model.correctResponse.forEach((selection) => {
      if (selection.value !== model.partsPerModel) {
        partialModelCount++;
      }
    });
    if (partialModelCount > 1) {
      errors.correctResponse = 'The correct answer should include no more than one partially-filled model';
    }
  }
  return errors;
};
