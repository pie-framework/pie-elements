/**
 * NOTE: There's no functionality described for graphTitle,
 * rationale, scoringType, studentInstructions, teacherInstructions
 * so there's no implementation (they are only added in model)
 */
export default {
  // !! configure src defaults models needs to have the same content as controller src defaults
  model: {
    addCategoryEnabled: true,
    categoryDefaultLabel: 'Category',
    chartType: 'lineCross',
    correctAnswer: {},
    data: [],
    domain: {},
    graph: {
      width: 450,
      height: 450
    },
    prompt: '',
    promptEnabled: true,
    rationale: '',
    range: {
      label: '',
      max: 4,
      min: 0,
      labelStep: 1
    },
    scoringType: 'all or nothing',
    title: '',
    rationaleEnabled: true,
    teacherInstructionsEnabled: true,
    studentInstructionsEnabled: true,
  },
  configuration: {
    spellCheck: {
      label: 'Spellcheck',
      settings:false,
      enabled:true
    },
    prompt: {
      settings: true,
      label: 'Item Stem'
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
    },
    title: {
      settings: false,
      label: 'Graph Title'
    },
    maxImageWidth: {
      teacherInstructions: 300,
      prompt: 300,
      rationale: 300,
    },
    maxImageHeight: {
      teacherInstructions: 300,
      prompt: 300,
      rationale: 300,
    }
  }
};
