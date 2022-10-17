export default {
  model: {
    prompt: 'This is the question prompt',
    toolbarEditorPosition: 'bottom',
    promptEnabled: true,
    imageUrl: '',
    shapes: {
      rectangles: [],
      polygons: []
    },
    multipleCorrect: true,
    partialScoring: false,
    dimensions: {
      height: 0,
      width: 0
    },
    hotspotColor: 'rgba(137, 183, 244, 0.65)',
    hotspotList: [
      'rgba(137, 183, 244, 0.65)'
    ],
    outlineColor: 'blue',
    outlineList: [
      'blue'
    ],
    rationaleEnabled: true,
    teacherInstructionsEnabled: true,
    studentInstructionsEnabled: true,
    strokeWidth: 5
  },
  configuration: {
    multipleCorrect: {
      settings: true,
      label: 'Multiple Correct Responses'
    },
    partialScoring: {
      settings: false,
      label: 'Allow Partial Scoring'
    },
    rationale: {
      settings: true,
      label: 'Rationale'
    },
    prompt: {
      settings: true,
      label: 'Prompt'
    },
    spellCheck: {
      label: 'Spellcheck',
      settings:false,
      enabled:true
    },
    teacherInstructions: {
      settings: true,
      label: 'Teacher Instructions'
    },
    preserveAspectRatio: {
      settings: false,
      enabled: true,
      label: 'Preserve aspect ratio'
    },
    minShapes: 2,
    maxImageWidth: {
      teacherInstructions: 300,
      prompt: 300,
      rationale: 300,
    },
    maxImageHeight: {
      teacherInstructions: 300,
      prompt: 300,
      rationale: 300,
    },
    withRubric: {
      settings: false,
      label: 'Add Rubric'
    }
  }
};
