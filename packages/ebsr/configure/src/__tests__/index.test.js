import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ModelUpdatedEvent } from '@pie-framework/pie-configure-events';
import { choiceUtils as utils } from '@pie-lib/config-ui';
import { createRoot } from 'react-dom/client';
import defaults from '../defaults';
import { Main } from '../main';
import EbsrConfigure from '../index';

const mockRender = jest.fn();
const mockUnmount = jest.fn();
jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({
    render: mockRender,
    unmount: mockUnmount,
  })),
}));

jest.mock('@pie-framework/pie-configure-events', () => ({
  ModelUpdatedEvent: class ModelUpdatedEvent {
    constructor(update) {
      this.update = update;
      this.preventDefault = jest.fn();
      this.stopImmediatePropagation = jest.fn();
    }
  },
}));

jest.mock('@pie-lib/config-ui', () => ({
  choiceUtils: {
    firstAvailableIndex: jest.fn(),
  },
  settings: {
    Panel: (props) => <div data-testid="settings-panel" {...props} />,
    toggle: jest.fn(),
    radio: jest.fn(),
    dropdown: jest.fn(),
  },
  layout: {
    ConfigLayout: (props) => <div data-testid="config-layout">{props.children}</div>,
  },
}));

jest.mock('@pie-element/multiple-choice/configure/lib', () => (class MockConfigure {}));

const theme = createTheme();

const PART_A = 'partA';
const PART_B = 'partB';

const createDefaultModel = (model, newModel = {}) => ({
  ...model,
  ...newModel,
  partA: {
    ...model.partA,
    ...newModel.partA,
  },
  partB: {
    ...model.partB,
    ...newModel.partB,
  },
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
          value: 'foo',
        },
      },
      {
        value: 'green',
        label: 'Green',
        feedback: {
          type: 'default',
        },
      },
    ],
    choicePrefix: 'numbers',
    prompt: `prompt ${PART_A}`,
    errors: {},
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
          value: 'foo',
        },
      },
      {
        value: 'purple',
        label: 'Purple',
        feedback: {
          type: 'default',
        },
      },
    ],
    choicePrefix: 'numbers',
    prompt: `prompt ${PART_B}`,
    errors: {},
  },
});

