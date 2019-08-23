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
  equationEditor: '3',
  expression: '',
  question: '',
  responses: [],
  customKeys: []
};
