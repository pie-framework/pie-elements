import debug from 'debug';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';
import defaults from './defaults';

import { partialScoring } from '@pie-lib/pie-toolbox/controller-utils';

const log = debug('@pie-element:graphing:controller');

const lowerCase = (string) => (string || '').toLowerCase();

export const checkLabelsEquality = (givenAnswerLabel, correctAnswerLabel) =>
  lowerCase(givenAnswerLabel) === lowerCase(correctAnswerLabel);

export const setCorrectness = (answers, partialScoring) =>
  answers
    ? answers.map((answer) => ({
      ...answer,
      correctness: {
        value: partialScoring ? 'incorrect' : 'correct',
        label: partialScoring ? 'incorrect' : 'correct',
      },
    }))
    : [];

export const normalize = (question) => ({ ...defaults, ...question });

export const getScore = (question, session, env = {}) => {
  const { correctAnswer, data: initialData = [], scoringType } = question;
  let correctResponses = [];

  const isPartialScoring = partialScoring.enabled(
    { partialScoring: scoringType !== undefined ? scoringType === 'partial scoring' : scoringType },
    env,
  );

  const { data: correctAnswers = [] } = correctAnswer || {};
  const defaultAnswers = filterCategories(initialData);

  let answers = setCorrectness((session && session.answer) || defaultAnswers, isPartialScoring);

  let result = 0;

  if (isPartialScoring) {
    // if score type is "partial scoring"
    // maxScore is calculated based on the correct response
    // score is calculated based on the given response
    let maxScore = 0;
    let score = 0;

    const scoreForLabelAndValueEditable = (answer, corrAnswer) => {
      const { value, label, index } = answer;
      const valueIsCorrect = value === corrAnswer.value;
      const labelIsCorrect = checkLabelsEquality(label, corrAnswer.label);
      maxScore += 2;

      if (valueIsCorrect) {
        score += 1;
        answer.correctness.value = 'correct';
      }

      if (labelIsCorrect) {
        score += 1;
        answer.correctness.label = 'correct';
      }

      if (valueIsCorrect && labelIsCorrect) {
        correctResponses.push({ label: label, index: index });
      }
    };

    // if given answer has more categories than the correct answers, the "extra" will be ignored
    correctAnswers.forEach((corrAnswer, index) => {
      const defaultAnswer = defaultAnswers[index];
      const answer = answers[index];

      // if there is a corresponding category at the same position in the given answer
      if (answer) {
        // if there is a corresponding category at the same position in the default answer
        if (defaultAnswer) {
          // if category's label (in default answer) was not editable
          // it means that this category values only one point (only the value can be changed)
          if (!defaultAnswer.editable && answer.interactive) {
            maxScore += 1;

            if (answer.value === corrAnswer.value) {
              score += 1;
              answer.correctness.value = 'correct';
              correctResponses.push({ label: answer.label, index: index });
            }
            answer.correctness.label = 'correct';

            // if category's label (in default answer) was editable
            // it means that this category values 2 points (both label and value can be changed)
          } else if (defaultAnswer.editable && answer.interactive) {
            scoreForLabelAndValueEditable(answer, corrAnswer);
          } else if (!answer.interactive) {
            answer.correctness.value = 'correct';
            answer.correctness.label = 'correct';
            correctResponses.push({ label: answer.label, index: index });
          }
        } else {
          // if there is not a corresponding category at the same position in the default answer
          scoreForLabelAndValueEditable(answer, corrAnswer);
        }
      } else {
        // if there is not a corresponding category at the same position in the given answer
        // it means that the given answer has less categories than the correct answer
        maxScore += 2;
      }
    });

    result = maxScore ? score / maxScore : 0;
  } else {
    // all-or-nothing scoring: overall score is 1 only if lengths and all values/labels match
    result = correctAnswers.length === answers.length ? 1 : 0;

    // regardless of overall result, mark each answer individually for user feedback
    answers = answers.map((answer, index) => {
      const correctAnswer = correctAnswers[index];
      const valueIsCorrect = correctAnswer ? answer.value === correctAnswer.value : false;
      const labelIsCorrect = correctAnswer ? lowerCase(answer.label) === lowerCase(correctAnswer.label) : false;

      if (!valueIsCorrect || !labelIsCorrect) {
        result = 0;
      }

      if (valueIsCorrect && labelIsCorrect) {
        correctResponses.push({ label: answer.label, index });
      }

      return {
        ...answer,
        correctness: {
          value: valueIsCorrect ? 'correct' : 'incorrect',
          label: labelIsCorrect ? 'correct' : 'incorrect',
        },
      };
    });
  }

  const score = {
    score: parseFloat(result.toFixed(2)),
    answers,
  };

  if (env.extraProps && env.extraProps.correctResponseEnabled) {
    score.correctResponses = correctResponses;
  }

  return score;
};