describe('index', () => {
  let Def;
  let el;
  let onModelChanged = jest.fn();
  let onConfigurationChanged = jest.fn();

  beforeAll(() => {
    Def = require('../index').default;

    // Register the custom element if not already registered
    if (!customElements.get('ebsr-configure')) {
      customElements.define('ebsr-configure', Def);
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
    el = document.createElement('ebsr-configure');
    el.model = model;
    el.configuration = defaults.configuration;
    el.onModelChanged = onModelChanged;
    el.onConfigurationChanged = onConfigurationChanged;
    el.connectedCallback();
    el.dispatchEvent = el.onModelUpdated;
  });

  describe('set model', () => {
    it('calls ReactDOM.render', () => {
      el.model = model;

      expect(el._model).toEqual(model);
      expect(createRoot).toHaveBeenCalled();
      expect(mockRender).toHaveBeenCalled();
    });

    it('should have set the model for partA and partB', () => {
      const { container } = render(
        <ThemeProvider theme={theme}>
          <Main
            classes={{}}
            model={el._model}
            configuration={defaults.configuration}
            onConfigurationChanged={el.onConfigurationChanged}
            onModelChanged={el.onModelChanged}
          />
        </ThemeProvider>
      );

      expect(container).toBeInTheDocument();
      expect(el._model.partA).toEqual(model.partA);
      expect(el._model.partB).toEqual(model.partB);
    });
  });

  describe('set configuration', () => {
    it('calls ReactDOM.render', () => {
      el.configuration = defaults.configuration;

      expect(createRoot).toHaveBeenCalled();
      expect(mockRender).toHaveBeenCalled();
    });

    it('should have set the configuration for partA and partB', () => {
      const { container } = render(
        <ThemeProvider theme={theme}>
          <Main
            classes={{}}
            model={el._model}
            configuration={defaults.configuration}
            onConfigurationChanged={el.onConfigurationChanged}
            onModelChanged={el.onModelChanged}
          />
        </ThemeProvider>
      );

      expect(container).toBeInTheDocument();
    });
  });

  const assertOnModelUpdated = (label, key, updatedPart, expected) => {
    it(label, () => {
      const event = new ModelUpdatedEvent(updatedPart, false);

      el.dispatchEvent({
        ...event,
        target: {
          getAttribute: jest.fn().mockReturnValue(key),
        },
      });

      expect(createRoot).toBeCalled();
      expect(mockRender).toBeCalled();
      expect(el._model[`part${key}`]).toEqual(expected);
    });
  };

  describe('onModelUpdated', () => {
    assertOnModelUpdated('dispatching MODEL_UPDATED updates model.partA', 'A', { updatedA: true }, { updatedA: true });
    assertOnModelUpdated('dispatching MODEL_UPDATED updates model.partB', 'B', { updatedB: true }, { updatedB: true });

    assertOnModelUpdated(
      'dispatching MODEL_UPDATED with update undefined does not update model.partA',
      'A',
      undefined,
      createDefaultModel(model).partA,
    );
    assertOnModelUpdated(
      'dispatching MODEL_UPDATED with update undefined does not update model.partB',
      'B',
      undefined,
      createDefaultModel(model).partB,
    );
  });

  const assertPartUpdate = (label, key, updatedModel) => {
    it(`${key} - ${label}`, () => {
      // Simulate the onModelChanged call for the specific part
      const event = new ModelUpdatedEvent(updatedModel, false);

      el.dispatchEvent({
        ...event,
        target: {
          getAttribute: jest.fn().mockReturnValue(key === 'partA' ? 'A' : 'B'),
        },
      });

      expect(el._model[key]).toEqual(updatedModel);
      expect(createRoot).toBeCalled();
      expect(mockRender).toBeCalled();
    });
  };

  describe('part update', () => {
    assertPartUpdate('Dispatching Model Updated Event will update Teacher Instructions', 'partA', {
      ...model.partA,
      teacherInstructions: 'Part A Teacher Instructions',
    });
    assertPartUpdate('Dispatching Model Updated Event will update Teacher Instructions', 'partB', {
      ...model.partB,
      teacherInstructions: 'Part B Teacher Instructions',
    });
    assertPartUpdate('Dispatching Model Updated Event will update Prompt', 'partA', {
      ...model.partA,
      prompt: 'Prompt A',
    });
    assertPartUpdate('Dispatching Model Updated Event will update Prompt', 'partB', {
      ...model.partA,
      prompt: 'Prompt B',
    });

    assertPartUpdate('Dispatching Model Updated Event will update Choices - ADD CHOICE', 'partA', {
      ...model.partA,
      choices: [
        ...model.partA.choices,
        {
          label: 'label',
          value: utils.firstAvailableIndex(
            model.partA.choices.map((c) => c.value),
            0,
          ),
          feedback: {
            type: 'none',
          },
        },
      ],
    });
    assertPartUpdate('Dispatching Model Updated Event will update Choices - ADD CHOICE', 'partB', {
      ...model.partB,
      choices: [
        ...model.partB.choices,
        {
          label: 'label',
          value: utils.firstAvailableIndex(
            model.partB.choices.map((c) => c.value),
            0,
          ),
          feedback: {
            type: 'none',
          },
        },
      ],
    });
    assertPartUpdate('Dispatching Model Updated Event will update Choices - REMOVE CHOICE', 'partA', {
      ...model.partA,
      choices: model.partA.choices.splice(0, 2),
    });
    assertPartUpdate('Dispatching Model Updated Event will update Choices - REMOVE CHOICE', 'partB', {
      ...model.partB,
      choices: model.partB.choices.splice(0, 2),
    });
    assertPartUpdate('Dispatching Model Updated Event will update Choices - CHANGE CHOICE', 'partA', {
      ...model.partA,
      choices: model.partA.choices.splice(1, 1, {
        correct: true,
        value: 'green',
        label: (value) => value.charAt(0).toUpperCase() + value.slice(1),
        feedback: {
          type: 'none',
          value: '',
        },
      }),
    });
    assertPartUpdate('Dispatching Model Updated Event will update Choices - CHANGE CHOICE', 'partB', {
      ...model.partB,
      choices: model.partB.choices.splice(1, 1, {
        correct: true,
        value: 'green',
        label: (value) => value.charAt(0).toUpperCase() + value.slice(1),
        feedback: {
          type: 'none',
          value: '',
        },
      }),
    });

    assertPartUpdate('Dispatching Model Updated Event will update Choices', 'partA', { ...model.partA, choices: [] });
    assertPartUpdate('Dispatching Model Updated Event will update Choices', 'partB', { ...model.partB, choices: [] });
  });
});

describe('main', () => {
  let Def;
  let el;

  beforeAll(() => {
    Def = require('../index').default;

    // Register the custom element if not already registered
    if (!customElements.get('ebsr-configure')) {
      customElements.define('ebsr-configure', Def);
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
    el = document.createElement('ebsr-configure');
    el.model = model;
    el.configuration = defaults.configuration;
    el.dispatchEvent = el.onModelUpdated;
  });

  const assertOnModelChanged = (label, updatedModel, expected) => {
    it(label, () => {
      el.onModelChanged(updatedModel);

      expect(el._model).toEqual(createDefaultModel(model, expected));
    });
  };

  describe('onModelChanged', () => {
    assertOnModelChanged('does not change the model', {}, model);
    assertOnModelChanged(
      'changes partA - checkbox',
      {
        partA: {
          choiceMode: 'checkbox',
        },
      },
      {
        ...model,
        partA: {
          choiceMode: 'checkbox',
        },
      },
    );
    assertOnModelChanged(
      'changes partA - choicePrefix',
      {
        partA: {
          choicePrefix: 'numbers',
        },
      },
      {
        ...model,
        partA: {
          choicePrefix: 'numbers',
        },
      },
    );
    assertOnModelChanged(
      'changes partA - partialScoring',
      {
        partialScoring: false,
      },
      {
        ...model,
        partialScoring: false,
      },
    );
    assertOnModelChanged(
      'changes partA - lockChoiceOrder',
      {
        partA: {
          lockChoiceOrder: true,
        },
      },
      {
        ...model,
        partA: {
          lockChoiceOrder: true,
        },
      },
    );
    assertOnModelChanged(
      'changes partA - scoringType',
      {
        scoringType: 'auto',
      },
      {
        ...model,
        scoringType: 'auto',
      },
    );
    assertOnModelChanged(
      'changes partB - checkbox',
      {
        partB: {
          choiceMode: 'checkbox',
        },
      },
      {
        ...model,
        partB: {
          choiceMode: 'checkbox',
        },
      },
    );
    assertOnModelChanged(
      'changes partB - choicePrefix',
      {
        partB: {
          choicePrefix: 'numbers',
        },
      },
      {
        ...model,
        partB: {
          choicePrefix: 'numbers',
        },
      },
    );
    assertOnModelChanged(
      'changes partB - partialScoring',
      {
        partialScoring: false,
      },
      {
        ...model,
        partialScoring: false,
      },
    );
    assertOnModelChanged(
      'changes partB - lockChoiceOrder',
      {
        partB: {
          lockChoiceOrder: true,
        },
      },
      {
        ...model,
        partB: {
          lockChoiceOrder: true,
        },
      },
    );
    assertOnModelChanged(
      'changes partB - scoringType',
      {
        scoringType: 'auto',
      },
      {
        ...model,
        scoringType: 'auto',
      },
    );
  });
});
