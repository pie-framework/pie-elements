/** NOTE: teacherInstructions, studentInstructions, rationale & scoringType
 * functionalities are not defined yet - the value for those can belong to
 * model or to configure
 */
export default {
  model: {
    teacherInstructionsEnabled: true,
    labelType: 'agreement',
    rowLabels: ['I\'m interested in politics.', 'I\'m interested in economics.'],
    columnLabels: ['Disagree', 'Unsure', 'Agree'],
    matrixValues: {},
    prompt: 'How interested are you in the following domains?'
  },
  configuration: {
    teacherInstructions: {
      settings: true,
      label: 'Teacher Instructions'
    },
    prompt: {
      settings: true,
      label: 'Prompt'
    }
  }
};
