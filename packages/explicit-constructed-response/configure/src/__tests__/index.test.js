import React from 'react';
import { createRoot } from 'react-dom/client';
import { ModelUpdatedEvent } from '@pie-framework/pie-configure-events';

import sensibleDefaults from '../defaults';

jest.mock('@pie-lib/config-ui', () => ({
  settings: {
    Panel: (props) => <div {...props} />,
    toggle: jest.fn(),
    radio: jest.fn(),
    dropdown: jest.fn(),
  },
  layout: {
    ConfigLayout: (props) => <div>{props.children}</div>,
  },
  InputContainer: (props) => <div>{props.children}</div>,
}));

jest.mock('@pie-lib/editable-html-tip-tap', () => ({
  __esModule: true,
  default: () => <div />,
  ALL_PLUGINS: [],
}));

jest.mock('../ecr-toolbar', () => ({
  __esModule: true,
  default: () => <div />,
}));

jest.mock('../alternateResponses', () => ({
  __esModule: true,
  default: () => <div />,
}));

const mockRender = jest.fn();
const mockUnmount = jest.fn();

jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({
    render: mockRender,
    unmount: mockUnmount,
  })),
}));

const model = {
  markup: '<p>The {{0}} jumped {{1}} the {{2}}</p>',
  choices: {
    0: [{ label: 'cow', value: '0' }],
    1: [{ label: 'over', value: '0' }],
    2: [{ label: 'moon', value: '0' }],
  },
  prompt: 'Complete the sentence',
};

describe('ExplicitConstructedResponse configure index', () => {
  let Def;
  let element;

  beforeAll(() => {
    Def = require('../index').default;

    if (!customElements.get('explicit-constructed-response-configure-test')) {
      customElements.define('explicit-constructed-response-configure-test', Def);
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
    element = document.createElement('explicit-constructed-response-configure-test');
    element.model = model;
  });

  describe('prepareModel', () => {
    it('adds value to choices missing the value property', () => {
      const result = Def.prepareModel({
        choices: {
          0: [{ label: 'test' }],
        },
      });

      expect(result.choices[0][0]).toEqual({ value: '0', label: 'test' });
    });
  });

  describe('onModelChanged', () => {
    it('merges partial updates into the existing model', () => {
      const initialModel = Def.prepareModel(model);
      element._model = initialModel;

      element.onModelChanged({ prompt: 'Updated prompt' });

      expect(element._model.prompt).toBe('Updated prompt');
      expect(element._model.choices).toEqual(initialModel.choices);
      expect(element._model.slateMarkup).toEqual(initialModel.slateMarkup);
    });

    it('dispatches ModelUpdatedEvent with the merged model', () => {
      const dispatchSpy = jest.spyOn(element, 'dispatchEvent');
      const initialModel = Def.prepareModel(model);
      element._model = initialModel;

      element.onModelChanged({ prompt: 'Updated prompt' }, true);

      expect(dispatchSpy).toHaveBeenCalledWith(new ModelUpdatedEvent(element._model, true));
    });

    it('preserves existing fields when receiving partial updates from Main', () => {
      const initialModel = Def.prepareModel(model);
      element._model = initialModel;

      element.onModelChanged({ rationale: 'New rationale' });

      expect(element._model.rationale).toBe('New rationale');
      expect(element._model.prompt).toBe(model.prompt);
      expect(element._model.choices).toEqual(initialModel.choices);
    });
  });

  describe('onConfigurationChanged', () => {
    it('updates responseAreaInputConfiguration on the model', () => {
      const initialModel = Def.prepareModel(model);
      element._model = initialModel;

      const newConfiguration = {
        ...sensibleDefaults.configuration,
        responseAreaInputConfiguration: {
          inputConfiguration: {
            characters: { disabled: false },
          },
        },
      };

      element.onConfigurationChanged(newConfiguration);

      expect(element._model.responseAreaInputConfiguration).toEqual(
        newConfiguration.responseAreaInputConfiguration.inputConfiguration,
      );
      expect(element._model.prompt).toBe(model.prompt);
    });
  });

  describe('set model', () => {
    it('renders the configure view', () => {
      expect(createRoot).toHaveBeenCalled();
      expect(mockRender).toHaveBeenCalled();
    });
  });

  describe('disconnectedCallback', () => {
    it('unmounts the react root', () => {
      element.disconnectedCallback();

      expect(mockUnmount).toHaveBeenCalled();
    });
  });
});
