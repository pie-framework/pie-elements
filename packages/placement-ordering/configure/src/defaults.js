/** NOTE: teacherInstructions, studentInstructions, rationale & scoringType
 * functionalities are not defined yet - the value for those can belong to
 * model or to configuration
 */

export default {
  model: {
    choiceLabel: '',
    choices: [],
    correctResponse: [],
    enableImages: false,
    prompt: 'Item Stem goes here',
    numberedGuides: false,
    orientation: 'vertical',
    partialScoring: true,
    placementArea: false,
    removeTilesAfterPlacing: true,
    choiceLabelEnabled: true,
    scoringType: 'auto',
    targetLabel: '',
    rationaleEnabled: true,
    feedbackEnabled: false,
    promptEnabled: true,
    teacherInstructionsEnabled: true,
    studentInstructionsEnabled: true,
    toolbarEditorPosition: 'bottom',
  },
  configuration: {
    baseInputConfiguration: {
      audio: { disabled: false },
      video: { disabled: false },
      image: { disabled: false },
    },
    choiceLabel: {
      settings: true,
      label: 'Choice label',
      inputConfiguration: {
        audio: { disabled: false },
        video: { disabled: false },
        image: { disabled: false },
      },
    },
    choices: {
      settings: true,
      label: 'Choices',
      inputConfiguration: {
        audio: { disabled: true },
        video: { disabled: true },
        image: { disabled: true },
      },
    },
    enableImages: {
      settings: true,
      label: 'Enable Images',
    },
    feedback: {
      settings: true,
      label: 'Feedback',
      enabled: true,
    },
    prompt: {
      settings: true,
      label: 'Item Stem',
      required: false,
      inputConfiguration: {
        audio: { disabled: false },
        video: { disabled: false },
        image: { disabled: false },
      },
    },
    numberedGuides: {
      settings: true,
      label: 'Numbered guides',
    },
    orientation: {
      settings: true,
      label: 'Orientation',
    },
    partialScoring: {
      settings: false,
      label: 'Allow Partial Scoring',
    },
    placementArea: {
      settings: true,
      label: 'Placement Area',
    },
    rationale: {
      settings: true,
      label: 'Rationale',
      required: false,
      inputConfiguration: {
        audio: { disabled: false },
        video: { disabled: false },
        image: { disabled: false },
      },
    },
    removeTilesAfterPlacing: {
      settings: false,
      label: 'Remove Tiles after placing',
    },
    settingsPanelDisabled: false,
    scoringType: {
      settings: false,
      label: 'Scoring Type',
    },
    studentInstructions: {
      settings: false,
      label: 'Student Instructions',
    },
    targetLabel: {
      settings: true,
      label: 'Target label',
    },
    spellCheck: {
      label: 'Spellcheck',
      settings: false,
      enabled: true,
    },
    teacherInstructions: {
      settings: true,
      label: 'Teacher Instructions',
      required: false,
      inputConfiguration: {
        audio: { disabled: false },
        video: { disabled: false },
        image: { disabled: false },
      },
    },
    maxImageWidth: {
      teacherInstructions: 300,
      prompt: 300,
      rationale: 300,
      choicesWithPlacementArea: 240,
      choicesWithoutPlacementArea: 300,
    },
    maxImageHeight: {
      teacherInstructions: 300,
      prompt: 300,
      rationale: 300,
      choices: 150,
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
