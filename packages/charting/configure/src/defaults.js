/**
 * NOTE: There's no functionality described for arrows, padding, labels, graphTitle,
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
    answers: {},
    backgroundMarks: [],
    graph: {
      width: 480,
      height: 480
    },
    labels: null,
    prompt: 'Here goes item stem!',
    rationale: 'Rationale goes here!',
    scoringType: 'partial scoring',


    chartType: 'lineCross',
    title: 'This is a chart!',
    domain: {
      label: 'Fruits',
      axisLabel: 'X'
    },
    range: {
      label: 'Amount',
      max: 5.5,
      min: 0,
      labelStep: 1,
      axisLabel: 'Y'
    },
    data: [
      { ...createCategory('Apples', 5), interactive: false },
      createCategory('Grapes', 3),
      createCategory('Lemons', 0),
      createCategory('Plums', 2),
      createCategory('Peaches', 1),
      createCategory('Melons', 4)
    ],
    editCategoryEnabled: true,
    addCategoryEnabled: true,
    categoryDefaultLabel: 'Category'
  },
  configuration: {
    labels: {
      settings: false,
      label: 'Labels',
      enabled: true
    },
    prompt: {
      settings: true,
      label: 'Item Stem'
    },
    rationale: {
      settings: true,
      label: 'Rationale',
      enabled: false
    },
    scoringType: {
      settings: true,
      label: 'Scoring Type'
    },
    studentInstructions: {
      settings: false,
      label: 'Student Instructions',
      enabled: true
    },
    teacherInstructions: {
      settings: true,
      label: 'Teacher Instructions',
      enabled: false
    },
    title: {
      settings: false,
      label: 'Graph Title',
      enabled: true
    }
  }
};
