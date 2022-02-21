/** NOTE: teacherInstructions, studentInstructions, rationale & scoringType
 * functionalities are not defined yet - the value for those can belong to
 * model or to configure
 */
export default {
  model: {
    choiceMode: 'checkbox',
    choicePrefix: 'letters',
    choices: [],
    prompt: 'Question Prompt goes here',
    lockChoiceOrder: true,
    partialScoring: true,
    scoringType: 'auto',
    feedbackEnabled: true,
    promptEnabled: true,
    rationaleEnabled: true,
    teacherInstructionsEnabled: true,
    studentInstructionsEnabled: true,
    toolbarEditorPosition: 'bottom',
    choicesLayout: 'vertical',
    gridColumns: '2',
  },
  configuration: {
    spellCheck: {
      label: "Spellcheck",
      settings:true,
      enabled:true
    },
    choicesLayout: {
      settings: false,
      label: 'Choices Layout',
    },
    gridColumns: {
      label: 'Grid columns',
    },
    answerChoiceCount: 0,
    addChoiceButton: {
      settings: true,
      label: 'Add a Choice',
    },
    choiceMode: {
      settings: true,
      label: 'Response Type',
    },
    choicePrefix: {
      settings: true,
      label: 'Choice Labels',
    },
    deleteChoice: {
      settings: true,
    },
    feedback: {
      settings: true,
      label: 'Feedback',
    },
    prompt: {
      settings: true,
      label: 'Prompt',
    },
    lockChoiceOrder: {
      settings: true,
      label: 'Lock Choice Order',
    },
    partialScoring: {
      settings: false,
      label: 'Allow Partial Scoring',
    },
    rationale: {
      settings: true,
      label: 'Rationale',
    },
    accessibility: {
      settings: false,
      label: 'Accessibility Label'
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
    toolbarEditorPosition: {
      settings: false,
      label: 'Toolbar Editor Position',
    },
    minAnswerChoices: 2,
    maxAnswerChoices: 5
  },
};
