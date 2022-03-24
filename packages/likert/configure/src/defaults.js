/** NOTE: teacherInstructions, studentInstructions, rationale & scoringType
 * functionalities are not defined yet - the value for those can belong to
 * model or to configure
 */
export default {
  model: {
    likertScale: 'likert3',
    likertType: 'agreement',
    likertOrientation: 'horizontal',
    choices: [],
    teacherInstructionsEnabled: true,
  },
  configuration: {
    teacherInstructions: {
      settings: true,
      label: 'Teacher Instructions'
    },
    spellCheck: {
      label: "Spellcheck",
      settings:false,
      enabled:true
    },
    prompt: {
      settings: true,
      label: 'Prompt'
    }
  }
};
