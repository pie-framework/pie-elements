// {
//   id: '1',
//     element: 'point-intercept',
//   //below is the legacy corespring point intercept model...
//   correctResponse: ['0,0', '1,1', '2,2', '3,3'],
//   allowPartialScoring: false,
//   partialScoring: [{}],
// }


//
// /**
//  * Legacy system had sigfigs - which i think is for checking if a value
//  * is close enough to a correct answer. do we need this?
//  */
// module.exports = {
//   elements: {
//     'point-intercept': '..'
//   },
//   models: [
//     model('1', {
//       // pointLabels: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
//       // correctResponse: [{ x: 0, y: 0, label: 'A' }, { x: 1, y: 1, label: 'B' }],
//       pointsMustMatchLabels: true
//     }),
//   ],
// };

const rangeModelMap = {
  rangeLabel: 'label',
  rangeMin: 'min',
  rangeMax: 'max',
  rangeStepValue: 'step',
  rangeSnapValue: 'snap',
  rangeLabelFrequency: 'labelFrequency',
  rangeGraphPadding: 'padding',
};

const domainModelMap = {
  domainLabel: 'label',
  domainMin: 'min',
  domainMax: 'max',
  domainStepValue: 'step',
  domainSnapValue: 'snap',
  domainLabelFrequency: 'labelFrequency',
  domainGraphPadding: 'padding',
};

const modelMap = {
  graphTitle: 'title',
  graphWidth: 'width',
  graphHeight: 'height',
  maxPoints: '',
  labelsType: '',
  pointLabels: '',
  sigfigs: '',
  showCoordinates: '',
  showPointLabels: '',
  showInputs: '',
  showAxisLabels: '',
  showFeedback: ''
};

export function formatToOldModel(newModel) {
  const oldModel = Object.assign(newModel, {});

  Object.keys(rangeModelMap).forEach(key => {
    oldModel.model.config[key] = newModel.model.range[rangeModelMap[key]];
  });

  Object.keys(domainModelMap).forEach(key => {
    oldModel.model.config[key] = newModel.model.domain[domainModelMap[key]];
  });

  return oldModel;
}

export function formatToNewModel(oldModel) {
  const newModel = Object.assign(oldModel, {});
  const oldModelCopy = Object.assign(oldModel, {});

  newModel.model = {
    range: {},
    domain: {},
    config: oldModel.model.config,
  };

  Object.keys(rangeModelMap).forEach(key => {
    newModel.model.range[rangeModelMap[key]] = oldModelCopy.model.config[key];
  });

  Object.keys(domainModelMap).forEach(key => {
    newModel.model.domain[domainModelMap[key]] = oldModelCopy.model.config[key];
  });

  Object.keys(oldModelCopy.model.config).forEach(key => {
    newModel.model[modelMap[key] || key] = oldModel.model.config[key];
  });

  return newModel;
}
