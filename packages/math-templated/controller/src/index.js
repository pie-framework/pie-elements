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
    };

    // I just pasted some math-input content for now, just dummy stuff here, and replaced expression with markup
    // the plan is to stop using config, and send props directly
    resolve({
      "markup": "<p>{{1}} + {{2}} = {{3}}</p>",
      "responseType": "Advanced Multi",
      "element": "math-inline",
      "equationEditor": 3,
      "question": "",
      "customKeys": [],
      "feedbackEnabled": false,
      "promptEnabled": true,
      "rationaleEnabled": true,
      "teacherInstructionsEnabled": true,
      "studentInstructionsEnabled": true,
      "partialScoring": true,
      "rationale": null,
      "prompt": "<p><strong>B.</strong> Find the value of the expression that you wrote in part A to find how much money the band members made.</p>\n\n<p>Use the on-screen keyboard to type your answer in the box below.</p>\n",
      "scoringType": "auto",
      "toolbarEditorPosition": "bottom",
      "validationDefault": "literal",
      "ignoreOrderDefault": false,
      "allowTrailingZerosDefault": false,
      "rubricEnabled": false,
      "id": "1",
      "responses": [],
      "showNote": false,
      "teacherInstructions": null,
      "env": {
        "mode": "gather"
      },
      config: {
        "responseType": "Advanced Multi",
        "element": "math-inline",
        "equationEditor": 3,
        "question": "",
        "customKeys": [],
        "feedbackEnabled": false,
        "promptEnabled": true,
        "rationaleEnabled": true,
        "teacherInstructionsEnabled": true,
        "studentInstructionsEnabled": true,
        "partialScoring": true,
        "rationale": null,
        "prompt": "<p><strong>B.</strong> Find the value of the expression that you wrote in part A to find how much money the band members made.</p>\n\n<p>Use the on-screen keyboard to type your answer in the box below.</p>\n",
        "scoringType": "auto",
        "toolbarEditorPosition": "bottom",
        "validationDefault": "literal",
        "ignoreOrderDefault": false,
        "allowTrailingZerosDefault": false,
        "rubricEnabled": false,
        "id": "1",
        "responses": [],
        "showNote": false,
        "teacherInstructions": null,
        "env": {
          "mode": "gather"
        },
      },

      "disabled": false,
      "view": false,
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
