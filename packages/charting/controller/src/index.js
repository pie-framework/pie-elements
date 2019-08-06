import debug from 'debug';

const log = debug('@pie-element:graphing:controller');

const lowerCase = string => (string || '').toLowerCase();

export const getScore = (question, session) => {
  const { correctAnswer, data: initialData, scoringType, editCategoryEnabled } = question;

  const { data: correctAnswers } = correctAnswer || {};
  const defaultAnswers = filterCategories(initialData, editCategoryEnabled);
  const answers = (session && session.answer) || defaultAnswers;

  let result = 0;

  if (scoringType === 'partial scoring') {
    let maxScore = 0;
    let score = 0;

    correctAnswers.forEach((corrAnswer, index) => {
      const defaultAnswer = defaultAnswers[index];
      const answer = answers[index];

      // daca userul a dat un raspuns
      if (answer) {
        const { value, label } = answer;

        // daca raspunsul a fost un raspuns initial
        if (defaultAnswer) {
          // daca labelul raspunsului initial nu putea fi editat
          if (!defaultAnswer.editable && answer.interactive) {
            maxScore += 1;

            if (value === corrAnswer.value) {
              score += 1;
            }
            // daca si labelul si valoarea raspunsului initial puteau fi editate
          } else if (defaultAnswer.editable && answer.interactive) {
            maxScore += 2;

            if (value === corrAnswer.value) {
              score += 1;
            }
            if (lowerCase(label) === lowerCase(corrAnswer.label)) {
              score += 1;
            }
          }
        } else {
          // daca raspunsul a fost adaugat de user
          maxScore += 2;

          if (value === corrAnswer.value) {
            score += 1;
          }
          if (lowerCase(label) === lowerCase(corrAnswer.label)) {
            score += 1;
          }
        }
      } else {
        // daca userul nu a dat niciun raspuns
        maxScore += 2;
      }
    });

    console.log('\nmaxScore', maxScore);
    console.log('score', score);
    console.log('result', score / maxScore);
    result = score / maxScore;
  } else {
    result = correctAnswers.length === answers.length ? 1 : 0;

    if (result) {
      correctAnswers.forEach((corrAnswer, index) => {
        const { value, label } = answers[index];

        if (value !== corrAnswer.value || lowerCase(label) !== lowerCase(corrAnswer.label)) {
          result = 0;
        }
      });
    }
  }

  return result;
};

const filterCategories = (categories, editable) => {
  return categories.map(category => ({
    ...category,
    deletable: false,
    editable,
    initial: true
  }));
};

export function model(question, session, env) {
  return new Promise(resolve => {
    const {
      addCategoryEnabled,
      categoryDefaultLabel,
      chartType,
      data,
      domain,
      editCategoryEnabled,
      graph,
      prompt,
      range,
      rationale,
      scoringType,
      title
    } = question;

    const correctInfo = { correctness: 'incorrect', score: '0%' };

    const base = {
      addCategoryEnabled,
      categoryDefaultLabel,
      chartType,
      data: filterCategories(data, editCategoryEnabled),
      domain,
      editCategoryEnabled,
      graph,
      prompt,
      range,
      rationale,
      title,
      size: graph,
      correctness: correctInfo,
      disabled: env.mode !== 'gather',
    };

    console.log('scoringType', scoringType);
    console.log('session', session);

    if (env.mode === 'evaluate') {
      const result = getScore(question, session);
    }

    if (env.role === 'instructor' && (env.mode === 'view' || env.mode === 'evaluate')) {
      base.rationale = question.rationale;
      base.teacherInstructions = question.teacherInstructions;
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
    resolve({ score: getScore(model, session) });
  });
}
