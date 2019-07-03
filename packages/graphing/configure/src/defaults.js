/**
 * NOTE: There's no functionality described for arrows, padding, labels, graphTitle,
 * rationale, scoringType, studentInstructions, teacherInstructions
 * so there's no implementation (they are only added in model)
 */

export default {
  model: {
    answers: {
      correctAnswer: {
        name: 'Correct Answer',
        marks: [],
      },
    },
    arrows: true,
    backgroundMarks: [],
    domain: {
      min: -10,
      max: 10,
      padding: 0,
      step: 1,
      labelStep: 1,
      axisLabel: 'x'
    },
    graph: {
      width: 480,
      height: 480
    },
    labels: null,
    padding: true,
    prompt: 'Here goes item stem!',
    range: {
      min: -5,
      max: 5,
      padding: 0,
      step: 1,
      labelStep: 1,
      axisLabel: 'y'
    },
    rationale: 'Rationale goes here!',
    scoringType: 'partial scoring',
    title: '',
  },
  configuration: {
    authoring: {
      settings: false,
      label: 'Allow authoring',
      enabled: false
    },
    arrows: {
      settings: false,
      label: 'Include arrows',
    },
    padding: {
      settings: false,
      label: 'Padding',
    },
    labels: {
      settings: false,
      label: 'Labels',
      enabled: true
    },
    prompt: {
      settings: true,
      label: 'Item Stem',
    },
    rationale: {
      settings: true,
      label: 'Rationale',
      enabled: false,
    },
    scoringType: {
      settings: true,
      label: 'Scoring Type',
    },
    studentInstructions: {
      settings: false,
      label: 'Student Instructions',
      enabled: true,
    },
    teacherInstructions: {
      settings: false,
      label: 'Teacher Instructions',
      enabled: false,
    },
    title: {
      settings: false,
      label: 'Graph Title',
      enabled: true
    },
  }
};
