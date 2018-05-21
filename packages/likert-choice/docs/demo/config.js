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
      responseType: '3',
      disabled: false,
      labelType: 'agreement',
      choices: [
        {lang: 'en-US', value: 'disagree', label: 'Disagree'},
        {lang: 'en-US', value: 'unsure', label: 'Unsure'},
        {lang: 'en-US', value: 'agree', label: 'Agree'}
      ],
      graphicsType: 'a'
    }
  ]
}