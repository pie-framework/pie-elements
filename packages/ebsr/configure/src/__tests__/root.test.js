const PART_A = 'partA';
const PART_B = 'partB';

const model1 = {
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
      },
    ],
    keyMode: 'numbers',
    prompt: `prompt ${PART_A}`,
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
      },
    ],
    keyMode: 'numbers',
    prompt: `prompt ${PART_B}`,
  }
};

describe('Root', () => {
  let componentRoot;
  let mcs;

  beforeEach(() => {
    componentRoot = document.querySelector('ebsr-element-configure');
    componentRoot.model = model1;

    mcs = document.querySelectorAll('multiple-choice-configure');
  });

  it('should have a container element for the greeting', () => {
    expect(mcs.length).to.equal(2);
  });
});
