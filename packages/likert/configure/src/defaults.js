/** NOTE: teacherInstructions, studentInstructions, rationale & scoringType
 * functionalities are not defined yet - the value for those can belong to
 * model or to configure
 */
export default {
  model: {
    choices: [],
    likertOrientation: 'horizontal',
    likertScale: 'likert3',
    likertType: 'agreement',
    prompt: '',
    promptEnabled: true,
    teacherInstructions: '',
    teacherInstructionsEnabled: true,
  },
  configuration: {
    baseInputConfiguration: {
      audio: { disabled: false },
      video: { disabled: false },
      image: { disabled: false },
      textAlign: { disabled: true },
      showParagraphs: { disabled: false },
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
    likertChoice: {
      label: 'Choice',
      inputConfiguration: {
        audio: { disabled: false },
        video: { disabled: false },
        image: { disabled: false },
      },
    },
  },
};
