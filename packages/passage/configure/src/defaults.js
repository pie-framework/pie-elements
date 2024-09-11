export default {
  model: {
    teacherInstructionsEnabled: true,
    titleEnabled: true,
    subtitleEnabled: true,
    authorEnabled: true,
    textEnabled: true,
    passages: [
      {
        teacherInstructions: '',
        title: '',
        subtitle: '',
        author: '',
        text: '',
      },
    ],
  },
  configuration: {
    baseInputConfiguration: {
      audio: { disabled: false },
      video: { disabled: false },
      image: { disabled: false },
      h3: { disabled: true },
      blockquote: { disabled: true },
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
      required: true,
    },
    subtitle: {
      settings: true,
      label: 'Subtitle',
      inputConfiguration: {
        audio: { disabled: true },
        video: { disabled: true },
        image: { disabled: true },
      },
      required: false,
    },
    author: {
      settings: true,
      label: 'Author',
      inputConfiguration: {
        audio: { disabled: true },
        video: { disabled: true },
        image: { disabled: true },
      },
      required: false,
    },
    text: {
      settings: true,
      label: 'Text',
      inputConfiguration: {
        audio: { disabled: false },
        video: { disabled: false },
        image: { disabled: false },
        h3: { disabled: false },
        blockquote: { disabled: false },
      },
      required: true,
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
      text: 300,
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
