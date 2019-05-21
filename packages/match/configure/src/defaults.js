/** NOTE: teacherInstructions, studentInstructions, rationale & scoringType
 * functionalities are not defined yet - the value for those can belong to
 * model or to configuration
 */

export default {
  model: {
    enableImages: true,
    headers: ['Column 1', 'Column 2', 'Column 3'],
    layout: 3,
    lockChoiceOrder: true,
    partialScoring: false,
    choiceMode: 'radio',
    rows: [
      {
        id: 1,
        title: 'Question Text 1',
        values: [false, false]
      },
    ],
    scoringType: 'auto',
  },
  prompt: 'Prompt goes here',
  configuration: {
    enableImages: {
      settings: true,
      label: 'Enable Images',
    },
    feedback: {
      settings: true
    },
    headers: {
      settings: true
    },
    layout: {
      settings: true,
      label: 'Layout',
    },
    lockChoiceOrder: {
      settings: true,
      label: 'Lock Choice Order',
    },
    partialScoring: {
      settings: true,
      label: 'Allow partial scoring',
    },
    choiceMode: {
      settings: true,
      label: 'Response Type',
    },
    prompt: {
      settings: true,
      label: 'Prompt'
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
      settings: false,
      label: 'Teacher Instructions',
      enabled: true,
    },
  }
};
