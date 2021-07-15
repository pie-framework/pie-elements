export default {
  model: {
    prompt: 'This is the question prompt',
    imageUrl: '',
    imageDimensions: {
      height: 0,
      width: 0
    },
    promptEnabled: true,
    teacherInstructionsEnabled: true,
    studentInstructionsEnabled: true,
    toolbarEditorPosition: 'bottom',
  },
  configuration: {
    backgroundImage: {
      settings: true,
      label: 'Background Image',
      enabled: true
    },
    prompt: {
      settings: true,
      label: 'Prompt'
    },
    teacherInstructions: {
      settings: true,
      label: 'Teacher Instructions',
    }
  }
};
