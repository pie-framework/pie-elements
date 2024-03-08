/*
 * This file contains the default configuration for the Graphing Solution Set Item Type.
 * Model is similar to the one used in graphing item type except for the gssLineData object which handles
 * the configuration for the lines and the solution set.
 *
 * Same model is used in controller default.js
 * */
export default {
  model: {
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
  },
  configuration: {
    authoring: {
      settings: false,
      label: 'Customize Grid Setup',
      enabled: true,
      includeAxesEnabled: false,
      standardGridEnabled: true,
      min: {
        label: 'Min Value',
        enabled: true,
      },
      max: {
        label: 'Max Value',
        enabled: true,
      },
      axisLabel: {
        label: 'Label',
        enabled: true,
      },
      step: {
        label: 'Grid Interval',
        enabled: true,
      },
      labelStep: {
        label: 'Label Interval',
        enabled: true,
      },
    },
    arrows: {
      settings: true,
      label: 'Include Arrows',
      left: {
        label: 'left',
      },
      right: {
        label: 'right',
      },
      up: {
        label: 'up',
      },
      down: {
        label: 'down',
      },
    },
    gridConfigurations: [
      {
        label: '4-quadrant coordinate grid, -10 to 10',
        arrows: {
          left: true,
          right: true,
          up: true,
          down: true,
        },
        domain: {
          min: -10,
          max: 10,
          step: 1,
          padding: 0,
          labelStep: 1,
          axisLabel: '<i>x</i>',
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
          left: '',
        },
        padding: true,
        range: {
          min: -10,
          max: 10,
          step: 1,
          padding: 0,
          labelStep: 1,
          axisLabel: '<i>y</i>',
        },
        standardGrid: true,
        title: '',
      },
      {
        label: '0 to 10 on both axes',
        arrows: {
          left: false,
          right: true,
          up: true,
          down: false,
        },
        domain: {
          min: 0,
          max: 10,
          step: 1,
          padding: 0,
          labelStep: 1,
          axisLabel: '<i>x</i>',
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
          left: '',
        },
        padding: true,
        range: {
          min: 0,
          max: 10,
          step: 1,
          padding: 0,
          labelStep: 1,
          axisLabel: '<i>y</i>',
        },
        standardGrid: true,
        title: '',
      },
      {
        label: '0 to 20 on both axes',
        arrows: {
          left: false,
          right: true,
          up: true,
          down: false,
        },
        domain: {
          min: 0,
          max: 20,
          step: 1,
          padding: 0,
          labelStep: 1,
          axisLabel: '<i>x</i>',
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
          left: '',
        },
        padding: true,
        range: {
          min: 0,
          max: 20,
          step: 1,
          padding: 0,
          labelStep: 1,
          axisLabel: '<i>y</i>',
        },
        standardGrid: true,
        title: '',
      },
      {
        label: 'Sample Data Graph',
        arrows: {
          left: false,
          right: true,
          up: true,
          down: false,
        },
        domain: {
          min: 0,
          max: 30,
          step: 1,
          padding: 0,
          labelStep: 2,
          axisLabel: '<i>t</i>',
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
          left: 'Distance (meters)',
        },
        padding: true,
        range: {
          min: 0,
          max: 80,
          step: 5,
          padding: 0,
          labelStep: 10,
          axisLabel: '<i>d</i>',
        },
        standardGrid: false,
        title: 'Distance as a function of time',
      },
    ],
    graphDimensions: {
      settings: false,
      label: 'Graph Dimensions',
      enabled: true,
      min: 150,
      max: 800,
      step: 20,
    },
    padding: {
      settings: false,
      label: 'Padding',
    },
    labels: {
      settings: true,
      label: 'Graph Labels',
      enabled: true,
      top: 'Click here to add a top label',
      right: 'Click here to add a right label',
      bottom: 'Click here to add a bottom label',
      left: 'Click here to add a left label',
    },
    prompt: {
      settings: true,
      label: 'Item Stem',
    },
    rationale: {
      settings: true,
      label: 'Rationale',
    },
    scoringType: {
      settings: false,
      label: 'Scoring Type',
    },
    studentInstructions: {
      settings: false,
      label: 'Student Instructions',
    },
    teacherInstructions: {
      settings: true,
      label: 'Teacher Instructions',
    },
    title: {
      settings: true,
      label: 'Graph Title',
      enabled: true,
      placeholder: 'Click here to add a title for this graph',
    },
    instruction: {
      settings: false,
      label:
        'Graphing Solution Set items involve plotting one or two lines on a graph and then selecting the correct area that represents the solution set. To create one, first configure the grid, then select if one or two lines will be offered and if the lines should be solid or dashed. After defining the line(s), define the solution set by clicking the area that represents the solution set.',
    },
    settingsPanelDisabled: false,
    spellCheck: {
      label: 'Spellcheck',
      settings: false,
      enabled: true,
    },
    coordinatesOnHover: {
      settings: true,
      label: 'Coordinates on Hover',
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
      label: 'Add Rubric',
    },
    language: {
      settings: false,
      label: 'Specify Language',
      enabled: false,
    },
    languageChoices: {
      label: 'Language Choices',
      options: [],
    },
    mathMlOptions: {
      mmlOutput: false,
      mmlEditing: false,
    },
  },
};
