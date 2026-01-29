import React from 'react';
import { createRoot } from 'react-dom/client';

import defaults from '../defaults';

jest.mock('@pie-lib/config-ui', () => ({
  settings: {
    Panel: (props) => <div {...props} />,
    toggle: jest.fn(),
    radio: jest.fn(),
  },
}));

jest.mock('@pie-lib/render-ui', () => ({
  color: {
    text: jest.fn(() => '#000000'),
    background: jest.fn(() => '#ffffff'),
    primaryLight: jest.fn(() => '#e3f2fd'),
    primary: jest.fn(() => '#1976d2'),
    secondary: jest.fn(() => '#888'),
    tertiary: jest.fn(() => '#146EB3'),
    disabled: jest.fn(() => '#999999'),
    correct: jest.fn(() => '#00c853'),
    incorrect: jest.fn(() => '#d32f2f'),
  },
  Collapsible: (props) => <div data-testid="collapsible">{props.children}</div>,
  Readable: (props) => <div data-testid="readable">{props.children}</div>,
  Feedback: (props) => <div data-testid="feedback">{props.children}</div>,
  PreviewPrompt: (props) => <div data-testid="preview-prompt">{props.children}</div>,
  UiLayout: (props) => <div data-testid="ui-layout">{props.children}</div>,
  hasText: jest.fn(),
  hasMedia: jest.fn(),
}));

jest.mock('@pie-element/rubric/configure/lib', () => {
  class MockRubricConfigure {
    constructor() {}
  }
  return MockRubricConfigure;
});

jest.mock('@pie-element/multi-trait-rubric/configure/lib', () => {
  class MockMultiTraitRubricConfigure {
    constructor() {}
  }
  return MockMultiTraitRubricConfigure;
});

const model = () => ({ ...defaults.model });

const mockRender = jest.fn();
const mockUnmount = jest.fn();
jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({
    render: mockRender,
    unmount: mockUnmount,
  })),
}));

describe('index', () => {
  let Def;
  let el;
  let onModelChanged = jest.fn();
  let initialModel = model();

  beforeAll(() => {
    Def = require('../index').default;
    // Register the custom element for testing
    if (!customElements.get('complex-rubric-configure-test')) {
      customElements.define('complex-rubric-configure-test', Def);
    }
  });

  beforeEach(() => {
    el = document.createElement('complex-rubric-configure-test');
    el.model = initialModel;
    el.onModelChanged = onModelChanged;
  });

  describe('set model', () => {
    it('calls ReactDOM.render', () => {
      expect(createRoot).toHaveBeenCalled();
      expect(mockRender).toHaveBeenCalled();
    });
  });
});
