export default {
  model: {
    disabled: false,
    mode: 'gather',
    prompt: 'Use the inputs to complete the sentence',
    shuffle: true,
    markup: '<p>The {{0}} jumped {{1}} the {{2}}</p>',
    toolbarEditorPosition: 'bottom',
    displayType: 'block',
    choices: {
      0: [
        {
          label: 'cow',
          value: '0'
        },
        {
          label: 'cattle',
          value: '1'
        },
        {
          label: 'calf',
          value: '2',
          correct: false
        }
      ],
      1: [
        {
          label: 'over',
          value: '0'
        },
        {
          label: 'past',
          value: '1'
        },
        {
          label: 'beyond',
          value: '2'
        }
      ],
      2: [
        {
          label: 'moon',
          value: '0'
        },
        {
          label: 'satellite',
          value: '2'
        },
        {
          label: 'house ',
          value: '3'
        }
      ]
    },
    maxLengthPerChoiceEnabled: true,
    rationaleEnabled: true,
    promptEnabled: true,
    teacherInstructionsEnabled: true,
    studentInstructionsEnabled: true
  },
  configuration: {
    prompt: {
      settings: true,
      label: 'Prompt'
    },
    partialScoring: {
      settings: false,
      label: 'Allow Partial Scoring'
    },
    rationale: {
      settings: true,
      label: 'Rationale'
    },
    teacherInstructions: {
      settings: true,
      label: 'Teacher Instructions'
    },
    maxLengthPerChoice: {
      settings: true,
      label: 'Maximum Length Per Choice'
    }
  }
};
