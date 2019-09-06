export default {
  partA: {
    choices: [
      {
        value: 'a',
        label: 'label a',
      }
    ],
    prompt: 'prompt a'
  },
  partB: {
    choices: [
      {
        value: 'b',
        label: 'label b',
      },
    ],
    prompt: 'prompt b'
  },
  configuration: {
    addChoiceButton: {
      settings: true,
      label: 'Add a Choice',
    },
    choiceMode: {
      settings: true,
      label: 'Response Type'
    },
    choicePrefix: {
      settings: true,
      label: 'Choice Labels'
    },
    deleteChoice: {
      settings: true,
    },
    feedback: {
      settings: true,
      label: 'Feedback',
      enabled: true
    },
    prompt: {
      settings: true,
      label: 'Prompt'
    },
    lockChoiceOrder: {
      settings: true,
      label: 'Lock Choice Order'
    },
    partialScoring: {
      settings: true,
      label: 'Allow Partial Scoring',
    },
    rationale: {
      settings: true,
      label: 'Rationale',
      enabled: true,
    },
    scoringType: {
      settings: false,
      label: 'Scoring Type',
    },
    studentInstructions: {
      settings: false,
      label: 'Student Instructions',
      enabled: true,
    },
    teacherInstructions: {
      settings: true,
      label: 'Teacher Instructions',
      enabled: true,
    },
    sequentialChoiceLabels: {
      settings: false,
      label: 'Sequential Choice Labels',
      enabled: false
    },
    partLabelType: 'Letters',
    partLabels: {
      settings: true,
      label: 'Part Labels',
      enabled: true
    }
  }
};
