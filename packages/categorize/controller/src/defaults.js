import { multiplePlacements } from './utils';

export default {
  choices: [],
  choicesPosition: 'below',
  choicesLabel: '',
  lockChoiceOrder: true,
  removeTilesAfterPlacing: false,
  allowMultiplePlacementsEnabled: multiplePlacements.enabled,
  categoriesPerRow: 2,
  categories: [],
  alternates: [],
  correctResponse: [],
  rowLabels: [''],
  partialScoring: true,
  feedbackEnabled: true,
  rationaleEnabled: true,
  promptEnabled: true,
  teacherInstructionsEnabled: true,
  studentInstructionsEnabled: true,
  toolbarEditorPosition: 'bottom',
  note: 'The answer shown above is the most common correct answer for this item. One or more additional correct answers are also defined, and will also be recognized as correct.',
};
