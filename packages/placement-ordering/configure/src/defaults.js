/** NOTE: teacherInstructions, studentInstructions, rationale & scoringType
 * functionalities are not defined yet - the value for those can belong to
 * model or to configuration
 */

export default {
  model: {
    choiceLabel: 'Choice Label goes here',
    choices: [
      {
        id: 'c1',
        label: 'Choice 1',
      },
    ],
    enableImages: false,
    prompt: 'Item Stem goes here',
    lockChoiceOrder: false,
    numberedGuides: false,
    orientation: 'vertical',
    partialScoring: true,
    placementArea: false,
    removeTilesAfterPlacing: true,
    scoringType: 'auto',
    targetLabel: 'Target Label goes here',
  },
  configuration: {
    choiceLabel: {
      settings: true,
      label: 'Choice label',
      enabled: true,
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
    },
    prompt: {
      settings: true,
      label: 'Item Stem'
    },
    lockChoiceOrder: {
      settings: true,
      label: 'Lock Choice Order'
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
      settings: true,
      label: 'Partial Scoring'
    },
    placementArea: {
      settings: true,
      label: 'Placement Area',
    },
    rationale: {
      settings: false,
      label: 'Rationale',
      enabled: true,
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
      enabled: true,
    },
    targetLabel: {
      settings: true,
      label: 'Target label',
    },
    teacherInstructions: {
      settings: false,
      label: 'Teacher Instructions',
      enabled: false,
    },
  }
};