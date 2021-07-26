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
  'vector'];

/* model defaults */
export default {
  answers: {},
  arrows: true,
  backgroundMarks: [],
  domain: {
    min: -5,
    max: 5,
    step: 1,
    labelStep: 1,
    axisLabel: 'x'
  },
  graph: {
    width: 500,
    height: 500
  },
  labels: {},
  coordinatesOnHover: false,
  padding: true,
  prompt: '',
  range: {
    min: -5,
    max: 5,
    step: 1,
    labelStep: 1,
    axisLabel: 'y'
  },
  rationale: '',
  title: '',
  toolbarTools: allTools,
  promptEnabled: true,
  rationaleEnabled: true,
  teacherInstructionsEnabled: true,
  studentInstructionsEnabled: true
};
