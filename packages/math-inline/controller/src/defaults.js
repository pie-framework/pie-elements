import { ResponseTypes } from './utils';

export default {
  allowTrailingZerosDefault: false,
  customKeys: [],
  equationEditor: 8,
  expression: '',
  feedback: {
    correct: { default: 'Correct', type: 'none' },
    incorrect: { default: 'Incorrect', type: 'none' },
    partial: { default: 'Nearly', type: 'none' },
  },
  feedbackEnabled: false,
  ignoreOrderDefault: false,
  partialScoring: true,
  prompt: '',
  promptEnabled: true,
  rationale: '',
  rationaleEnabled: true,
  responseType: ResponseTypes.advanced,
  responses: [],
  scoringType: 'auto',
  studentInstructionsEnabled: true,
  teacherInstructions: '',
  teacherInstructionsEnabled: true,
  toolbarEditorPosition: 'bottom',
  validationDefault: 'literal',
};
