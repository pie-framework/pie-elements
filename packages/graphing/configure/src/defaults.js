import { tools } from '@pie-lib/graphing';

const { allTools = [] } = tools;

export default {
  model: {
    // !! configure src defaults models needs to have the same content as controller src defaults
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
    includeAxes: true,
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
    standardGrid: false,
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
      label: 'Customize Grid Setup',
      enabled: true,
      includeAxesEnabled: true,
      standardGridEnabled: true,
      min: {
        label: 'Min Value',
        enabled: true
      },
      max: {
        label: 'Max Value',
        enabled: true
      },
      axisLabel: {
        label: 'Label',
        enabled: true
      },
      step: {
        label: 'Grid Interval',
        enabled: true
      },
      labelStep: {
        label: 'Label Interval',
        enabled: true
      }
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
    graphDimensions: {
      settings: false,
      label: 'Graph Dimensions',
      enabled: true,
      min: 150,
      max: 800,
      step: 20
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
    availableTools: allTools,
    spellCheck: {
      label: 'Spellcheck',
      settings:false,
      enabled:true
    },
    coordinatesOnHover: {
      settings: true,
      label: 'Coordinates on Hover'
    },
    maxImageWidth: {
      teacherInstructions: 300,
      prompt: 300,
      rationale: 300,
    },
    maxImageHeight: {
      teacherInstructions: 300,
      prompt: 300,
      rationale: 300,
    }
  }
};
