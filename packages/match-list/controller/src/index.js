import { partialScoring } from '@pie-lib/controller-utils';
import { getFeedbackForCorrectness } from '@pie-lib/feedback';
import shuffle from 'lodash/shuffle';
import compact from 'lodash/compact';

const lg = n => console[n].bind(console, '[match-list]');
const debug = lg('debug');
const log = lg('log');
const warn = lg('warn');
const error = lg('error');
import defaults from './defaults';

const getResponseCorrectness = (
  model,
  answers
) => {
  const partialScoring = true /*model.partialScoring*/;
  const prompts = model.prompts;

  if (!answers || Object.keys(answers).length === 0) {
    return 'unanswered';
  }

  const totalCorrectAnswers = getTotalCorrect(model);
  const correctAnswers = getCorrectSelected(prompts, answers);

  if (totalCorrectAnswers === correctAnswers) {
    return  'correct';
  } else if (correctAnswers === 0) {
    return 'incorrect';
  } else if (partialScoring) {
    return 'partial';
  }

  return 'incorrect';
};

const getCorrectness = (question, env, answers) => {
  if (env.mode === 'evaluate') {
    return getResponseCorrectness(
      question,
      answers
    );
  }
};

const getCorrectSelected = (prompts, answers) => {
  let correctAnswers = 0;

  prompts.forEach(p => {
    if (p.relatedAnswer === answers[p.id]) {
      correctAnswers += 1;
    }
  });

  return correctAnswers;
};

const getTotalCorrect = (question) => {
  return question.prompts.length;
};

const getPartialScore = (question, answers) => {
  const count = getCorrectSelected(question.prompts, answers);
  const totalCorrect = getTotalCorrect(question);

  return parseFloat((count / totalCorrect).toFixed(2));
};

const getOutComeScore = (question, env, answers) => {
  const correctness = getCorrectness(
    question,
    env,
    answers
  );

  return (
    correctness === 'correct'
      ? 1
      : correctness === 'partial' &&
      true
      ? getPartialScore(question, answers)
      : 0
  );
};

export const outcome = (question, session, env) => {
  return new Promise((resolve) => {
    if (env.mode !== 'evaluate') {
      resolve({ score: undefined, completed: undefined });
    } else {
      const out = {
        score: getOutComeScore(question, env, session.value)
      };

      resolve(out);
    }
  });
};

export function createDefaultModel(model = {}) {
  return new Promise(resolve => {
    resolve({
      ...defaults,
      ...model
    });
  });
}

const getShuffledChoices = async (choices, session, updateSession) => {
  log('updateSession type: ', typeof updateSession);
  log('session: ', session);
  if (session.shuffledValues) {
    debug('use shuffledValues to sort the choices...', session.shuffledValues);

    return compact(
      session.shuffledValues.map(id => choices.find(c => c.id === id))
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
    const correctness = getCorrectness(question, env, session.value);
    const correctResponse = {};
    const score =  `${getOutComeScore(question, env, session.value) * 100}%`;
    const correctInfo = {
      score,
      correctness
    };

    if (!question.lockChoiceOrder) {
      question.prompts = await getShuffledChoices(question.prompts, session, updateSession);
      question.answers = await getShuffledChoices(question.answers, session, updateSession);
    }

    question.prompts.forEach(prompt => {
      correctResponse[prompt.id] = prompt.relatedAnswer;
    });

    const fb =
      env.mode === 'evaluate'
        ? getFeedbackForCorrectness(correctInfo.correctness, question.feedback)
        : Promise.resolve(undefined);

    fb.then(feedback => {
      const base = {
        config: {
          ...question,
          shuffled: !question.lockChoiceOrder
        },
        correctness: correctInfo,
        feedback,
        mode: env.mode
      };

      if (env.role === 'instructor' && (env.mode === 'view' || env.mode === 'evaluate')) {
        base.rationale = question.rationale;
      } else {
        base.rationale = null;
      }

      const out = Object.assign(base, {
        correctResponse
      });
      log('out: ', out);
      resolve(out);
    });
  });
}

export const createCorrectResponseSession = (question, env) => {
  return new Promise(resolve => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      const { prompts, answers } = question;
      const value = {};

      prompts.forEach(p => {
        if (answers.filter(a => a.id === p.relatedAnswer).length) {
          value[p.id] = p.relatedAnswer;
        }
      });

      resolve({
        value,
        id: '1'
      });
    }
  });
};

