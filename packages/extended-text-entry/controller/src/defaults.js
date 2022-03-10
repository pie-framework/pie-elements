export default {
  dimensions: {
    height: 100,
    width: 500,
  },
  predefinedAnnotations: [
    {
      label: 'good',
      text: 'good',
      type: 'positive'
    }, {
      label: '★',
      text: '★',
      type: 'positive'
    }, {
      label: ':-)',
      text: ':-)',
      type: 'positive'
    }, {
      label: 'creative',
      text: 'creative',
      type: 'positive'
    }, {
      label: 'run-on',
      text: 'run-on',
      type: 'negative'
    }, {
      label: 'frag',
      text: 'fragment',
      type: 'negative'
    }, {
      label: 'tran',
      text: 'transition',
      type: 'negative'
    }, {
      label: 'supp',
      text: 'support needed',
      type: 'negative'
    }, {
      label: 'punc',
      text: 'punctuation',
      type: 'negative'
    }, {
      label: 'agr',
      text: 'agreement wrong',
      type: 'negative'
    }, {
      label: 'unclear',
      text: 'unclear',
      type: 'negative'
    }, {
      label: 'cut',
      text: 'cut',
      type: 'negative'
    }, {
      label: 'sp',
      text: 'spelling',
      type: 'negative'
    }, {
      label: 'cap',
      text: 'capitalization',
      type: 'negative'
    }, {
      label: 'inf',
      text: 'informal',
      type: 'negative'
    }, {
      label: 'awk',
      text: 'awkward',
      type: 'negative'
    }
  ]
};
