import debug from 'debug';
import isEmpty from 'lodash/isEmpty';

const log = debug('@pie-element:graphing:controller');

const lowerCase = string => (string || '').toLowerCase();

export const checkLabelsEquality = (givenAnswerLabel, correctAnswerLabel) =>
  lowerCase(givenAnswerLabel) === lowerCase(correctAnswerLabel);

export const setCorrectness = (answers, partialScoring) => answers ? answers.map(answer => ({
  ...answer,
  correctness: {
    value: partialScoring ? 'incorrect' : 'correct',
    label: partialScoring ? 'incorrect' : 'correct'
  }
})) : [];


export const normalize = question => ({
  promptEnabled: true,
  rationaleEnabled: true,
  teacherInstructionsEnabled: true,
  studentInstructionsEnabled: true,
  ...question,
});

export const getScore = (question, session) => {
  const { correctAnswer, data: initialData = [], scoringType, editCategoryEnabled } = question;

  const { data: correctAnswers = [] } = correctAnswer || {};
  const defaultAnswers = filterCategories(initialData, editCategoryEnabled);
  let answers = setCorrectness((session && session.answer) || defaultAnswers, scoringType === 'partial scoring');

  let result = 0;

  if (scoringType === 'partial scoring') {
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
        ...setCorrectness(answers.slice(correctAnswers.length), true)
      ];
    }
  }

  return {
    score: parseFloat(result.toFixed(2)),
    answers
  };
};

export const filterCategories = (categories, editable) => categories ? categories.map(category => ({
  ...category,
  deletable: false,
  editable,
  initial: true
})) : [];

export function model(question, session, env) {
  return new Promise(resolve => {
    const normalizedQuestion = normalize(question);
    const {
      addCategoryEnabled,
      categoryDefaultLabel,
      chartType,
      data,
      domain,
      editCategoryEnabled,
      graph,
      prompt,
      promptEnabled,
      range,
      rationale,
      teacherInstructions,
      title,
      rationaleEnabled,
      teacherInstructionsEnabled
    } = normalizedQuestion;

    const correctInfo = { correctness: 'incorrect', score: '0%' };

    const base = {
      addCategoryEnabled,
      categoryDefaultLabel,
      chartType,
      data: filterCategories(data, editCategoryEnabled),
      domain,
      editCategoryEnabled,
      graph,
      prompt: promptEnabled ? prompt : null,
      range,
      rationale,
      title,
      size: graph,
      correctness: correctInfo,
      disabled: env.mode !== 'gather',
    };

    if (env.mode === 'evaluate' || env.mode === 'view') {
      base.correctedAnswer = filterCategories(getScore(normalizedQuestion, session).answers, false);
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

export function outcome(model, session) {
  return new Promise(resolve => {
    resolve({
      score: getScore(model, session).score,
      empty: !session || isEmpty(session)
    });
  });
}

export const createCorrectResponseSession = (question, env) => {
  return new Promise(resolve => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      const { correctAnswer } = question;

      resolve({
        answer: correctAnswer && correctAnswer.data,
        id: '1'
      });
    } else {
      return resolve(null);
    }
  });
};
