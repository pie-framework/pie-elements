// TODO: This is lifted from @pie-lib/graphing, however importing this will break a controller build because it has jsx source in that package.
const allTools = [
  'circle',
  'line',
  'label',
  'parabola',
  'point',
  'polygon',
  'ray',
  'segment',
  'sine',
  'vector',
  // 'absolute', // - not available as default
  // 'exponential', // - not available as default
];

/* model defaults */
export default {
  answers: {
    correctAnswer: {
      name: 'Correct Answer',
      marks: [],
    },
  },
  arrows: {
    left: true,
    right: true,
    up: true,
    down: true,
  },
  backgroundMarks: [],
  coordinatesOnHover: false,
  defaultGridConfiguration: 0,
  domain: {
    min: -5,
    max: 5,
    step: 1,
    labelStep: 1,
    axisLabel: 'x',
  },
  graph: { width: 500, height: 500 },
  includeAxes: true,
  labels: {},
  labelsEnabled: true,
  padding: true,
  prompt: '',
  promptEnabled: true,
  range: {
    min: -5,
    max: 5,
    step: 1,
    labelStep: 1,
    axisLabel: 'y',
  },
  rationale: '',
  rationaleEnabled: true,
  standardGrid: false,
  studentInstructionsEnabled: true,
  teacherInstructions: '',
  teacherInstructionsEnabled: true,
  title: '',
  titleEnabled: true,
  toolbarTools: allTools,
};
