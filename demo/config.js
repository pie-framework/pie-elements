const model = (pkg, id, element) => {
  element = element || pkg;
  const generate = require(`../packages/${pkg}/docs/demo/generate`);
  return generate.model(id, element);
};

module.exports = {
  elements: {
    'categorize-el': '@pie-element/categorize@2.0.1',
    'calculator-el': '@pie-element/calculator@2.0.1',
    'extended-text-entry': '@pie-element/extended-text-entry@3.0.1',
    'function-entry': '@pie-element/function-entry@3.0.1',
    'inline-choice': '@pie-element/inline-choice@2.0.1',
    'multiple-choice': '@pie-element/multiple-choice@2.0.1',
    'number-line': '@pie-element/number-line@3.0.1',
    'placement-ordering': '@pie-element/placement-ordering@3.0.1',
    'point-intercept': '@pie-element/point-intercept@3.0.1',
    'protractor-el': '@pie-element/protractor@2.0.1',
    'ruler-el': '@pie-element/ruler@3.0.1',
    'select-text': '@pie-element/select-text@3.0.1',
    'text-entry': '@pie-element/text-entry@3.0.1',
  },
  models: [
    model('calculator', '1', 'calculator-el'),
    model('categorize', '2', 'categorize-el'),
    model('extended-text-entry', '3'),
    model('function-entry', '4'),
    model('inline-choice', '5'),
    model('multiple-choice', '6'),
    model('number-line', '7'),
    model('placement-ordering', '8'),
    model('point-intercept', '9'),
    model('protractor', '10', 'protractor-el'),
    model('ruler', '11', 'ruler-el'),
    model('select-text', '12'),
    model('text-entry', '13'),
  ],
};
