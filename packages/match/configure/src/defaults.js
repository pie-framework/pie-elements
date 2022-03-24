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
    prompt: 'Prompt goes here',
    toolbarEditorPosition: 'bottom',
    rows: [
      {
        id: 1,
        title: 'Question Text 1',
        values: [false, false]
      }
    ],
    scoringType: 'auto',
    feedbackEnabled: true,
    promptEnabled: true,
    rationaleEnabled: true,
    teacherInstructionsEnabled: true,
    studentInstructionsEnabled: true
  },
  configuration: {
    enableImages: {
      settings: true,
      label: 'Enable Images'
    },
    feedback: {
      settings: true,
      label: 'Feedback',
      enabled: true
    },
    headers: {
      settings: true
    },
    layout: {
      settings: true,
      label: 'Layout'
    },
    lockChoiceOrder: {
      settings: false,
      label: 'Lock Choice Order'
    },
    partialScoring: {
      settings: false,
      label: 'Allow Partial Scoring'
    },
    choiceMode: {
      settings: true,
      label: 'Response Type'
    },
    prompt: {
      settings: true,
      label: 'Prompt'
    },
    rationale: {
      settings: true,
      label: 'Rationale'
    },
    spellCheck: {
      label: "Spellcheck",
      settings:false,
      enabled:true
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
