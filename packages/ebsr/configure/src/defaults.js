const defaultConfigure = {
  sequentialChoiceLabels: {
    settings: false,
    label: 'Sequential Choice Labels',
    enabled: false
  },
  partLabels: {
    settings: false,
    label: 'Part Labels',
    enabled: false
  }
};

export default {
  partA: {
    choices: [
      {
        value: 'a',
        label: 'label a',
      }
    ],
    prompt: 'prompt a',
    configuration: {
      ...defaultConfigure,
      choiceMode: {
        settings: false,
        label: 'Response Type'
      },
      partialScoring: {
        settings: false,
        label: 'Allow Partial Scoring',
      },
    }
  },
  partB: {
    choices: [
      {
        value: 'b',
        label: 'label b',
      },
    ],
    prompt: 'prompt b',
    configuration: defaultConfigure
  },
};
