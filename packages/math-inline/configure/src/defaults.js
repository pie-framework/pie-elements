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
  },
  configuration: {
    prompt: {
      settings: true,
      label: 'Prompt',
      enabled: true,
    },
    feedback: {
      settings: true,
      label: 'Feedback',
      enabled: true
    },
    responseType: {
      settings: true,
      label: 'Response type'
    },
    rationale: {
      settings: true,
      label: 'Rationale',
      enabled: false,
    },
    scoringType: {
      settings: false,
      label: 'Scoring Type',
    },
    studentInstructions: {
      settings: false,
      label: 'Student Instructions',
      enabled: true,
    },
    teacherInstructions: {
      settings: true,
      label: 'Teacher Instructions',
      enabled: true,
    },
    partialScoring: {
      settings: true,
      label: 'Allow Partial Scoring',
    }
  }
};
