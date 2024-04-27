/*
 * This file contains the default configuration for the Graphing Solution Set Item Type.
 * Model is similar to the one used in graphing item type except for the gssLineData object which handles
 * the configuration for the lines and the solution set.
 *
 * Same model is used in configure/src default.js
 * */
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
  marks: [],
  defaultGridConfiguration: 0,
  domain: {
    min: -5,
    max: 5,
    step: 1,
    labelStep: 1,
    axisLabel: 'x',
  },
  graph: {
    width: 500,
    height: 500,
  },
  gssLineData: {
    numberOfLines: 1,
    selectedTool: 'lineA',
    sections: [],
    lineA: {
      lineType: 'Solid',
    },
  },
  includeAxes: true,
  labels: {},
  labelsEnabled: true,
  padding: true,
  prompt: '',
  range: {
    min: -5,
    max: 5,
    step: 1,
    labelStep: 1,
    axisLabel: 'y',
  },
  rationale: '',
  standardGrid: false,
  title: '',
  coordinatesOnHover: false,
  promptEnabled: true,
  rationaleEnabled: true,
  teacherInstructionsEnabled: true,
  studentInstructionsEnabled: true,
};
