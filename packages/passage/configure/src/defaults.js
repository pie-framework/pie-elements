export default {
  model: {
    teacherInstructionsEnabled: false,
    titleEnabled: true,
    subtitleEnabled: true,
    textEnabled: true,
    authorEnabled: true,
    passages: [
      {
        teacherInstructions: '',
        title: '',
        subtitle: '',
        author: '',
        text: '',
      }
    ],
  },
  configuration: {
    baseInputConfiguration: {
      audio: { disabled: false },
      video: { disabled: false },
      image: { disabled: false },
    },
    settingsPanelDisabled: false,
    title: {
      settings: true,
      label: 'Title',
      inputConfiguration: {
        audio: { disabled: true },
        video: { disabled: true },
        image: { disabled: true },
      },
      required: false,
    },
    subtitle: {
      settings: true,
      label: 'Subtitle',
      inputConfiguration: {
        audio: { disabled: true },
        video: { disabled: true },
        image: { disabled: true },
      },
      required: false
    },
    author: {
      settings: true,
      label: 'Author',
      inputConfiguration: {
        audio: { disabled: true },
        video: { disabled: true },
        image: { disabled: true },
      },
      required: false
    },
    text: {
      settings: true,
      label: 'Text',
      inputConfiguration: {
        audio: { disabled: false },
        video: { disabled: false },
        image: { disabled: false },
      },
      required: false
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
    maxImageWidth: {
      teacherInstructions: 300,
      text:300,
    },
    maxImageHeight: {
      teacherInstructions: 300,
      text: 300,
    },
    mathMlOptions: {
      mmlOutput: false,
      mmlEditing: false,
    },
    language: {
      settings: true,
      label: 'Specify Language',
      enabled: true,
    },
    languageChoices: {
      label: 'Language Choices',
      options: [],
    },
  },
};
