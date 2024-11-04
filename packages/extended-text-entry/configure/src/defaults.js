export default {
  model: {
    annotationsEnabled: false,
    dimensions: { height: 100, width: 500 },
    equationEditor: 'Grade 8 - HS',
    feedbackEnabled: false,
    mathInput: false,
    playerSpellCheckDisabled: true,
    predefinedAnnotations: [
      { label: 'good', text: 'good', type: 'positive' },
      { label: '★', text: '★', type: 'positive' },
      { label: ':-)', text: ':-)', type: 'positive' },
      { label: 'creative', text: 'creative', type: 'positive' },
      { label: 'run-on', text: 'run-on', type: 'negative' },
      { label: 'frag', text: 'fragment', type: 'negative' },
      { label: 'tran', text: 'transition', type: 'negative' },
      { label: 'supp', text: 'support needed', type: 'negative' },
      { label: 'punc', text: 'punctuation', type: 'negative' },
      { label: 'agr', text: 'agreement wrong', type: 'negative' },
      { label: 'unclear', text: 'unclear', type: 'negative' },
      { label: 'cut', text: 'cut', type: 'negative' },
      { label: 'sp', text: 'spelling', type: 'negative' },
      { label: 'cap', text: 'capitalization', type: 'negative' },
      { label: 'inf', text: 'informal', type: 'negative' },
      { label: 'awk', text: 'awkward', type: 'negative' },
    ],
    prompt: '',
    promptEnabled: true,
    rationale: '',
    rationaleEnabled: true,
    spanishInput: false,
    specialInput: false,
    spellCheckEnabled: true,
    studentInstructionsEnabled: true,
    teacherInstructions: '',
    teacherInstructionsEnabled: true,
    toolbarEditorPosition: 'bottom',
  },
  configuration: {
    annotations: {
      settings: false,
      label: 'Annotations',
    },
    baseInputConfiguration: {
      audio: { disabled: false },
      video: { disabled: false },
      image: { disabled: false },
      h3: { disabled: true },
      blockquote: { disabled: true },
      table: { disabled: true }
    },
    dimensions: {
      settings: true,
      label: 'Text-Entry Display Size',
    },
    spellCheck: {
      label: 'Spellcheck',
      settings: false,
      enabled: true,
    },
    playerSpellCheck: {
      label: 'Disable Student Spellcheck',
      settings: true,
      enabled: true,
    },
    equationEditor: {
      settings: false,
      label: 'Equation Editor',
      enabled: true,
    },
    feedback: {
      settings: true,
      label: 'Feedback',
    },
    mathInput: {
      settings: true,
      label: 'Student response can include math notation',
      enabled: false,
    },
    settingsPanelDisabled: false,
    spanishInput: {
      settings: true,
      label: 'Students can insert Spanish',
      enabled: false,
    },
    specialInput: {
      settings: true,
      label: 'Students can insert Special Characters',
      enabled: false,
    },
    multiple: {
      settings: false,
      label: 'Multiple Parts',
      enabled: false,
    },
    studentInstructions: {
      settings: false,
      label: 'Student Instructions',
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
      prompt: 300,
    },
    maxImageHeight: {
      teacherInstructions: 300,
      prompt: 300,
    },
    withRubric: {
      settings: false,
      label: 'Add Rubric',
    },
    mathMlOptions: {
      mmlOutput: false,
      mmlEditing: false,
    },
  },
};
