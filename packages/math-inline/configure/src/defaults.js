import { ResponseTypes } from './utils';

/** NOTE: teacherInstructions, studentInstructions, rationale & scoringType
 * functionalities are not defined yet - the value for those can belong to
 * model or to configure
 */

export default {
  model: {
    allowTrailingZerosDefault: false,
    customKeys: [],
    equationEditor: 8,
    expression: '',
    feedback: {
      correct: { default: 'Correct', type: 'none' },
      incorrect: { default: 'Incorrect', type: 'none' },
      partial: { default: 'Nearly', type: 'none' },
    },
    feedbackEnabled: false,
    ignoreOrderDefault: false,
    partialScoring: true,
    prompt: '',
    promptEnabled: true,
    rationale: '',
    rationaleEnabled: true,
    responseType: ResponseTypes.advanced,
    responses: [],
    scoringType: 'auto',
    studentInstructionsEnabled: true,
    teacherInstructions: '',
    teacherInstructionsEnabled: true,
    toolbarEditorPosition: 'bottom',
    validationDefault: 'literal',
  },
  configuration: {
    baseInputConfiguration: {
      audio: { disabled: false },
      video: { disabled: false },
      image: { disabled: false },
    },
    prompt: {
      settings: true,
      label: 'Prompt',
      inputConfiguration: {
        audio: { disabled: false },
        video: { disabled: false },
        image: { disabled: false },
      },
      required: false,
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
      inputConfiguration: {
        audio: { disabled: false },
        video: { disabled: false },
        image: { disabled: false },
      },
      required: false,
    },
    settingsPanelDisabled: false,
    spellCheck: {
      label: 'Spellcheck',
      settings: false,
      enabled: true,
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
      inputConfiguration: {
        audio: { disabled: false },
        video: { disabled: false },
        image: { disabled: false },
      },
      required: false,
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
      enabled: true,
    },
    maxImageWidth: {
      teacherInstructions: 300,
      prompt: 300,
      rationale: 300,
    },
    maxImageHeight: {
      teacherInstructions: 300,
      prompt: 300,
      rationale: 300,
    },
    withRubric: {
      settings: false,
      label: 'Add Rubric',
    },
    mathMlOptions: {
      mmlOutput: false,
      mmlEditing: false,
    },
    language: {
      settings: false,
      label: 'Specify Language',
      enabled: false,
    },
    languageChoices: {
      label: 'Language Choices',
      options: [],
    },
  },
};
