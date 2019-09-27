export default {
  prompt: 'This is the question prompt',
  imageUrl: '',
  imageDimensions: {
    height: 0,
    width: 0
  },
  rationaleEnabled: false,
  promptEnabled: false,
  teacherInstructionsEnabled: false,
  studentInstructionsEnabled: false,
  configuration: {
    backgroundImage: {
      settings: true,
      label: 'Background Image',
      enabled: true
    },
    rationale: {
      settings: true,
      label: 'Rationale'
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
