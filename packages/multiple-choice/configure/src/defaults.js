/** NOTE: teacherInstructions, studentInstructions, rationale & scoringType
 * functionalities are not defined yet - the value for those can belong to
 * model or to configure
 */
export default {
  model: {
    choiceMode: 'checkbox',
    choicePrefix: 'letters',
    choices: [],
    choicesLayout: 'vertical',
    feedbackEnabled: false,
    gridColumns: 2,
    lockChoiceOrder: true,
    partialScoring: true,
    prompt: '',
    promptEnabled: true,
    rationale: '',
    rationaleEnabled: true,
    scoringType: 'auto',
    studentInstructionsEnabled: true,
    teacherInstructions: '',
    teacherInstructionsEnabled: true,
    toolbarEditorPosition: 'bottom',
    selectedAnswerBackgroundColor: 'initial',
    keyboardEventsEnabled: false,
  },
  configuration: {
    baseInputConfiguration: {
      audio: { disabled: false },
      video: { disabled: false },
      image: { disabled: false },
      textAlign: { disabled: true },
    },
    choices: {
      inputConfiguration: {
        audio: { disabled: false },
        video: { disabled: false },
        image: { disabled: false },
      },
    },
    spellCheck: {
      label: 'Spellcheck',
      settings: false,
      enabled: true,
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
      inputConfiguration: {
        audio: { disabled: false },
        video: { disabled: false },
        image: { disabled: false },
      },
      required: false,
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
      inputConfiguration: {
        audio: { disabled: true },
        video: { disabled: true },
        image: { disabled: false },
      },
      required: false,
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
    toolbarEditorPosition: {
      settings: false,
      label: 'Toolbar Editor Position',
    },
    minAnswerChoices: 2,
    maxAnswerChoices: 5,
    maxImageWidth: {
      teacherInstructions: 300,
      prompt: 300,
      rationale: 636,
      choices: 900,
    },
    maxImageHeight: {
      teacherInstructions: 300,
      prompt: 300,
      rationale: 300,
      choices: 300,
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
