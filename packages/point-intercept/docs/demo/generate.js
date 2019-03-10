exports.model = (id, element) => ({
  id,
  element,
  //below is the legacy corespring point intercept model...
  minimumWidth: 500,
  correctResponse: ['0,0', '1,1', '2,2', '3,3'],
  partialScoring: [],
  feedback: {
    correct: {
      type: 'none',
      default: 'Correct'
    },
    incorrect: {
      type: 'none',
      default: 'Incorrect'
    },
    partial: {
      type: 'none',
      default: 'Nearly'
    }
  },
  model: {
    config: {
      graphTitle: '',
      graphWidth: 500,
      graphHeight: 500,

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
      showFeedback: true,


      maxPoints: '',
      labelsType: 'present',
      pointLabels: ['A1', 'B', 'C', 'D'],

      allowPartialScoring: false,
      pointsMustMatchLabels: false,
    }
  }
});
