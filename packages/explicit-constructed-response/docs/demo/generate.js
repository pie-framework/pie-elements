const choice = (l, v) => ({ label: l, value: v });

// const markup = '<p>The {{0}} <br> jumped {{1}} <br> the {{2}}</p>';
const markup = `Let <math><mi>&#402;</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>=</mo><mfenced open="|" close="|"><mi>x</mi></mfenced><mo>+</mo><mn>5</mn></math>&#160;and <math><mi>g</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>=</mo><msup><mi>x</mi><mn>3</mn></msup><mo>-</mo><mn>2</mn><mi>x</mi><mo>+</mo><mn>3</mn></math>.<br>`;

exports.model = (id, element) => ({
  id,
  element,
  markup,
  disabled: false,
  choices: {
    0: [choice('cow', '0'), choice('cattle', '1'), choice('calf', '2')],
    1: [choice('over', '0'), choice('past', '1'), choice('beyond', '2')],
    2: [choice('moon', '0')]
  },
  prompt: 'Complete the sentence',
  promptEnabled: true
});
