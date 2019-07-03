/** NOTE: teacherInstructions, studentInstructions, rationale & scoringType
 * functionalities are not defined yet - the value for those can belong to
 * model or to configure
 */
export default {
  model: {
    choiceMode: 'checkbox',
    choicePrefix: 'numbers',
    choices: [
      {
        correct: true,
        value: 'choice1',
        label: 'Choice One',
      },
      {
        correct: true,
        value: 'choice2',
        label: 'Choice 2One',
      },
      {
        correct: true,
        value: 'choice3',
        label: 'Choice 3One',
      },
      {
        correct: true,
        value: 'choice4',
        label: 'Choice 4One',
      },
    ],
    prompt: 'Question Prompt goes here',
    lockChoiceOrder: true,
    partialScoring: true,
    scoringType: 'auto',
  },
  configuration: {
    answerChoiceCount: 4,
    addChoiceButton: {
      settings: true,
      label: 'Add a Choice',
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
      settings: true,
    },
    feedback: {
      settings: true,
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
      label: 'Allow Partial Scoring',
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
  }
};