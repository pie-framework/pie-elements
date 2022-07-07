/**
 * NOTE: There's no functionality described for graphTitle,
 * rationale, scoringType, studentInstructions, teacherInstructions
 * so there's no implementation (they are only added in model)
 */
export default {
  // !! configure src defaults models needs to have the same content as controller src defaults
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
};
