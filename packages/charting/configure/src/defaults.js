/**
 * NOTE: There's no functionality described for graphTitle,
 * rationale, scoringType, studentInstructions, teacherInstructions
 * so there's no implementation (they are only added in model)
 */


const createCategory = (label, value) => ({
  label,
  value,
  initial: true,
  interactive: true,
  editable: true,
  deletable: true
});

export default {
  model: {
    addCategoryEnabled: true,
    categoryDefaultLabel: 'Category',
    chartType: 'lineCross',
    correctAnswer: {},
    data: [],
    domain: {
      label: 'Fruits',
    },
    editCategoryEnabled: true,
    graph: {
      width: 480,
      height: 480
    },
    prompt: 'Here goes item stem!',
    promptEnabled: true,
    rationale: 'Rationale goes here!',
    range: {
      label: 'Amount',
      max: 5.5,
      min: 0,
      labelStep: 1,
    },
    scoringType: 'partial scoring',
    title: 'This is a chart!',
    rationaleEnabled: true,
    teacherInstructionsEnabled: true,
    studentInstructionsEnabled: true
  },
  configuration: {
    prompt: {
      settings: true,
      label: 'Item Stem'
    },
    rationale: {
      settings: true,
      label: 'Rationale'
    },
    scoringType: {
      settings: true,
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
    }
  }
};
