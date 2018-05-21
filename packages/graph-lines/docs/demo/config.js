module.exports = {
  elements: {
    'graph-lines': '../..'
  },
  models: [
    {
      id: '1',
      element: 'graph-lines',
      //below is the legacy corespring point intercept model...
      minimumWidth: 500,
      correctResponse: '3x+2',
      partialScoring: [],
      feedback: {
        correct: {
          type: 'none',
          default: 'Correct'
        },
        incorrect: {
          type: 'none',
          default: 'Incorrect'
        }
      },
      model: {
        config: {
          graphTitle: '',
          graphWidth: 500,
          graphHeight: 500,
          maxPoints: '',
          labelsType: 'present',
          pointLabels: ['A', 'B', 'C', 'D'],
          correctLine: '3x+2',
          initialView: '3x+3',
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
          pointsMustMatchLabels: false,
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
