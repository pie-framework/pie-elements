import { ResponseTypes } from './utils';

export default {
  responseType: ResponseTypes.advanced,
  expression: 'y = ',
  question: 'What is the equation for a slope?',
  equationEditor: 'everything',
  defaultResponse: {
    id: 0,
    validation: 'symbolic',
    answer: 'mx + b',
    alternates: {},
    allowSpaces: true,
    allowDecimals: true
  },
  responses: [{
    id: 'answerBlock1',
    validation: 'symbolic',
    answer: 'mx + b',
    alternates: {},
    allowSpaces: true,
    allowDecimals: true
  }],
};
