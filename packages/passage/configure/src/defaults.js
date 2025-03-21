// TODO: also update '../../controller/src/defaults.js' and '../../src/print.js' when updating defaults
export default {
  model: {
    authorEnabled: true,
    passages: [
      {
        teacherInstructions: '',
        title: '',
        subtitle: '',
        author: '',
        text: '',
      },
    ],
    subtitleEnabled: true,
    teacherInstructionsEnabled: true,
    textEnabled: true,
    titleEnabled: true,
  },
  configuration: {
    baseInputConfiguration: {
      audio: { disabled: false },
      video: { disabled: false },
      image: { disabled: false },
      h3: { disabled: true },
      blockquote: { disabled: true },
      textAlign: { disabled: true },
      showParagraphs: { disabled: false },
    },
    settingsPanelDisabled: false,
    title: {
      settings: true,
      label: 'Title',
      inputConfiguration: {
        audio: { disabled: true },
        video: { disabled: true },
        image: { disabled: true },
        textAlign: { disabled: false },
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
        textAlign: { disabled: false },
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
        textAlign: { disabled: false },
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
