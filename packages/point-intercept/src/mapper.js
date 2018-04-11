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
  rangeGraphPadding: 'padding'
};

const domainModelMap = {
  domainLabel: 'label',
  domainMin: 'min',
  domainMax: 'max',
  domainStepValue: 'step',
  domainSnapValue: 'snap',
  domainLabelFrequency: 'labelFrequency',
  domainGraphPadding: 'padding'
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

/**
 * Convert old xy string array to points array
 * @param {string[]} answers - eg: ['x,y', 'x,y']
 * @param {*} oldModel
 *
 * @return {{x:number,y:number,label:string}[]}
 */
export function toSessionPoints(answers, oldModel) {
  return [];
}

/**
 * Convert points array to xy string array
 * @param {{x:number,y:number,label:string}[]} points
 *
 * @return {string[]}
 */
export function toSessionAnswers(points) {
  return [];
}

/**
 * Convert model to one the @pie-ui/point-intercept/Component uses.
 * @param {} m
 */
export function toComponentModel(m) {
  const newModel = Object.assign({}, m);
  const oldModelCopy = Object.assign({}, m);

  newModel.model = {
    range: {},
    domain: {},
    config: m.model.config
  };

  Object.keys(rangeModelMap).forEach(key => {
    newModel.model.range[rangeModelMap[key]] = oldModelCopy.model.config[key];
  });

  Object.keys(domainModelMap).forEach(key => {
    newModel.model.domain[domainModelMap[key]] = oldModelCopy.model.config[key];
  });

  Object.keys(oldModelCopy.model.config).forEach(key => {
    newModel.model[modelMap[key] || key] = m.model.config[key];
  });

  return newModel;
}
