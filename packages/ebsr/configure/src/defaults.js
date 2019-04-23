const defaultConfigure = {
  sequentialChoiceLabels: {
    settings: true,
    label: 'Sequential Choice Labels',
    enabled: false
  },
  partLabels: {
    settings: true,
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
    configure: {
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
    configure: defaultConfigure
  },
};
