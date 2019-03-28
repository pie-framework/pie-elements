const PART_A = 'partA';
const PART_B = 'partB';
const model = {
  partA: {
    choiceMode: 'radio',
    choices: [
      {
        value: 'yellow',
        label: 'Yellow',
        correct: true,
        feedback: {
          type: 'custom',
          value: 'foo'
        }
      },
      {
        value: 'green',
        label: 'Green',
        feedback: {
          type: 'default'
        }
      }
    ],
    keyMode: 'numbers',
    prompt: `prompt ${PART_A}`
  },
  partB: {
    choiceMode: 'radio',
    choices: [
      {
        value: 'orange',
        label: 'Orange',
        correct: true,
        feedback: {
          type: 'custom',
          value: 'foo'
        }
      },
      {
        value: 'purple',
        label: 'Purple',
        feedback: {
          type: 'default'
        }
      }
    ],
    keyMode: 'numbers',
    prompt: `prompt ${PART_B}`
  }
};

describe('index', () => {
  let Def;
  let el;
  let partA;
  let partB;

  beforeAll(() => {
    Def = require('../index').default;
  });

  beforeEach(() => {
    el = new Def();
    el.connectedCallback();
    partA = new HTMLElement();
    partB = new HTMLElement();
    el.querySelector = jest.fn(s => {
      if (s === '#part-a-configure') {
        return partA;
      } else {
        return partB;
      }
    });
    el.model = model;
  });

  it('should have set the model', () => {
    console.log(partA);
    expect(partA.model).toEqual(model.partA);
  });
});
