/**
 * NOTE: There's no functionality described for arrows, padding, labels, graphTitle,
 * rationale, scoringType, studentInstructions, teacherInstructions
 * so there's no implementation (they are only added in model)
 */

export default {
  scoringType: 'auto',
  arrows: true,
  padding: true,

  configure: {
    arrows: {
      settings: false,
      label: 'Include arrows',
    },
    padding: {
      settings: false,
      label: 'Padding',
    },
    graphTitle: {
      settings: false,
      label: 'Graph Title',
      enabled: true
    },
    labels: {
      settings: false,
      label: 'Labels',
      enabled: true
    },
    rationale: {
      settings: false,
      label: 'Rationale',
      enabled: true,
    },
    scoringType: {
      settings: false,
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
  },
};
