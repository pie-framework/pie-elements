import { ResponseTypes } from './utils';

export default {
  responseType: ResponseTypes.advanced,
  element: 'math-inline',
  feedback: {
    correct: {
      default: 'Correct',
      type: 'none'
    },
    incorrect: {
      default: 'Incorrect',
      type: 'none'
    },
    partial: {
      default: 'Nearly',
      type: 'none'
    }
  },
  note: 'The answer shown above is the primary correct answer specified by the author for this item, but other answers may also be recognized as correct.',
  equationEditor: '3',
  expression: '',
  question: '',
  responses: [],
  customKeys: []
};
