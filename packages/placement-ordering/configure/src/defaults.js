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
    feedbackEnabled: true,
    promptEnabled: true,
    teacherInstructionsEnabled: true,
    studentInstructionsEnabled: true,
    toolbarEditorPosition: 'bottom'
  },
  configuration: {
    choiceLabel: {
      settings: true,
      label: 'Choice label'
    },
    choices: {
      settings: true,
      label: 'Choices',
    },
    enableImages: {
      settings: true,
      label: 'Enable Images',
    },
    feedback: {
      settings: true,
      label: 'Feedback',
      enabled: true
    },
    prompt: {
      settings: true,
      label: 'Item Stem'
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
      label: 'Allow Partial Scoring'
    },
    placementArea: {
      settings: true,
      label: 'Placement Area',
    },
    rationale: {
      settings: true,
      label: 'Rationale',
    },
    removeTilesAfterPlacing: {
      settings: false,
      label: 'Remove Tiles after placing'
    },
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
      settings:false,
      enabled:true
    },
    teacherInstructions: {
      settings: true,
      label: 'Teacher Instructions',
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
      choices: 150
    },
    withRubric: {
      settings: false,
      label: 'Add Rubric'
    }
  }
};
