export default {
  model: {
    disabled: false,
    mode: 'gather',
    prompt: 'Use the inputs to complete the sentence',
    shuffle: true,
    markup: '<div><p>The {{0}} jumped {{1}} the {{2}}</p></div>',
    choices: [
      {
        value: 'cow',
        id: '0'
      },
      {
        value: 'over',
        id: '1'
      },
      {
        value: 'moon',
        id: '2'
      },
      {
        value: 'cattle',
        id: '3'
      },
      {
        value: 'calf',
        id: '4'
      },
      {
        value: 'past',
        id: '5'
      },
      {
        value: 'beyond',
        id: '6'
      },
      {
        value: 'satellite',
        id: '7'
      }
    ],
    choicesPosition: 'below',
    correctResponse: {
      0: '0',
      1: '1',
      2: '2'
    },
    duplicates: true
  },
  configuration: {
    prompt: {
      settings: true,
      label: 'Prompt'
    },
    duplicates: {
      settings: true,
      label: 'Duplicates'
    },
    lockChoiceOrder: {
      settings: true,
      label: 'Lock Choice Order'
    },
    partialScoring: {
      settings: true,
      label: 'Allow Partial Scoring'
    },
    rationale: {
      settings: true,
      label: 'Rationale',
      enabled: false,
    },
    teacherInstructions: {
      settings: true,
      label: 'Teacher Instructions',
      enabled: true
    }
  }
};
