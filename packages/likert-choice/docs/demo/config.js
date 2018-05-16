module.exports = {
  elements: {
    'likert-choice': '../..'
  },
  models: [
    {
      id: '1',
      element: 'likert-choice',
      prompt: 'Do you Like northern European countries ?',
      choiceMode: 'radio',
      keyMode: 'numbers',
      activeLang: 'en-US',
      defaultLang: 'en-US',
      disabled: false,
      choices: [
        {
          correct: true,
          value: 'disagree',
          label: [
            {lang: 'en-US', label: 'Disagree', value: 'disagree'},
            {lang: 'es-ES', label: 'Discrepar', value: 'discrepar'}
          ],
        },
        {
          correct: true,
          value: 'neutral',
          label: [
            {lang: 'en-US', label: 'Neutral', value: 'neutral'},
            {lang: 'es-ES', label: 'Neutral', value: 'neutral'}
          ],
        },
        {
          value: 'agree',
          label: [
            {lang: 'en-US', label: 'Agree', value: 'agree'},
            {lang: 'es-ES', label: 'De Acuerdo', value: 'deacuerdo'}
          ],
        }
      ]
    }
  ]
}