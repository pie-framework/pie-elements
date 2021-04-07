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
        type: 'none'
      },
      incorrect: {
        default: 'Incorrect',
        type: 'none'
      },
      partial: {
        default: 'Nearly',
        type: 'none'
      }
    },
    equationEditor: '3',
    expression: '',
    rationale: 'Rationale goes here.',
    prompt: '',
    responses: [],
    customKeys: [],
    scoringType: 'auto',
    feedbackEnabled: true,
    promptEnabled: true,
    rationaleEnabled: true,
    teacherInstructionsEnabled: true,
    studentInstructionsEnabled: true,
  },
  configuration: {
    prompt: {
      settings: true,
      label: 'Prompt'
    },
    feedback: {
      settings: true,
      label: 'Feedback'
    },
    responseType: {
      settings: true,
      label: 'Response type'
    },
    rationale: {
      settings: true,
      label: 'Rationale'
    },
    scoringType: {
      settings: false,
      label: 'Scoring Type'
    },
    studentInstructions: {
      settings: false,
      label: 'Student Instructions'
    },
    teacherInstructions: {
      settings: true,
      label: 'Teacher Instructions'
    },
    partialScoring: {
      settings: false,
      label: 'Allow Partial Scoring'
    },
    allowTrailingZeros: {
      label: 'Allow Trailing Zeros',
      enabled: true,
      default: true
    }
  }
};
