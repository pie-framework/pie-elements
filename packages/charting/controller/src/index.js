import debug from 'debug';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';

import { partialScoring } from '@pie-lib/controller-utils';

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

export const normalize = (question) => ({
  addCategoryEnabled: true,
  promptEnabled: true,
  rationaleEnabled: true,
  teacherInstructionsEnabled: true,
  studentInstructionsEnabled: true,
  ...question,
});

export const getScore = (question, session, env = {}) => {
  const { correctAnswer, data: initialData = [], scoringType } = question;

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
      const { value, label } = answer;

      maxScore += 2;

      if (value === corrAnswer.value) {
        score += 1;
        answer.correctness.value = 'correct';
      }

      if (checkLabelsEquality(label, corrAnswer.label)) {
        score += 1;
        answer.correctness.label = 'correct';
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
            }
            answer.correctness.label = 'correct';

            // if category's label (in default answer) was editable
            // it means that this category values 2 points (both label and value can be changed)
          } else if (defaultAnswer.editable && answer.interactive) {
            scoreForLabelAndValueEditable(answer, corrAnswer);
          } else if (!answer.interactive) {
            answer.correctness.value = 'correct';
            answer.correctness.label = 'correct';
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
    // if scoring type is "all or nothing"
    // the length on correct answers and length of given answer have to match
    result = correctAnswers.length === answers.length ? 1 : 0;

    if (result) {
      // if there is at least one difference between the correct answer and the given answer
      // the result will be incorrect
      correctAnswers.forEach((corrAnswer, index) => {
        const { value, label } = answers[index];

        if (value !== corrAnswer.value) {
          result = 0;
          answers[index].correctness.value = 'incorrect';
        }
        if (lowerCase(label) !== lowerCase(corrAnswer.label)) {
          result = 0;
          answers[index].correctness.label = 'incorrect';
        }
      });
    } else {
      answers = [
        ...answers.slice(0, correctAnswers.length),
        ...setCorrectness(answers.slice(correctAnswers.length), true),
      ];
    }
  }

  return {
    score: parseFloat(result.toFixed(2)),
    answers,
  };
};

// eslint-disable-next-line no-unused-vars
export const filterCategories = (categories) => (categories ? categories.map(({ deletable, ...rest }) => rest) : []);

export function model(question, session, env) {
  return new Promise((resolve) => {
    const normalizedQuestion = normalize(question);
    const {
      addCategoryEnabled,
      categoryDefaultLabel,
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
      studentCategoryDefaultLabel,
    } = normalizedQuestion;

    const correctInfo = { correctness: 'incorrect', score: '0%' };

    const base = {
      addCategoryEnabled,
      categoryDefaultLabel,
      chartType,
      data: filterCategories(data),
      domain,
      graph,
      prompt: promptEnabled ? prompt : null,
      range,
      rationale,
      title,
      size: graph,
      correctness: correctInfo,
      disabled: env.mode !== 'gather',
      scoringType,
      studentCategoryDefaultLabel,
    };

    const answers = filterCategories(getScore(normalizedQuestion, session, env).answers);

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
      base.addCategoryEnabled = false;
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
    resolve({
      score: getScore(model, session, env).score,
      empty: !session || isEmpty(session),
    });
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

export const validate = (model = {}) => {
  const { correctAnswer, data } = model || {};
  const { data: correctData } = correctAnswer || {};
  const categories = correctData || [];

  const errors = {};
  const correctAnswerErrors = {};
  const categoryErrors = {};

  categories.forEach((category, index) => {
    const { label } = category;

    if (label === '' || label === '<div></div>') {
      categoryErrors[index] = 'Content should not be empty.';
    } else {
      const identicalAnswer = categories.slice(index + 1).some((c) => c.label === label);

      if (identicalAnswer) {
        categoryErrors[index + 1] = 'Content should be unique.';
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
