/**
 * NOTE: There's no functionality described for arrows, padding, labels, graphTitle,
 * rationale, scoringType, studentInstructions, teacherInstructions
 * so there's no implementation (they are only added in model)
 */

export default {
  model: {
    scoringType: 'auto',
    arrows: true,
    padding: true,
    promptEnabled: false,
    rationaleEnabled: false,
    teacherInstructionsEnabled: false,
    studentInstructionsEnabled: false
  },
  configuration: {
    arrows: {
      settings: false,
      label: 'Include arrows'
    },
    padding: {
      settings: false,
      label: 'Padding'
    },
    graphTitle: {
      settings: false,
      label: 'Graph Title',
      enabled: true
    },
    labels: {
      settings: false,
      label: 'Labels',
      enabled: true
    },
    prompt: {
      settings: true,
      label: 'Prompt'
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
      settings: false,
      label: 'Teacher Instructions'
    }
  }
};
