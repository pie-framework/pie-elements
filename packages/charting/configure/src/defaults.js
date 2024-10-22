/**
 * NOTE: There's no functionality described for graphTitle,
 * rationale, scoringType, studentInstructions, teacherInstructions
 * so there's no implementation (they are only added in model)
 */

// const createCategory = (label, value) => ({
//   label,
//   value,
//   interactive: true,
//   editable: true
// });

export default {
  model: {
    addCategoryEnabled: true,
    changeAddCategoryEnabled: false,
    changeEditableEnabled: false,
    changeInteractiveEnabled: false,
    chartType: 'lineCross',
    correctAnswer: {},
    data: [],
    domain: {},
    graph: { width: 480, height: 480 },
    prompt: '',
    promptEnabled: true,
    range: { label: '', max: 1, min: 0, labelStep: 1 },
    rationale: '',
    rationaleEnabled: true,
    scoringType: 'all or nothing',
    studentInstructionsEnabled: true,
    studentNewCategoryDefaultLabel: 'New Category',
    teacherInstructions: '',
    teacherInstructionsEnabled: true,
    title: '',
  },
  configuration: {
    baseInputConfiguration: {
      audio: { disabled: false },
      video: { disabled: false },
      image: { disabled: false },
    },
    spellCheck: {
      label: 'Spellcheck',
      settings: false,
      enabled: true,
    },
    chartDimensions: {
      settings: false,
      label: 'Chart Dimensions',
      showInConfigPanel: true,
      width: {
        min: 50,
        max: 700,
        step: 20,
      },
      height: {
        min: 400,
        max: 700,
        step: 20,
      },
    },
    authorNewCategoryDefaults: {
      settings: false,
      label: 'Category',
      interactive: true,
      editable: false,
    },
    availableChartTypes: {
      bar: 'Bar Chart',
      histogram: 'Histogram',
      lineDot: 'Line Chart ●',
      lineCross: 'Line Chart x',
      dotPlot: 'Dot/Line Plot ⬤',
      linePlot: 'Dot/Line Plot X',
    },
    chartTypeLabel: 'ChartType',
    studentNewCategoryDefaultLabel: {
      settings: false,
      label: 'Category',
    },
    prompt: {
      settings: true,
      label: 'Item Stem',
      required: false,
      inputConfiguration: {
        audio: { disabled: false },
        video: { disabled: false },
        image: { disabled: false },
      },
    },
    rationale: {
      settings: true,
      label: 'Rationale',
      required: false,
      inputConfiguration: {
        audio: { disabled: false },
        video: { disabled: false },
        image: { disabled: false },
      },
    },
    scoringType: {
      settings: false,
      label: 'Scoring Type',
    },
    settingsPanelDisabled: false,
    studentInstructions: {
      settings: false,
      label: 'Student Instructions',
    },
    teacherInstructions: {
      settings: true,
      label: 'Teacher Instructions',
      required: false,
      inputConfiguration: {
        audio: { disabled: false },
        video: { disabled: false },
        image: { disabled: false },
      },
    },
    title: {
      settings: false,
      label: 'Chart Title',
    },
    instruction: {
      settings: false,
      label:
        'This item type provides various types of interactive charts. Depending upon how an item is configured,\n' +
        '          students can change the heights of bars (or other similar chart elements) created by the author; relabel bars\n' +
        '          created by the author; and/or add new bars, label them, and set their heights.',
    },
    titlePlaceholder: {
      settings: false,
      label: 'Click here to add a title',
    },
    labelsPlaceholders: {
      left: 'Click here to add a label for this axis',
      right: '',
      top: '',
      bottom: 'Click here to add a label for this axis',
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
    chartingOptions: {
      changeInteractive: {
        settings: false,
        authoringLabel: 'Student can set value',
        settingsLabel: 'Allow non-interactive categories',
      },
      changeEditable: {
        settings: false,
        authoringLabel: 'Student can edit name',
        settingsLabel: 'Allow editable category names',
      },
      addCategory: {
        settings: false,
        authoringLabel: 'Student can add categories',
        settingsLabel: 'Allow changes to whether students can add categories',
      },
      mathMlOptions: {
        mmlOutput: false,
        mmlEditing: false,
      },
    },
  },
};
