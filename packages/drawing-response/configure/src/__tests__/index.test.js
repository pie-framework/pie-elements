import React from 'react';
import { createRoot } from 'react-dom/client';

jest.mock('@pie-lib/config-ui', () => ({
  choiceUtils: {
    firstAvailableIndex: jest.fn(),
  },
  settings: {
    Panel: (props) => <div {...props} />,
    toggle: jest.fn(),
    radio: jest.fn(),
    dropdown: jest.fn(),
  },
  layout: {
    ConfigLayout: (props) => <div>{props.children}</div>,
  },
  InputContainer: (props) => <div {...props}>{props.children}</div>,
}));

jest.mock('@pie-lib/editable-html-tip-tap', () => (props) => <div {...props} />);

jest.mock('@mui/material/Typography', () => (props) => <div {...props}>{props.children}</div>);

jest.mock('../image-container', () => (props) => <div {...props} />);

const model = () => ({
  promptEnabled: true,
  prompt: 'This is the question prompt',
  imageUrl: '',
  imageDimensions: {
    height: 0,
    width: 0,
  },
});

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
    // Register the custom element if not already registered
    if (!customElements.get('drawing-response-configure')) {
      customElements.define('drawing-response-configure', Def);
    }
  });

  beforeEach(() => {
    // Create custom element using document.createElement to properly initialize
    el = document.createElement('drawing-response-configure');
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
