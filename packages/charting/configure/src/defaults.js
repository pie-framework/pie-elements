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
    categoryDefaultLabel: 'Category',
    chartType: 'lineCross',
    correctAnswer: {},
    data: [],
    domain: {},
    graph: {
      width: 480,
      height: 480,
    },
    prompt: '',
    promptEnabled: true,
    rationale: '',
    range: {
      label: '',
      max: 1,
      min: 0,
    },
    scoringType: 'all or nothing',
    title: '',
    rationaleEnabled: true,
    teacherInstructionsEnabled: true,
    studentInstructionsEnabled: true,
    changeInteractiveEnabled: true,
    changeEditableEnabled: true,
    changeAddCategoryEnabled: true,
  },
  configuration: {
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
    settingsPanelDisabled: false,
    studentInstructions: {
      settings: false,
      label: 'Student Instructions',
    },
    teacherInstructions: {
      settings: true,
      label: 'Teacher Instructions',
    },
    title: {
      settings: false,
      label: 'Chart Title',
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
    chartingOptions: {
      changeInteractive: {
        settings: true,
        authoringLabel: 'Student can set value',
        settingsLabel: 'Allow non-interactive categories',
      },
      changeEditable: {
        settings: true,
        authoringLabel: 'Student can edit name',
        settingsLabel: 'Allow editable category names',
      },
      addCategory: {
        settings: true,
        authoringLabel: 'Student can add categories',
        settingsLabel: 'Allow student-created categories',
      },
    },
  },
};
