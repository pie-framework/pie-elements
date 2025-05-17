export default {
  model: {
    dimensions: { height: 0, width: 0 },
    hotspotColor: 'rgba(137, 183, 244, 0.25)',
    hotspotList: ['rgba(137, 183, 244, 0.25)'],
    imageUrl: '',
    multipleCorrect: true,
    outlineColor: 'blue',
    outlineList: ['blue'],
    partialScoring: false,
    prompt: '',
    promptEnabled: true,
    rationaleEnabled: true,
    shapes: { rectangles: [], polygons: [], circles: [] },
    strokeWidth: 5,
    studentInstructionsEnabled: true,
    teacherInstructions: '',
    teacherInstructionsEnabled: true,
    toolbarEditorPosition: 'bottom',
  },
  configuration: {
    baseInputConfiguration: {
      audio: { disabled: false },
      video: { disabled: false },
      image: { disabled: false },
      textAlign: { disabled: true },
      showParagraphs: { disabled: false },
      separateParagraphs: { disabled: true },
    },
    multipleCorrect: {
      settings: true,
      label: 'Multiple Correct Responses',
    },
    partialScoring: {
      settings: false,
      label: 'Allow Partial Scoring',
    },
    rationale: {
      settings: true,
      label: 'Rationale',
      inputConfiguration: {
        audio: { disabled: false },
        video: { disabled: false },
        image: { disabled: false },
      },
      required: false,
    },
    prompt: {
      settings: true,
      label: 'Prompt',
      inputConfiguration: {
        audio: { disabled: false },
        video: { disabled: false },
        image: { disabled: false },
      },
      required: false,
    },
    settingsPanelDisabled: false,
    spellCheck: {
      label: 'Spellcheck',
      settings: false,
      enabled: true,
    },
    teacherInstructions: {
      settings: true,
      label: 'Teacher Instructions',
      inputConfiguration: {
        audio: { disabled: false },
        video: { disabled: false },
        image: { disabled: false },
      },
      required: false,
    },
    preserveAspectRatio: {
      settings: false,
      enabled: true,
      label: 'Preserve aspect ratio',
    },
    minShapes: 2,
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
    mathMlOptions: {
      mmlOutput: false,
      mmlEditing: false,
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
  },
};
