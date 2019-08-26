import reduce from 'lodash/reduce';
import compact from 'lodash/compact';
import shuffle from 'lodash/shuffle';
import { getAllCorrectResponses } from './utils';

const lg = n => console[n].bind(console, '[drag-in-the-blank]');
const debug = lg('debug');
const log = lg('log');
const warn = lg('warn');
const error = lg('error');

const getShuffledChoices = async (choices, session, updateSession) => {
  log('updateSession type: ', typeof updateSession);
  log('session: ', session);
  if (session.shuffledValues) {
    debug('use shuffledValues to sort the choices...', session.shuffledValues);

    return compact(
      session.shuffledValues.map(v => choices.find(c => c.id === v))
    );
  } else {
    const shuffledChoices = shuffle(choices);

    if (updateSession && typeof updateSession === 'function') {
      try {
        //Note: session.id refers to the id of the element within a session
        const shuffledValues = shuffledChoices.map(c => c.id);
        log('try to save shuffledValues to session...', shuffledValues);
        console.log('call updateSession... ', session.id, session.element);
        await updateSession(session.id, session.element, { shuffledValues });
      } catch (e) {
        warn('unable to save shuffled order for choices');
        error(e);
      }
    } else {
      warn('unable to save shuffled choices, shuffle will happen every time.');
    }
    //save this shuffle to the session for later retrieval
    return shuffledChoices;
  }
};

/**
 *
 * @param {*} question
 * @param {*} session
 * @param {*} env
 * @param {*} updateSession - optional - a function that will set the properties passed into it on the session.
 */
export function model(question, session, env, updateSession) {
  return new Promise(async resolve => {
    let feedback = {};

    if (env.mode === 'evaluate') {
      const responses = getAllCorrectResponses(question);
      const allCorrectResponses = responses.possibleResponses;
      const numberOfPossibleResponses = responses.numberOfPossibleResponses || 0;
      let correctResponses = undefined;

      for (let i = 0; i < numberOfPossibleResponses; i++) {
        const result = reduce(allCorrectResponses, (obj, choices, key) => {
          const answer = (session.value && session.value[key]) || '';

          obj.feedback[key] = choices[i] === answer;

          if (obj.feedback[key]) {
            obj.correctResponses += 1;
          }

          return obj;
        }, { correctResponses: 0, feedback: {} });

        if (correctResponses === undefined || result.correctResponses > correctResponses) {
          correctResponses = result.correctResponses;
          feedback = result.feedback;
        }

        if (result.correctResponses === numberOfPossibleResponses) {
          break;
        }
      }
    }

    let choices = question.choices;
    if (!question.lockChoiceOrder) {
      choices = await getShuffledChoices(choices, session, updateSession);
    }

    const out = {
      ...question,
      choices,
      feedback,
      mode: env.mode,
      disabled: env.mode !== 'gather',
      responseCorrect:
        env.mode === 'evaluate'
          ? getScore(question, session) === 1
          : undefined,
    };
    if (
      env.role === 'instructor' &&
      (env.mode === 'view' || env.mode === 'evaluate')
    ) {
      out.rationale = question.rationale;
      out.teacherInstructions = question.teacherInstructions;
    } else {
      out.rationale = null;
      out.teacherInstructions = null;
    }

    resolve(out);
  });
}

const getScore = (config, session) => {
  const responses = getAllCorrectResponses(config);
  const allCorrectResponses = responses.possibleResponses;
  const maxScore = Object.keys(config.correctResponse).length;
  const numberOfPossibleResponses = responses.numberOfPossibleResponses || 0;
  let correctCount = 0;

  for (let i = 0; i < numberOfPossibleResponses; i++) {
    const result = reduce(allCorrectResponses, (total, choices, key) => {
      const answer = (session.value && session.value[key]) || '';

      if (choices[i] === answer) {
        return total;
      }

      return total - 1;
    }, maxScore);

    if (result > correctCount) {
      correctCount = result;
    }

    if (result === maxScore) {
      break;
    }
  }

  const str = (correctCount / maxScore).toFixed(2);

  return parseFloat(str);
};

/**
 *
 * The score is partial by default for checkbox mode, allOrNothing for radio mode.
 * To disable partial scoring for checkbox mode you either set model.partialScoring = false or env.partialScoring =
 * false. the value in `env` will override the value in `model`.
 * @param {Object} model - the main model
 * @param {boolean} model.partialScoring - is partial scoring enabled (if undefined set to to true)
 * @param {*} session
 * @param {Object} env
 * @param {boolean} env.partialScoring - is partial scoring enabled (if undefined default to true) This overrides
 *   `model.partialScoring`.
 */
export function outcome(model, session) {
  return new Promise(resolve => {
    const partialScoringEnabled = model.partialScoring || false;
    const score = getScore(model, session);

    resolve({ score: partialScoringEnabled ? score : score === 1 ? 1 : 0 });
  });
}

export const createCorrectResponseSession = (question, env) => {
  return new Promise(resolve => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      resolve({
        value: question.correctResponse,
        id: '1'
      });
    }
  });
};
