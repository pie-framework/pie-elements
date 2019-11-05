import React from 'react';
import { mount } from 'enzyme';
import { ModelUpdatedEvent } from '@pie-framework/pie-configure-events';
import { choiceUtils as utils } from '@pie-lib/config-ui';
import ReactDOM from 'react-dom';
import defaults from '../defaults';
import { Main } from '../main';
import merge from 'lodash/merge';
import MultipleChoiceConfigure from '@pie-element/multiple-choice/configure/lib';
import EbsrConfigure from '../index';

jest.mock('react-dom', () => ({
  render: jest.fn()
}));

jest.mock('@pie-framework/pie-configure-events', () => ({
  ModelUpdatedEvent: update => {
    return {
      update,
      preventDefault: jest.fn(),
      stopImmediatePropagation: jest.fn()
    };
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

const createDefaultModel = (model, newModel = {}) => ({
  ...model,
  ...newModel,
  partA: {
    ...model.partA,
    ...newModel.partA
  },
  partB: {
    ...model.partB,
    ...newModel.partB
  }
});

const model = createDefaultModel(defaults.model, {
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
    el.configuration = defaults.configuration;
    el.onModelChanged = onModelChanged;
    el.onConfigurationChanged = onConfigurationChanged;
    el.connectedCallback();
    el.dispatchEvent = el.onModelUpdated;

    main = mount(
      <Main
        classes={{}}
        model={el._model}
        configuration={defaults.configuration}
        onConfigurationChanged={el.onConfigurationChanged}
        onModelChanged={el.onModelChanged}
      />
    );

    // mock onModelChanged to dispatch a MODEL_UPDATED event (as multiple-choice does)
    main.instance().partA.onModelChanged = m => {
      const event = new ModelUpdatedEvent(m, false);

      el.dispatchEvent({
        ...event,
        target: {
          getAttribute: jest.fn().mockReturnValue('A')
        }
      });
    };
    main.instance().partB.onModelChanged = m => {
      const event = new ModelUpdatedEvent(m, false);

      el.dispatchEvent({
        ...event,
        target: {
          getAttribute: jest.fn().mockReturnValue('B')
        }
      });
    };
  });

  describe('createDefaultModel', () => {
    it('default-snapshot', () => {
      const m = EbsrConfigure.createDefaultModel({});
      expect(m).toMatchSnapshot();
    });
    it('with-overrides-snapshot', () => {
      const m = EbsrConfigure.createDefaultModel({
        partA: { rationale: 'foo', teacherInstructions: 'ti' }
      });
      expect(m).toMatchSnapshot();
    });
  });

  describe('set model', () => {
    it('calls ReactDOM.render', () => {
      el.model = model;

      expect(el._model).toEqual(model);
      expect(ReactDOM.render).toHaveBeenCalled();
    });

    it('should have set the model for partA and partB', () => {
      expect(main.instance().partA._model).toEqual(model.partA);
      expect(main.instance().partB._model).toEqual(model.partB);
    });
  });

  describe('set configuration', () => {
    it('calls ReactDOM.render', () => {
      el.configuration = defaults.configuration;

      expect(ReactDOM.render).toHaveBeenCalled();
    });

    it('should have set the configuration for partA and partB', () => {
      expect(main.instance().partA.configuration).toEqual({
        ...defaults.configuration.partA,
        partLabels: defaults.configuration.partLabels,
        settingsPanelDisabled: true
      });
      expect(main.instance().partB.configuration).toEqual({
        ...defaults.configuration.partB,
        partLabels: defaults.configuration.partLabels,
        settingsPanelDisabled: true
      });
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
      { updatedB: true }
    );

    assetOnModelUpdated(
      'dispatching MODEL_UPDATED with update undefined does not update model.partA',
      'A',
      undefined,
      createDefaultModel(model).partA
    );
    assetOnModelUpdated(
      'dispatching MODEL_UPDATED with update undefined does not update model.partB',
      'B',
      undefined,
      createDefaultModel(model).partB
    );
  });

  const assetPartUpdate = (label, key, updatedModel) => {
    it(`${key} - ${label}`, () => {
      main.instance()[key].onModelChanged(updatedModel);

      expect(el._model[key]).toEqual(updatedModel);
      expect(ReactDOM.render).toBeCalled();
    });
  };

  describe('part update', () => {
    assetPartUpdate(
      'Dispatching Model Updated Event will update Teacher Instructions',
      'partA',
      { ...model.partA, teacherInstructions: 'Part A Teacher Instructions' }
    );
    assetPartUpdate(
      'Dispatching Model Updated Event will update Teacher Instructions',
      'partB',
      { ...model.partB, teacherInstructions: 'Part B Teacher Instructions' }
    );
    assetPartUpdate(
      'Dispatching Model Updated Event will update Prompt',
      'partA',
      { ...model.partA, prompt: 'Prompt A' }
    );
    assetPartUpdate(
      'Dispatching Model Updated Event will update Prompt',
      'partB',
      { ...model.partA, prompt: 'Prompt B' }
    );

    assetPartUpdate(
      'Dispatching Model Updated Event will update Choices - ADD CHOICE',
      'partA',
      {
        ...model.partA,
        choices: [
          ...model.partA.choices,
          {
            label: 'label',
            value: utils.firstAvailableIndex(
              model.partA.choices.map(c => c.value),
              0
            ),
            feedback: {
              type: 'none'
            }
          }
        ]
      }
    );
    assetPartUpdate(
      'Dispatching Model Updated Event will update Choices - ADD CHOICE',
      'partB',
      {
        ...model.partB,
        choices: [
          ...model.partB.choices,
          {
            label: 'label',
            value: utils.firstAvailableIndex(
              model.partB.choices.map(c => c.value),
              0
            ),
            feedback: {
              type: 'none'
            }
          }
        ]
      }
    );
    assetPartUpdate(
      'Dispatching Model Updated Event will update Choices - REMOVE CHOICE',
      'partA',
      {
        ...model.partA,
        choices: model.partA.choices.splice(0, 2)
      }
    );
    assetPartUpdate(
      'Dispatching Model Updated Event will update Choices - REMOVE CHOICE',
      'partB',
      {
        ...model.partB,
        choices: model.partB.choices.splice(0, 2)
      }
    );
    assetPartUpdate(
      'Dispatching Model Updated Event will update Choices - CHANGE CHOICE',
      'partA',
      {
        ...model.partA,
        choices: model.partA.choices.splice(1, 1, {
          correct: true,
          value: 'green',
          label: value => value.charAt(0).toUpperCase() + value.slice(1),
          feedback: {
            type: 'none',
            value: ''
          }
        })
      }
    );
    assetPartUpdate(
      'Dispatching Model Updated Event will update Choices - CHANGE CHOICE',
      'partB',
      {
        ...model.partB,
        choices: model.partB.choices.splice(1, 1, {
          correct: true,
          value: 'green',
          label: value => value.charAt(0).toUpperCase() + value.slice(1),
          feedback: {
            type: 'none',
            value: ''
          }
        })
      }
    );

    assetPartUpdate(
      'Dispatching Model Updated Event will update Choices',
      'partA',
      { ...model.partA, choices: [] }
    );
    assetPartUpdate(
      'Dispatching Model Updated Event will update Choices',
      'partB',
      { ...model.partB, choices: [] }
    );
  });
});

describe('main', () => {
  let Def;
  let el;
  let main;

  beforeAll(() => {
    Def = require('../index').default;
  });

  beforeEach(() => {
    el = new Def();
    el.model = model;
    el.configuration = defaults.configuration;
    el.dispatchEvent = el.onModelUpdated;

    main = mount(
      <Main
        classes={{}}
        model={el._model}
        configuration={defaults.configuration}
        onConfigurationChanged={el.onConfigurationChanged}
        onModelChanged={el.onModelChanged}
      />
    );
  });

  const assertOnModelChanged = (label, updatedModel, expected) => {
    it(label, () => {
      main.instance().props.onModelChanged(updatedModel);

      expect(el._model).toEqual(createDefaultModel(model, expected));
    });
  };

  describe('onModelChanged', () => {
    assertOnModelChanged('does not change the model', {}, model);
    assertOnModelChanged(
      'changes partA - checkbox',
      {
        partA: {
          choiceMode: 'checkbox'
        }
      },
      {
        ...model,
        partA: {
          choiceMode: 'checkbox'
        }
      }
    );
    assertOnModelChanged(
      'changes partA - choicePrefix',
      {
        partA: {
          choicePrefix: 'numbers'
        }
      },
      {
        ...model,
        partA: {
          choicePrefix: 'numbers'
        }
      }
    );
    assertOnModelChanged(
      'changes partA - partialScoring',
      {
        partA: {
          partialScoring: false
        }
      },
      {
        ...model,
        partA: {
          partialScoring: false
        }
      }
    );
    assertOnModelChanged(
      'changes partA - lockChoiceOrder',
      {
        partA: {
          lockChoiceOrder: true
        }
      },
      {
        ...model,
        partA: {
          lockChoiceOrder: true
        }
      }
    );
    assertOnModelChanged(
      'changes partA - scoringType',
      {
        partA: {
          scoringType: 'auto'
        }
      },
      {
        ...model,
        partA: {
          scoringType: 'auto'
        }
      }
    );
    assertOnModelChanged(
      'changes partB - checkbox',
      {
        partB: {
          choiceMode: 'checkbox'
        }
      },
      {
        ...model,
        partB: {
          choiceMode: 'checkbox'
        }
      }
    );
    assertOnModelChanged(
      'changes partB - choicePrefix',
      {
        partB: {
          choicePrefix: 'numbers'
        }
      },
      {
        ...model,
        partB: {
          choicePrefix: 'numbers'
        }
      }
    );
    assertOnModelChanged(
      'changes partB - partialScoring',
      {
        partB: {
          partialScoring: false
        }
      },
      {
        ...model,
        partB: {
          partialScoring: false
        }
      }
    );
    assertOnModelChanged(
      'changes partB - lockChoiceOrder',
      {
        partB: {
          lockChoiceOrder: true
        }
      },
      {
        ...model,
        partB: {
          lockChoiceOrder: true
        }
      }
    );
    assertOnModelChanged(
      'changes partB - scoringType',
      {
        partB: {
          scoringType: 'auto'
        }
      },
      {
        ...model,
        partB: {
          scoringType: 'auto'
        }
      }
    );
  });
});
