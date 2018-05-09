module.exports = {
  elements: {
    'function-entry': '../..'
  },
  models: [
    {
      id: '1',
      element: 'function-entry',
      weight: 1,
      showFormattingHelp: true,
      correctResponse: {
        equation: '3x+2'
      },
      /**
       * TODO: import {getFeedback} from '@pie-lib/feedback'
       * const s :string = getFeedback(correctness, feedback);
       */
      feedback: {
        correct: {
          type: 'default',
          default: 'Correct'
        },
        incorrect: {
          type: 'default',
          default: 'Incorrect'
        }
      }
    }
  ]
};
