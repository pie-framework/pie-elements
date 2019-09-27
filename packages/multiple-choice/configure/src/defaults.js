/** NOTE: teacherInstructions, studentInstructions, rationale & scoringType
 * functionalities are not defined yet - the value for those can belong to
 * model or to configure
 */
export default {
  model: {
    choiceMode: 'checkbox',
    choicePrefix: 'numbers',
    choices: [],
    prompt: 'Question Prompt goes here',
    lockChoiceOrder: true,
    partialScoring: true,
    scoringType: 'auto',
    promptEnabled: false,
    rationaleEnabled: false,
    teacherInstructionsEnabled: false,
    studentInstructionsEnabled: false
  },
  configuration: {
    answerChoiceCount: 0,
    addChoiceButton: {
      settings: true,
      label: 'Add a Choice'
    },
    choiceMode: {
      settings: true,
      label: 'Response Type'
    },
    choicePrefix: {
      settings: true,
      label: 'Choice Labels'
    },
    deleteChoice: {
      settings: true
    },
    feedback: {
      settings: true,
      label: 'Feedback',
      enabled: true
    },
    prompt: {
      settings: true,
      label: 'Prompt'
    },
    lockChoiceOrder: {
      settings: true,
      label: 'Lock Choice Order'
    },
    partialScoring: {
      settings: true,
      label: 'Allow Partial Scoring'
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
    }
  }
};
