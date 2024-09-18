export default {
  model: {
    correctResponse: [],
    title: '',
    question: '',
    modelTypeSelected: 'bar',
    maxModelSelected: 1,
    partsPerModel: 5,
    allowedStudentConfig: false,
    showGraphLabels: false,
  },
  configuration: {
    baseInputConfiguration: {
      audio: { disabled: false },
      video: { disabled: false },
      image: { disabled: false },
    },
    title: {
      label: 'Title',
      settings: true,
      enabled: true,
      inputConfiguration: {
        audio: { disabled: false },
        video: { disabled: false },
        image: { disabled: false },
      },
    },
    question: {
      label: 'Question',
      settings: true,
      enabled: true,
      inputConfiguration: {
        audio: { disabled: false },
        video: { disabled: false },
        image: { disabled: false },
      },
    },
    modelOptions: {
      maxOfModel: {
        min: 1,
        max: 9,
        default: 1,
      },
      partsPerModel: {
        min: 1,
        max: 9,
        default: 5,
      },
      modelTypeChoices: [
        { value: 'bar', label: 'Bar' },
        { value: 'pie', label: 'Pie' },
      ],
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
    spellCheck: {
      label: 'Spellcheck',
      settings: false,
      enabled: true,
    },
    settingsPanelDisabled: true,
  },
};