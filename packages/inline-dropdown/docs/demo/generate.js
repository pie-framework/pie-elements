exports.model = (id, element) => ({
  id,
  element,
  disabled: false,
  mode: 'gather',
  prompt: 'Use the dropdowns to complete the sentence',
  promptEnabled: true,
  toolbarEditorPosition: 'bottom',
  shuffle: true,
  markup: '<div><p>The {{0}} jumped {{1}} the {{2}}</p></div>',
  choices: {
    '0': [
      {
        label: 'cow ',
        value: '0',
        correct: true,
        rationale: 'rationale cow'
      },
      {
        label: 'dog ',
        value: '1',
        correct: false,
        rationale: 'rationale dog'
      },
      {
        label: 'cat ',
        value: '2',
        correct: false,
        rationale: 'rationale car'
      }
    ],
    '1': [
      {
        label: 'over ',
        value: '0',
        correct: true,
        rationale: 'rationale over'
      },
      {
        label: 'under ',
        value: '1',
        correct: false,
        rationale: 'rationale under'
      },
      {
        label: 'across ',
        value: '2',
        correct: false,
        rationale: 'rationale across'
      }
    ],
    '2': [
      {
        label: 'moon ',
        value: '0',
        correct: true,
        rationale: 'rationale moon'
      },
      {
        label: 'sun',
        value: '2',
        correct: false,
        rationale: 'rationale sun'
      },
      {
        label: 'house ',
        value: '3',
        correct: false,
        rationale: 'rationale house'
      }
    ]
  },
  alternateResponse: {
    '2': ['2']
  },
  choiceRationaleEnabled: false
});
