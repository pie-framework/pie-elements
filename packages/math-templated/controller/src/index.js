import isEmpty from 'lodash/isEmpty';
import defaults from './defaults';

export const getCorrectness = (model) => {
  const correctnessCondition = 'c';

  switch (correctnessCondition) {
    case 'c':
      return 'correct';
    case 'pc':
      return 'partially-correct';
    case 'i':
      return 'incorrect';
    default:
      return 'unknown';
  }
};

export const getPartialScore = (question, session) => {
  if (!session || isEmpty(session)) {
    return 0;
  }

  return 1;
};

export const outcome = (question, session, env) =>
  new Promise((resolve) => {
    if (!session || isEmpty(session)) {
      resolve({ score: 0, empty: true });
    }

    session = normalizeSession(session);

    if (env.mode !== 'evaluate') {
      resolve({ score: undefined, completed: undefined });
    } else {
      resolve({ score: 1 });
    }
  });

export const createDefaultModel = (model = {}) => ({
  ...defaults.model,
  ...model,
});
export const normalizeSession = (s) => ({
  ...s,
});

export const model = (question, session, env) => {
  return new Promise((resolve) => {
    session = session || {};
    const normalizedQuestion = createDefaultModel(question);

    const out = {
      prompt: normalizedQuestion.promptEnabled ? normalizedQuestion.prompt : null,
      env,
      markup: normalizedQuestion.markup,
      slateMarkup: normalizedQuestion.slateMarkup,
      playerSpellCheckEnabled: normalizedQuestion.playerSpellCheckEnabled,
      equationEditor: normalizedQuestion.equationEditor,
      customKeys: normalizedQuestion.customKeys
    };

    if (env.role === 'instructor') {
      // TODO verify this
      out.teacherInstructions = normalizedQuestion.teacherInstructionsEnabled ? normalizedQuestion.teacherInstructions : null;
      out.rationale = normalizedQuestion.rationaleEnabled ? normalizedQuestion.rationale : null;
    }

    if (env.mode === 'evaluate') {
      out.responses = normalizedQuestion.responses;
    }

    out.expression = '{{response}}{{response}}{{response}}';

    resolve({
      "feedback": {
        "correct": {
          "default": "Correct",
          "type": "none"
        },
        "incorrect": {
          "default": "Incorrect",
          "type": "none"
        },
        "partial": {
          "default": "Nearly",
          "type": "none"
        }
      },
      "disabled": false,
      "view": false,
      "rationale": null,
      "teacherInstructions": null,
      "responseType": "Advanced Multi",
      "element": "pie-element-math-inline",
      "equationEditor": 3,
      "expression": "{{response}}",
      "question": "",
      "customKeys": [],
      "feedbackEnabled": false,
      "promptEnabled": true,
      "rationaleEnabled": true,
      "teacherInstructionsEnabled": true,
      "studentInstructionsEnabled": true,
      "partialScoring": true,
      "prompt": "<p><b>B.</b> Find the value of the expression that you wrote in part A to find how much money the band members made.</p><p>Use the on-screen keyboard to type your answer in the box below....</p>",
      "scoringType": "auto",
      "toolbarEditorPosition": "bottom",
      "validationDefault": "literal",
      "ignoreOrderDefault": false,
      "allowTrailingZerosDefault": false,
      "id": "0",
      "rubricEnabled": false,
      "responses": [],
      "showNote": false,
      "env": {
        "mode": "gather"
      }
    });
  });
};

export const createCorrectResponseSession = (question, env) => {
  return new Promise((resolve) => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      resolve({ id: '1' });
    } else {
      resolve(null);
    }
  });
};

export const validate = (model = {}, config = {}) => {
  const errors = {};

  return errors;
};
