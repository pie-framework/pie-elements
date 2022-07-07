import { ResponseTypes } from './utils';

export default {
  // !! configure src defaults models needs to have the same content as controller src defaults
  partialScoring: true,
  responseType: ResponseTypes.advanced,
  element: 'math-inline',
  feedback: {
    correct: {
      default: 'Correct',
      type: 'none',
    },
    incorrect: {
      default: 'Incorrect',
      type: 'none',
    },
    partial: {
      default: 'Nearly',
      type: 'none',
    },
  },
  equationEditor: '8',
  expression: '',
  rationale: '',
  note:
    'The answer shown above is the primary correct answer specified by the author for this item, but other answers may also be recognized as correct.',
  prompt: '',
  responses: [],
  customKeys: [],
  scoringType: 'auto',
  toolbarEditorPosition: 'bottom',
  validationDefault: 'literal',
  ignoreOrderDefault: false,
  allowTrailingZerosDefault: false,
  feedbackEnabled: true,
  promptEnabled: true,
  rationaleEnabled: true,
  teacherInstructionsEnabled: true,
  studentInstructionsEnabled: true,
};
