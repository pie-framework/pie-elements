import React from 'react';
import { mount } from 'enzyme';
import { ModelUpdatedEvent } from '@pie-framework/pie-configure-events';
import { choiceUtils as utils } from '@pie-lib/config-ui';
import merge from 'lodash/merge';
import MultipleChoiceConfigure from '@pie-element/multiple-choice/configure/lib';
import ReactDOM from 'react-dom';
import defaults from '../defaults';
import { Main } from '../main';

jest.mock('react-dom', () => ({
  render: jest.fn()
}));

jest.mock('@pie-framework/pie-configure-events', () => ({
  ModelUpdatedEvent: (update) => {
    return {
      update,
      preventDefault: jest.fn(),
      stopImmediatePropagation: jest.fn()
    }
  }
}));

jest.mock('@pie-lib/config-ui', () => ({
  choiceUtils: {
    firstAvailableIndex: jest.fn()
  },
  settings: {
    Panel: props => <div {...props} />,
    toggle: jest.fn(),
    radio: jest.fn(),
    dropdown: jest.fn()
  },
  layout: {
    ConfigLayout: props => <div>{props.children}</div>
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

const createDefaultModel = (model = {}) => ({
  ...defaults.model,
  ...model,
  partA: {
    ...defaults.model.partA,
    ...model.partA
  },
  partB: {
    ...defaults.model.partB,
    ...model.partB
  },
});

describe('index', () => {
  let Def;
  let el;
  let onModelChanged = jest.fn();
  let onConfigurationChanged = jest.fn();
  let main;

  beforeAll(() => {
    Def = require('../index').default;
  });

  beforeEach(() => {
    el = new Def();
    el.model = model;
    el.onModelChanged = onModelChanged;
    el.onConfigurationChanged = onConfigurationChanged;
    el.connectedCallback();
    el.dispatchEvent = el.onModelUpdated;

    main = mount(<Main
      classes={{}}
      model={el._model}
      configuration={defaults.configuration}
      onConfigurationChanged={onConfigurationChanged}
      onModelChanged={onModelChanged}
    />);

    // mock onModelChanged to dispatch a MODEL_UPDATED event (as multiple-choice does)
    main.instance().partA.onModelChanged = (m) => {
      const event = new ModelUpdatedEvent(m, false);

      el.dispatchEvent({
        ...event,
        target: {
          getAttribute: jest.fn().mockReturnValue('A')
        }
      });
    };
    main.instance().partB.onModelChanged = (m) => {
      const event = new ModelUpdatedEvent(m, false);

      el.dispatchEvent({
        ...event,
        target: {
          getAttribute: jest.fn().mockReturnValue('B')
        }
      });
    };
  });

  describe('set model', () => {
    it('calls ReactDOM.render', () => {
      el.model = model;

      expect(ReactDOM.render).toHaveBeenCalled();
      expect(el._model).toEqual(createDefaultModel(model));
    });
  });

  describe('set configuration', () => {
    it('calls ReactDOM.render', () => {
      el.configuration = defaults.configuration;

      expect(ReactDOM.render).toHaveBeenCalled();
    });
  });

  const assetOnModelUpdated = (label, key, updatedPart, expected) => {
    it(label, () => {
      const event = new ModelUpdatedEvent(updatedPart, false);

      el.dispatchEvent({
        ...event,
        target: {
          getAttribute: jest.fn().mockReturnValue(key)
        }
      });

      expect(ReactDOM.render).toBeCalled();
      expect(el._model[`part${key}`]).toEqual(expected);
    });
  };

  describe('onModelUpdated', () => {
    assetOnModelUpdated(
      'dispatching MODEL_UPDATED updates model.partA',
      'A',
      { updatedA: true },
      { updatedA: true }
      );
    assetOnModelUpdated(
      'dispatching MODEL_UPDATED updates model.partB',
      'B',
      { updatedB: true },
      { updatedB: true });

    assetOnModelUpdated(
      'dispatching MODEL_UPDATED with update undefined does not update model.partA',
      'A',
      undefined,
      createDefaultModel(model).partA);
    assetOnModelUpdated(
      'dispatching MODEL_UPDATED with update undefined does not update model.partB',
      'B',
      undefined,
      createDefaultModel(model).partB);
  });




  const assetOnModelChanged = (label, key, updatedModel) => {
    it(label, () => {
      main.instance().props.onModelChanged({ test: 'a' });

      expect(onModelChanged).toHaveBeenCalledWith({ test: 'a' });
    });
  };


  const assetPartUpdate = (label, key, updatedModel) => {
    it(label, () => {
      main.instance().partA.onModelChanged({ test: 'ceva'});

      console.log('assetPartUpdate');
      expect(ReactDOM.render).toBeCalled();
    });
  };
});


// these tests are no longer proper for EBSR, since previously React was not used
xdescribe('index', () => {
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
