import React from 'react';
import { ModelUpdatedEvent } from '@pie-framework/pie-configure-events';
import { choiceUtils as utils } from '@pie-lib/config-ui';
import merge from 'lodash/merge';
import MultipleChoiceConfigure from '@pie-element/multiple-choice/configure/lib';

jest.mock('@pie-lib/config-ui', () => ({
  choiceUtils: {
    firstAvailableIndex: jest.fn()
  },
  settings: {
    Panel: props => <div {...props} />,
    toggle: jest.fn(),
    radio: jest.fn()
  }
}));

jest.mock(
  '@pie-element/multiple-choice/configure/lib',
  () => class MockConfigure {}
);

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
    choicePrefix: 'numbers',
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
    choicePrefix: 'numbers',
    prompt: `prompt ${PART_B}`
  }
};

describe('index', () => {
  let Def;
  let el;
  let ebsr;

  beforeAll(() => {
    Def = require('../index').default;
  });

  beforeEach(() => {
    el = new Def();
    el.connectedCallback();
    el.populatePart = jest.fn();
    ebsr = {
      partA: new HTMLElement(),
      partB: new HTMLElement()
    };
    el.querySelector = jest.fn(s => {
      if (s === `ebsr-multiple-choice-configure#a`) {
        return ebsr.partA;
      } else {
        return ebsr.partB;
      }
    });
    el.model = model;
  });

  const shouldHaveModel = key => {
    it(`${key} should have set the model`, () => {
      expect(ebsr[key].model).toEqual(model[key]);
    });
  };

  const updateModel = (model, key) => {
    const event = new ModelUpdatedEvent(model, false);

    el._model[key] = event.update;
    el.dispatchEvent(new ModelUpdatedEvent(el._model, false));
  };

  const expectToMatchModel = (newModel, key) => {
    expect(newModel).toEqual(model[key]);
  };

  const resetsModel = key => {
    it(`${key} resets the model`, () => {
      const newModel = {
        ...model[key],
        choiceMode: 'checkbox'
      };

      updateModel(newModel, key);
      expectToMatchModel(newModel, key);
    });
  };

  const changesPartialScoring = key => {
    it(`${key} changes partial scoring value`, () => {
      const newModel = {
        ...model[key],
        partialScoring: true
      };

      updateModel(newModel, key);
      expectToMatchModel(newModel, key);
    });
  };

  const addsChoice = key => {
    it(`${key} adds a choice`, () => {
      const newModel = {
        ...model[key],
        choices: [
          ...model[key].choices,
          {
            label: 'label',
            value: utils.firstAvailableIndex(
              model[key].choices.map(c => c.value),
              0
            ),
            feedback: {
              type: 'none'
            }
          }
        ]
      };

      updateModel(newModel, key);
      expectToMatchModel(newModel, key);
    });
  };

  const removesChoice = key => {
    it(`${key} removes choice`, () => {
      const newModel = {
        ...model[key],
        choices: model[key].choices.splice(0, 2)
      };

      updateModel(newModel, key);
      expectToMatchModel(newModel, key);
    });
  };

  const changesChoicePrefix = key => {
    it(`${key} changes choicePrefix`, () => {
      const newModel = {
        ...model[key],
        choicePrefix: 'letters'
      };

      updateModel(newModel, key);
      expectToMatchModel(newModel, key);
    });
  };

  const changesChoice = (key, value) => {
    const choice = {
      correct: true,
      value,
      label: value => value.charAt(0).toUpperCase() + value.slice(1),
      feedback: {
        type: 'none',
        value: ''
      }
    };

    it(`${key} changes choice`, () => {
      const newModel = {
        ...model[key],
        choiceMode: 'checkbox'
      };

      newModel.choices.splice(1, 1, choice);

      updateModel(newModel, key);
      expectToMatchModel(newModel, key);
    });

    it(`${key} changes choice and makes incorrect all other choices`, () => {
      const newModel = {
        ...model[key],
        choiceMode: 'radio',
        choices: [
          ...model[key].choices.map(c => {
            return merge({}, c, { correct: false });
          })
        ]
      };

      newModel.choices.splice(1, 1, choice);

      updateModel(newModel, key);
      expectToMatchModel(newModel, key);
    });
  };

  shouldHaveModel(PART_A);
  shouldHaveModel(PART_B);

  describe('logic', () => {
    describe('onChoiceModeChanged', () => {
      resetsModel(PART_A);
      resetsModel(PART_B);
    });

    describe('onPartialScoringChanged', () => {
      changesPartialScoring(PART_A);
      changesPartialScoring(PART_B);
    });

    describe('onAddChoice', () => {
      addsChoice(PART_A);
      addsChoice(PART_B);
    });

    describe('onRemoveChoice', () => {
      removesChoice(PART_A);
      removesChoice(PART_B);
    });

    describe('onKeyModeChanged', () => {
      changesChoicePrefix(PART_A);
      changesChoicePrefix(PART_B);
    });

    describe('onChoiceChanged', () => {
      changesChoice(PART_A, 'green');
      changesChoice(PART_B, 'purple');
    });
  });
});
