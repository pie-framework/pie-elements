const choice = (v, id) => ({ value: v, id });

const markup = '{{0}} + {{1}} = 15';

exports.model = (id, element) => ({
  id,
  element,
  markup,
  disabled: false,
  mode: 'gather',
  prompt: '<p>Solve the equation below.</p>',
  promptEnabled: true,
  shuffle: true,
  choices: [
    choice('<div>6</div>', '0'),
    choice('<div>9</div>', '1')
  ],
  choicesPosition: 'below',
  correctResponse: {
    '0': '0',
    '1': '1'
  },
  duplicates: true,
  alternateResponses : [
    ['1'],
    ['0']
  ],
  rationale: '<p>A correct response is shown below:</p><ul><li>2/6 = 1/3</li><li>4/8 = 1/2</li><li>6/10 = 3/5</li><li>9/12 = 3/4</li></ul>',
});
