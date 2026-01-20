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
    tertiary: jest.fn(() => '#146EB3'),
  },
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
