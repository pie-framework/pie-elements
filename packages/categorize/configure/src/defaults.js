import { multiplePlacements } from './utils';

export default {
  model: {
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
  },
  configuration: {
    spellCheck: {
      label: 'Spellcheck',
      settings:false,
      enabled:true
    },
    feedback: {
      settings: true,
      label: 'Feedback',
      enabled: true
    },
    lockChoiceOrder: {
      settings: true,
      label: 'Lock Choice Order',
    },
    allowMultiplePlacements: {
      settings: true,
      label: 'Allow Multiple Placements'
    },
    categoriesPerRow: {
      settings: true,
      label: 'Categories per row'
    },
    partialScoring: {
      settings: false,
      label: 'Allow Partial Scoring',
    },
    prompt: {
      settings: true,
      label: 'Prompt'
    },
    rationale: {
      settings: true,
      label: 'Rationale'
    },
    scoringType: {
      settings: false,
      label: 'Scoring Type',
    },
    studentInstructions: {
      settings: false,
      label: 'Student Instructions'
    },
    teacherInstructions: {
      settings: true,
      label: 'Teacher Instructions'
    },
    toolbarEditorPosition:{
      settings: false,
      label: 'Toolbar Editor Position'
    },
    maxImageWidth: {
      teacherInstructions: 300,
      prompt: 300,
      rationale: 300,
      rowLabel: 200,
      categoryLabel: 260,
      choices: 240
    },
    maxImageHeight: {
      teacherInstructions: 300,
      prompt: 300,
      rationale: 300,
      rowLabel: 100,
      categoryLabel: 100,
      choices: 150
    },
    withRubric: {
      settings: false,
      label: 'Add Rubric'
    }
  }
};
