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
 * @param {string[]} points - eg: ['x,y', 'x,y']
 * @param {*} oldModel
 *
 * @return {{x:number,y:number,label:string}[]}
 */
export function toSessionPoints(points = [], oldModel) {
  return points.map((point, idx) => {
    const [x, y] = point.split(',');

    return { x: parseInt(x, 10), y: parseInt(y, 10), label: oldModel.model.config.pointLabels[idx] };
  });
}

/**
 * Convert points array to xy string array
 * @param {{x:number,y:number,label:string}[]} points
 *
 * @return {string[]}
 */
export function toSessionAnswers(points) {
  return points.map(point => `${point.x},${point.y}`);
}

/**
 * Convert model to one the @pie-ui/point-intercept/Component uses.
 * @param {} m
 */
export function toComponentModel(m) {
  const newModel = Object.assign({}, m);
  const oldModelCopy = Object.assign({}, m);

  newModel.range = {};
  newModel.domain = {};
  newModel.config = m.model.config;

  if (m.correctResponse) {
    newModel.correctResponse = toSessionPoints(m.correctResponse, m);
  }

  Object.keys(rangeModelMap).forEach(key => {
    newModel.range[rangeModelMap[key]] = oldModelCopy.model.config[key];
  });

  Object.keys(domainModelMap).forEach(key => {
    newModel.domain[domainModelMap[key]] = oldModelCopy.model.config[key];
  });

  Object.keys(oldModelCopy.model.config).forEach(key => {
    newModel[modelMap[key] || key] = m.model.config[key];
  });

  return newModel;
}
