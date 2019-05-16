export default {
  model: {
    disabled: false,
    mode: 'gather',
    prompt: 'Use the dropdowns to complete the sentence',
    shuffle: true,
    markup: '<div><p>The {{0}} jumped {{1}} the {{2}}</p></div>',
    choices: {
      0: [
        {
          label: 'cow ',
          value: '0',
          correct: true
        },
        {
          label: 'dog ',
          value: '1',
          correct: false
        },
        {
          label: 'cat ',
          value: '2',
          correct: false
        }
      ],
      1: [
        {
          label: 'over ',
          value: '0',
          correct: true
        },
        {
          label: 'under ',
          value: '1',
          correct: false
        },
        {
          label: 'across ',
          value: '2',
          correct: false
        }
      ],
      2: [
        {
          label: 'moon ',
          value: '0',
          correct: true
        },
        {
          label: 'sun',
          value: '2',
          correct: false
        },
        {
          label: 'house ',
          value: '3',
          correct: false
        }
      ]
    }
  },
  configuration: {
    prompt: {
      settings: true,
      label: 'Prompt'
    },
    lockChoiceOrder: {
      settings: true,
      label: 'Lock Choice Order'
    }
  }
};