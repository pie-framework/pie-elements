import {tools} from '@pie-lib/graphing';

const {allTools = []} = tools;
/**
 * NOTE: There's no functionality described for padding
 * so there's no implementation (they are only added in model)
 */

export default {
  model: {
    answers: {},
    arrows: {
      left: true,
      right: true,
      up: true,
      down: true
    },
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
    coordinatesOnHover: false,
    promptEnabled: true,
    rationaleEnabled: true,
    teacherInstructionsEnabled: true,
    studentInstructionsEnabled: true,
  },
  configuration: {
    authoring: {
      settings: false,
      label: 'Allow authoring',
      enabled: false
    },
    arrows: {
      settings: true,
      label: 'Include Arrows',
      left: {
        label: 'left'
      },
      right: {
        label: 'right'
      },
      up: {
        label: 'up'
      },
      down: {
        label: 'down'
      }
    },
    padding: {
      settings: false,
      label: 'Padding'
    },
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
      label: 'Rationale'
    },
    scoringType: {
      settings: false,
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
      label: 'Graph Title',
      enabled: true
    },
    spellCheck: {
      label: "Spellcheck",
      settings:true,
      enabled:true
    },
    coordinatesOnHover: {
      settings: true,
      label: 'Coordinates on Hover'
    }
  }
};
