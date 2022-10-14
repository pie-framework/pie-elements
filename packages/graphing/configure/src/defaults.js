import { tools } from '@pie-lib/graphing';

const { allTools = [] } = tools;

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
      axisLabel: 'y'
    },
    rationale: '',
    standardGrid: false,
    title: '',
    titleEnabled: true,
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
    gridConfigurations: [{
        label: '4-quadrant coordinate grid, -10 to 10',
        arrows: {
          left: true,
          right: true,
          up: true,
          down: true
        },
        domain: {
          min: -10,
          max: 10,
          step: 1,
          padding: 0,
          labelStep: 1,
          axisLabel: '<i>x</i>'
        },
        graph: {
          width: 480,
          height: 480,
        },
        includeAxes: true,
        labels: {
          top: '',
          right: '',
          bottom: '',
          left: ''
        },
        padding: true,
        range: {
          min: -10,
          max: 10,
          step: 1,
          padding: 0,
          labelStep: 1,
          axisLabel: '<i>y</i>'
        },
        standardGrid: true,
        title: ''
      }, {
        label: '0 to 10 on both axes',
        arrows: {
          left: false,
          right: true,
          up: true,
          down: false
        },
        domain: {
          min: 0,
          max: 10,
          step: 1,
          padding: 0,
          labelStep: 1,
          axisLabel: '<i>x</i>'
        },
        graph: {
          width: 480,
          height: 480,
        },
        includeAxes: true,
        labels: {
          top: '',
          right: '',
          bottom: '',
          left: ''
        },
        padding: true,
        range: {
          min: 0,
          max: 10,
          step: 1,
          padding: 0,
          labelStep: 1,
          axisLabel: '<i>y</i>'
        },
        standardGrid: true,
        title: ''
      }, {
        label: '0 to 20 on both axes',
        arrows: {
          left: false,
          right: true,
          up: true,
          down: false
        },
        domain: {
          min: 0,
          max: 20,
          step: 1,
          padding: 0,
          labelStep: 1,
          axisLabel: '<i>x</i>'
        },
        graph: {
          width: 480,
          height: 480,
        },
        includeAxes: true,
        labels: {
          top: '',
          right: '',
          bottom: '',
          left: ''
        },
        padding: true,
        range: {
          min: 0,
          max: 20,
          step: 1,
          padding: 0,
          labelStep: 1,
          axisLabel: '<i>y</i>'
        },
        standardGrid: true,
        title: ''
      }, {
        label: 'Sample Data Graph',
        arrows: {
          left: false,
          right: true,
          up: true,
          down: false
        },
        domain: {
          min: 0,
          max: 30,
          step: 1,
          padding: 0,
          labelStep: 2,
          axisLabel: '<i>t</i>'
        },
        graph: {
          width: 480,
          height: 480,
        },
        includeAxes: true,
        labels: {
          top: '',
          right: '',
          bottom: 'Time (seconds)',
          left: 'Distance (meters)'
        },
        padding: true,
        range: {
          min: 0,
          max: 80,
          step: 5,
          padding: 0,
          labelStep: 10,
          axisLabel: '<i>d</i>'
        },
        standardGrid: false,
        title: 'Distance as a function of time'
      }, {
        label: 'No Visible Axes',
        arrows: {
          left: false,
          right: false,
          up: false,
          down: false
        },
        domain: {
          min: 1,
          max: 21,
          step: 1,
          padding: 0,
          labelStep: 0,
          axisLabel: ''
        },
        graph: {
          width: 480,
          height: 480,
        },
        includeAxes: false,
        labels: {
          top: '',
          right: '',
          bottom: '',
          left: ''
        },
        padding: true,
        range: {
          min: 1,
          max: 21,
          step: 1,
          padding: 0,
          labelStep: 0,
          axisLabel: ''
        },
        standardGrid: false,
        title: ''
    }],
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
      settings: true,
      label: 'Graph Labels',
      enabled: true,
      top: 'Click here to add a top label',
      right: 'Click here to add a right label',
      bottom: 'Click here to add a bottom label',
      left: 'Click here to add a left label'
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
      settings: true,
      label: 'Graph Title',
      enabled: true,
      placeholder: 'Click here to add a title for this graph'
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
    },
    withRubric: {
      settings: false,
      label: 'Add Rubric'
    }
  }
};
