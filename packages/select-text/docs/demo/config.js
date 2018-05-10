/**
 * {"config":{"scoringType":"weighted"},"xhtml":"<div>​<div id=\"0\" corespring-select-text=\"\"></div>​<div></div></div>","components":{"0":{"weight":1,"componentType":"corespring-select-text","title":"Select Evidence in Text","correctResponse":{"value":[0,1]},"feedback":{"correctFeedbackType":"none","partialFeedbackType":"none","incorrectFeedbackType":"none"},"allowPartialScoring":false,"partialScoring":[{"numberOfCorrect":1,"scorePercentage":25}],"model":{"choices":[0,1,2],"cleanPassage":"Rachel cut out 8 stars in 6 minutes. Lovelle cut out 6 stars in 4 minutes. Rachel cut out 4 more stars than Lovelle. Lovelle and Rachel cut the same number of stars in 6 minutes.","passage":"<span class=\"blast cst choice\">Rachel cut out 8 stars in 6 minutes.</span> <span class=\"blast cst choice\">Lovelle cut out 6 stars in 4 minutes.</span> Rachel cut out 4 more stars than Lovelle. <span class=\"blast cst choice\">Lovelle and Rachel cut the same number of stars in 6 minutes.</span>","config":{"maxSelections":0},"formattedPassage":""}}}}
 */

const oldModel = {
  correctResponse: { value: [0, 1] },
  /*feedback: {
    correctFeedbackType: 'none',
    partialFeedbackType: 'none',
    incorrectFeedbackType: 'none'
  },*/
  allowPartialScoring: false,
  partialScoring: [{ numberOfCorrect: 1, scorePercentage: 25 }],
  model: {
    choices: [0, 1, 2],
    cleanPassage:
      'Rachel cut out 8 stars in 6 minutes. Lovelle cut out 6 stars in 4 minutes. Rachel cut out 4 more stars than Lovelle. Lovelle and Rachel cut the same number of stars in 6 minutes.',
    passage:
      '<span class="blast cst choice">Rachel cut out 8 stars in 6 minutes.</span> <span class="blast cst choice">Lovelle cut out 6 stars in 4 minutes.</span> Rachel cut out 4 more stars than Lovelle. <span class="blast cst choice">Lovelle and Rachel cut the same number of stars in 6 minutes.</span>',
    config: { maxSelections: 0 },
    formattedPassage: ''
  }
};

const tokens = () => [
  {
    text: 'Rachel cut out 8 stars in 6 minutes.',
    start: 0,
    end: 36,
    correct: true
  },
  {
    text: 'Lovelle cut out 6 stars in 4 minutes.',
    start: 37,
    end: 74,
    correct: true
  },
  {
    text: 'Lovelle and Rachel cut the same number of stars in 6 minutes.',
    start: 117,
    end: 177
  }
];

const base = extras =>
  Object.assign(
    {},
    {
      element: 'select-text',
      highlightChoices: true,
      feedback: {
        correctFeedback: '',
        correctFeedbackType: 'default',
        incorrectFeedback: '',
        incorrectFeedbackType: 'default',
        partialFeedback: '',
        partialFeedbackType: 'default'
      },
      partialScoring: [{ numberOfCorrect: 1, scorePercentage: 25 }],
      maxSelections: 2,
      text:
        'Rachel cut out 8 stars in 6 minutes. Lovelle cut out 6 stars in 4 minutes. Rachel cut out 4 more stars than Lovelle. Lovelle and Rachel cut the same number of stars in 6 minutes.',
      tokens: tokens()
    },
    extras
  );

module.exports = {
  elements: {
    'select-text': '../..'
  },
  models: [base({ id: '1' })]
};
