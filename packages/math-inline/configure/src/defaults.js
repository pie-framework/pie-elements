import { ResponseTypes } from './utils';

/** NOTE: teacherInstructions, studentInstructions, rationale & scoringType
 * functionalities are not defined yet - the value for those can belong to
 * model or to configure
 */

export default {
  model: {
    partialScoring: true,
    responseType: ResponseTypes.advanced,
    element: 'math-inline',
    feedback: {
      correct: {
        default: 'Correct',
        type: 'none',
      },
      incorrect: {
        default: 'Incorrect',
        type: 'none',
      },
      partial: {
        default: 'Nearly',
        type: 'none',
      },
    },
    equationEditor: '8',
    expression: '',
    rationale: 'Rationale goes here.',
    note:
      'The answer shown above is the primary correct answer specified by the author for this item, but other answers may also be recognized as correct.',
    prompt: '',
    responses: [],
    customKeys: [],
    scoringType: 'auto',
    feedbackEnabled: true,
    promptEnabled: true,
    rationaleEnabled: true,
    teacherInstructionsEnabled: true,
    studentInstructionsEnabled: true,
    toolbarEditorPosition: 'bottom',
    validationDefault: 'literal',
    ignoreOrderDefault: false,
    allowTrailingZerosDefault: false,
  },
  configuration: {
    prompt: {
      settings: true,
      label: 'Prompt',
    },
    feedback: {
      settings: true,
      label: 'Feedback',
    },
    responseType: {
      settings: true,
      label: 'Response type',
    },
    rationale: {
      settings: true,
      label: 'Rationale',
    },
    spellCheck: {
      label: "Spellcheck",
      settings:true,
      enabled:true
    },
    scoringType: {
      settings: false,
      label: 'Scoring Type',
    },
    studentInstructions: {
      settings: false,
      label: 'Student Instructions',
    },
    teacherInstructions: {
      settings: true,
      label: 'Teacher Instructions',
    },
    partialScoring: {
      settings: false,
      label: 'Allow Partial Scoring',
    },
    ignoreOrder: {
      settings: false,
      label: 'Ignore Order',
      enabled: true,
    },
    allowTrailingZeros: {
      settings: false,
      label: 'Allow Trailing Zeros',
      enabled: true
    },
  },
};