// eslint-disable-next-line no-unused-vars
export const filterCategories = (categories) => (categories ? categories.map(({ deletable, ...rest }) => rest) : []);

export function model(question, session, env) {
  return new Promise((resolve) => {
    const normalizedQuestion = normalize(question);
    const {
      addCategoryEnabled,
      chartType,
      data,
      domain,
      graph,
      prompt,
      promptEnabled,
      range,
      rationale,
      title,
      rationaleEnabled,
      teacherInstructions,
      teacherInstructionsEnabled,
      correctAnswer,
      scoringType,
      studentNewCategoryDefaultLabel,
      language,
      extraCSSRules,
    } = normalizedQuestion;

    const correctInfo = { correctness: 'incorrect', score: '0%' };

    const base = {
      addCategoryEnabled,
      chartType,
      data: filterCategories(data),
      domain,
      graph,
      prompt: promptEnabled ? prompt : null,
      range,
      rationale,
      title,
      size: graph,
      showToggle: false,
      correctness: correctInfo,
      disabled: env.mode !== 'gather',
      scoringType,
      studentNewCategoryDefaultLabel,
      language,
      env,
      extraCSSRules,
    };

    const scoreObject = getScore(normalizedQuestion, session, env);
    const answers = filterCategories(scoreObject.answers);

    if (env.mode === 'view') {
      // eslint-disable-next-line no-unused-vars
      base.correctedAnswer = answers.map(({ correctness, ...rest }) => {
        return { ...rest, interactive: false };
      });

      base.addCategoryEnabled = false;
    }

    if (env.mode === 'evaluate') {
      base.correctedAnswer = answers;
      base.correctAnswer = correctAnswer;
      base.showToggle = !!correctAnswer?.data?.length && scoreObject.score !== 1;
      base.addCategoryEnabled = false;
      base.showKeyLegend = true;
    }

    if (env.role === 'instructor' && (env.mode === 'view' || env.mode === 'evaluate')) {
      base.rationale = rationaleEnabled ? rationale : null;
      base.teacherInstructions = teacherInstructionsEnabled ? teacherInstructions : null;
    } else {
      base.rationale = null;
      base.teacherInstructions = null;
    }

    log('base: ', base);
    resolve(base);
  });
}

export function outcome(model, session, env) {
  return new Promise((resolve) => {
    const scoreObject = getScore(model, session, env);
    const result = {
      score: scoreObject.score,
      empty: !session || isEmpty(session),
    };
    if (env.extraProps && env.extraProps.correctResponseEnabled) {
      result.extraProps = { correctResponse: scoreObject.correctResponses };
    }
    resolve(result);
  });
}

export const createCorrectResponseSession = (question, env) => {
  return new Promise((resolve) => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      const { correctAnswer } = question;

      let answers = correctAnswer && correctAnswer.data;

      // for IBX preview mode
      if (env.mode === 'gather') {
        const { data } = question;

        answers = ((correctAnswer && correctAnswer.data) || []).map((answer, index) => {
          return {
            ...data[index],
            ...answer,
          };
        });
      }

      resolve({
        answer: answers,
        id: '1',
      });
    } else {
      return resolve(null);
    }
  });
};

// remove all html tags
const getInnerText = (html) => (html || '').replaceAll(/<[^>]*>/g, '');

// remove all html tags except img, iframe and source tag for audio
const getContent = (html) => (html || '').replace(/(<(?!img|iframe|source)([^>]+)>)/gi, '');

export const validate = (model = {}, config = {}) => {
  const { correctAnswer, data } = model || {};
  const { data: correctData } = correctAnswer || {};
  const categories = correctData || [];

  const errors = {};
  const correctAnswerErrors = {};
  const categoryErrors = {};

  ['teacherInstructions', 'prompt', 'rationale'].forEach((field) => {
    if (config[field]?.required && !getContent(model[field])) {
      errors[field] = 'This field is required.';
    }
  });

  categories.forEach((category, index) => {
    const { label } = category;

    if (!getInnerText(label)) {
      categoryErrors[index] = 'Content should not be empty. ';
    } else {
      const identicalAnswer = categories.some((c, i) => c.label === label && index !== i);

      if (identicalAnswer) {
        categoryErrors[index] = 'Category names should be unique. ';
      }
    }
  });

  if (categories.length < 1 || categories.length > 20) {
    correctAnswerErrors.categoriesError = 'The correct answer should include between 1 and 20 categories.';
  } else if (
    isEqual(
      data.map((category) => pick(category, 'value', 'label')),
      correctData.map((category) => pick(category, 'value', 'label')),
    )
  ) {
    correctAnswerErrors.identicalError = 'Correct answer should not be identical to the chart’s initial state';
  }

  if (!isEmpty(categoryErrors)) {
    errors.categoryErrors = categoryErrors;
  }

  if (!isEmpty(correctAnswerErrors)) {
    errors.correctAnswerErrors = correctAnswerErrors;
  }

  return errors;
};
