import { tools } from '@pie-lib/graphing';

const { allTools = [] } = tools;

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
