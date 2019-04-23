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
 * Convert model to one the @pie-ui/graph-lines/Component uses.
 * @param {} m
 */
export function toComponentModel(m) {
  const newModel = Object.assign({}, m);
  const oldModelCopy = Object.assign({}, m);

  newModel.range = {};
  newModel.domain = {};
  newModel.config = m.graph;

  Object.keys(rangeModelMap).forEach(key => {
    newModel.range[rangeModelMap[key]] = oldModelCopy.graph[key];
  });

  Object.keys(domainModelMap).forEach(key => {
    newModel.domain[domainModelMap[key]] = oldModelCopy.graph[key];
  });

  Object.keys(oldModelCopy.graph).forEach(key => {
    newModel[modelMap[key] || key] = m.graph[key];
  });

  return newModel;
}
