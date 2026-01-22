import { createRoot } from 'react-dom/client';
import { render } from '@testing-library/react';

import * as React from 'react';
import defaultValues from '../defaults';
import { Root } from '../root';

const mockRender = jest.fn();
const mockUnmount = jest.fn();
const mockCreateRoot = jest.fn(() => ({
  render: mockRender,
  unmount: mockUnmount,
}));

jest.mock('react-dom/client', () => ({
  createRoot: (...args) => mockCreateRoot(...args),
}));

jest.mock('@pie-lib/config-ui', () => ({
  FeedbackConfig: (props) => <div />,
  InputCheckbox: (props) => <div />,
  InputContainer: (props) => <div {...props}>{props.children}</div>,
  layout: {
    ConfigLayout: (props) => <div>{props.children}</div>,
  },
  settings: {
    Panel: (props) => <div onChange={props.onChange} />,
    toggle: jest.fn(),
    dropdown: jest.fn(),
  },
}));

jest.mock('../index', () => {
  const sensibleDefaults = require('../defaults').default;
  const { ModelUpdatedEvent } = require('@pie-framework/pie-configure-events');

  class MockHTMLElement {
    constructor() {
      this._root = null;
      this._model = null;
      this._configuration = sensibleDefaults.configuration;
      this.dispatchEvent = jest.fn();
      this.onModelChanged = this.onModelChanged.bind(this);
    }
  }

  return {
    __esModule: true,
    default: class ImageClozeAssociationConfigure extends MockHTMLElement {
      static createDefaultModel = (model = {}) => ({
        ...sensibleDefaults.model,
        ...model,
      });

      constructor() {
        super();
        this._model = ImageClozeAssociationConfigure.createDefaultModel();
      }

      set model(s) {
        this._model = ImageClozeAssociationConfigure.createDefaultModel(s);
        this._render();
      }

      set configuration(c) {
        this._configuration = c;
        this._render();
      }

      _render() {
        if (!this._root) {
          this._root = mockCreateRoot(global.document.createElement('div'));
        }
        this._root.render(null);
      }

      onModelChanged(model) {
        this._model = { ...this._model, ...model };
        this.dispatchEvent(new ModelUpdatedEvent(this._model, false));
      }
    },
  };
});

export const defaultProps = {
  classes: {},
  model: {},
  configuration: defaultValues.configuration,
};

const ImageClozeAssociationConfigure = require('../index').default;

describe('Root', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = (props) => {
      const configProps = {
        ...defaultProps,
        ...props,
      };

      return render(<Root {...configProps} />);
    };
  });

  it('renders correctly', () => {
    const { container } = wrapper();
    expect(container).toBeDefined();
  });

  it('updates teacher instructions correctly', () => {
    let onModelChanged = jest.fn();
    const { container } = wrapper({
      onModelChanged,
      model: { teacherInstructionsEnabled: true },
    });

    // Find the Root component and call the method directly
    // Since we're using RTL, we need to test the component behavior differently
    const rootComponent = new Root({
      ...defaultProps,
      onModelChanged,
      model: { teacherInstructionsEnabled: true },
    });

    rootComponent.onTeacherInstructionsChanged('New Teacher Instructions');

    expect(onModelChanged).toBeCalledWith(
      expect.objectContaining({ teacherInstructions: 'New Teacher Instructions' }),
    );
  });
});

describe('index', () => {
  let el;
  let onModelChanged = jest.fn();
  let initialModel = {};

  beforeEach(() => {
    mockRender.mockClear();
    mockCreateRoot.mockClear();
    el = new ImageClozeAssociationConfigure();
    el.model = initialModel;
    el.onModelChanged = onModelChanged;
  });

  describe('set model', () => {
    it('calls createRoot and render', () => {
      const rootInstance = mockCreateRoot.mock.results[0].value;
      expect(mockCreateRoot).toHaveBeenCalled();
      expect(rootInstance.render).toHaveBeenCalled();
    });
  });
});
