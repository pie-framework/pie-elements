module.exports = {
  elements: {
    'point-intercept': '../..'
  },
  models: [
    {
      id: '1',
      element: 'point-intercept',
      //below is the legacy corespring point intercept model...
      minimumWidth: 500,
      correctResponse: ['0,0', '1,1', '2,2', '3,3'],
      allowPartialScoring: false,
      partialScoring: [],
      feedback: {
        correctFeedbackType: 'none',
        correctFeedbackValue: '',
        partialFeedbackType: 'none',
        partialFeedbackValue: '',
        incorrectFeedbackType: 'none',
        incorrectFeedbackValue: '',
      },
      model: {
        config: {
          graphTitle: '',
          graphWidth: 500,
          graphHeight: 500,
          maxPoints: '',
          labelsType: 'present',
          pointLabels: ['A', 'B', 'C', 'D'],
          domainLabel: '',
          domainMin: -10,
          domainMax: 10,
          domainStepValue: 1,
          domainSnapValue: 1,
          domainLabelFrequency: 1,
          domainGraphPadding: 50,
          rangeLabel: '',
          rangeMin: -10,
          rangeMax: 10,
          rangeStepValue: 1,
          rangeSnapValue: 1,
          rangeLabelFrequency: 1,
          rangeGraphPadding: 50,
          sigfigs: -1,
          showCoordinates: false,
          showPointLabels: true,
          showInputs: true,
          showAxisLabels: true,
          showFeedback: true
        }
      }
    }
  ]
};
