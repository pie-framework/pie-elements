/** NOTE: teacherInstructions, studentInstructions, rationale & scoringType
 * functionalities are not defined yet - the value for those can belong to
 * model or to configure
 */

export default {
  responseType: 'Advanced Multi',
  expression: 'y = ',
  question: 'What is the equation for a slope?',
  equationEditor: 'everything',
  response: {
    id: 'answerBlock1',
    answer: 'mx + b',
    validation: 'symbolic',
    alternates: {},
    allowSpaces: true,
    allowDecimals: true
  },
  responses: [],
  partialScoring: true,
  feedback: {
    correct: {
      type: 'none',
      default: 'Correct'
    },
    partial: {
      type: 'none',
      default: 'Nearly'
    },
    incorrect: {
      type: 'none',
      default: 'Incorrect'
    }
  },
  scoringType: 'auto',

  configure: {
    responseType: {
      settings: true,
      label: 'Response type'
    },
    rationale: {
      settings: true,
      label: 'Rationale',
      enabled: true,
    },
    scoringType: {
      settings: true,
      label: 'Scoring Type',
    },
    studentInstructions: {
      settings: true,
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
