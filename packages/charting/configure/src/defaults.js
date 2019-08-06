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
    correctAnswer: {
      name: 'Correct Response',
      data: [
        { ...createCategory('Apples', 5), interactive: false },
        createCategory('Grapes', 3),
        createCategory('Lemons', 0)
      ],
      editCategoryEnabled: true,
      addCategoryEnabled: true
    },
    data: [
      { ...createCategory('Apples', 5), interactive: false },
      createCategory('Grapes', 3),
      createCategory('Lemons', 0),
      // createCategory('Plums', 2),
      // createCategory('Peaches', 1),
      // createCategory('Melons', 4)
    ],
    domain: {
      label: 'Fruits',
      axisLabel: 'X'
    },
    editCategoryEnabled: true,
    graph: {
      width: 480,
      height: 480
    },
    prompt: 'Here goes item stem!',
    rationale: 'Rationale goes here!',
    range: {
      label: 'Amount',
      max: 5.5,
      min: 0,
      labelStep: 1,
      axisLabel: 'Y'
    },
    scoringType: 'partial scoring',
    title: 'This is a chart!',
  },
  configuration: {
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
