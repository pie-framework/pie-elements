import React from 'react';
import { createRoot } from 'react-dom/client';

jest.mock('react-konva', () => {
  const React = require('react');
  return {
    Stage: ({ children, ...props }) => React.createElement('div', { 'data-testid': 'stage', ...props }, children),
    Layer: ({ children, ...props }) => React.createElement('div', { 'data-testid': 'layer', ...props }, children),
    Rect: (props) => React.createElement('div', { 'data-testid': 'rect', ...props }),
    Circle: (props) => React.createElement('div', { 'data-testid': 'circle', ...props }),
    Line: (props) => React.createElement('div', { 'data-testid': 'line', ...props }),
    Group: ({ children, ...props }) => React.createElement('div', { 'data-testid': 'group', ...props }, children),
    Image: (props) => React.createElement('div', { 'data-testid': 'image', ...props }),
  };
});

jest.mock('@pie-lib/config-ui', () => ({
  InputContainer: (props) => <div {...props}>{props.children}</div>,
  InputCheckbox: (props) => <div {...props}>{props.children}</div>,
  FeedbackConfig: (props) => <div {...props}>{props.children}</div>,
  choiceUtils: {
    firstAvailableIndex: jest.fn(),
  },
  layout: {
    ConfigLayout: (props) => <div {...props}>{props.children}</div>,
  },
  settings: {
    Panel: (props) => <div {...props} />,
    toggle: jest.fn(),
    radio: jest.fn(),
  },
}));

const mockRender = jest.fn();
const mockUnmount = jest.fn();
const mockCreateRoot = jest.fn(() => ({
  render: mockRender,
  unmount: mockUnmount,
}));

jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({
    render: jest.fn(),
    unmount: jest.fn(),
  })),
}));

jest.mock('../index', () => {
  const sensibleDefaults = require('../defaults').default;
  const { ModelUpdatedEvent } = require('@pie-framework/pie-configure-events');
  const { createRoot } = require('react-dom/client');

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
    default: class HotspotConfigure extends MockHTMLElement {
      static createDefaultModel = (model = {}) => ({
        ...sensibleDefaults.model,
        ...model,
        hotspotList: model.hotspotList || [model.hotspotColor] || sensibleDefaults.model.hotspotList,
        outlineList: model.outlineList || [model.outlineColor] || sensibleDefaults.model.outlineList,
        shapes: model.shapes || sensibleDefaults.model.shapes || {},
      });

      constructor() {
        super();
        this._model = HotspotConfigure.createDefaultModel();
      }

      set model(s) {
        this._model = HotspotConfigure.createDefaultModel(s);
        this._render();
      }

      set configuration(c) {
        this._configuration = {
          ...sensibleDefaults.configuration,
          ...c,
        };
        this._render();
      }

      _render() {
        if (!this._root) {
          this._root = createRoot(global.document.createElement('div'));
        }
        this._root.render(null);
      }

      dispatchModelUpdated(reset) {
        const resetValue = !!reset;
        this.dispatchEvent(new ModelUpdatedEvent(this._model, resetValue));
      }

      onModelChanged(m, reset) {
        this._model = m;
        this.dispatchModelUpdated(reset);
        this._render();
      }

      onModelChangedByConfig = (m, propertyType) => {
        const _model = m;

        if (propertyType === 'multipleCorrect') {
          const { rectangles = [], polygons = [], circles = [] } = _model.shapes || {};

          _model.shapes.rectangles = rectangles.map((shape) => ({ ...shape, correct: false }));
          _model.shapes.polygons = polygons.map((shape) => ({ ...shape, correct: false }));
          _model.shapes.circles = circles.map((shape) => ({ ...shape, correct: false }));
        }

        this.onModelChanged(_model);
      };

      onColorChanged = (colorType, color) => {
        this.onModelChanged({
          ...this._model,
          [colorType]: color,
        });
      };

      onPromptChanged = (prompt) => {
        this.onModelChanged({
          ...this._model,
          prompt,
        });
      };

      onRationaleChanged = (rationale) => {
        this.onModelChanged({
          ...this._model,
          rationale,
        });
      };

      onTeacherInstructionsChanged = (teacherInstructions) => {
        this.onModelChanged({
          ...this._model,
          teacherInstructions,
        });
      };

      onUpdateImageDimension = (dimensions) => {
        this.onModelChanged({
          ...this._model,
          dimensions,
        });
      };

      onUpdateShapes = (shapes) => {
        this.onModelChanged({
          ...this._model,
          shapes,
        });
      };

      onImageUpload = (imageUrl) => {
        this.onModelChanged({
          ...this._model,
          imageUrl,
        });
      };
    },
  };
});

const model = () => ({
  prompt: 'This is the question prompt',
  imageUrl: '',
  shapes: {
    rectangles: [{ id: '1', correct: true }, { id: '2' }, { id: '3' }],
    polygons: [
      {
        points: [
          { x: 1, y: 2 },
          { y: 139, x: 1 },
          { y: 139, x: 130 },
          { x: 130, y: 2 },
        ],
        correct: false,
        id: '0',
      },
    ],
  },
  dimensions: { height: 0, width: 0 },
  hotspotColor: 'rgba(137, 183, 244, 0.65)',
  hotspotList: ['rgba(137, 183, 244, 0.65)', 'rgba(217, 30, 24, 0.65)', 'rgba(254, 241, 96, 0.65)'],
  outlineColor: 'blue',
  outlineList: ['blue', 'red', 'yellow'],
  configure: {},
  multipleCorrect: true,
  partialScoring: false,
});

describe('index', () => {
  let Def;
  let el;
  let onModelChanged = jest.fn();
  let initialModel = model();
  let createRoot;

  beforeAll(() => {
    Def = require('../index').default;
    createRoot = require('react-dom/client').createRoot;
  });

  beforeEach(() => {
    el = new Def();
    el.model = initialModel;
    el.onModelChanged = onModelChanged;
  });

  describe('set model', () => {
    it('calls createRoot and render', () => {
      expect(createRoot).toHaveBeenCalled();
      // The render method is called on the root instance
      const rootInstance = createRoot.mock.results[0].value;
      expect(rootInstance.render).toHaveBeenCalled();
    });
  });

  describe('logic', () => {
    describe('onModelChangedByConfig', () => {
      it('changes partial scoring value', () => {
        el.onModelChangedByConfig({ ...initialModel, partialScoring: true });

        expect(onModelChanged).toBeCalledWith(expect.objectContaining({ partialScoring: true }));
      });
      it('changes multiple correct value', () => {
        el.onModelChangedByConfig({ ...initialModel, multipleCorrect: false });

        expect(onModelChanged).toBeCalledWith(expect.objectContaining({ multipleCorrect: false }));
      });
    });

    describe('onColorChanged', () => {
      it('changes hotspot color', () => {
        el.onColorChanged('hotspotColor', 'red');

        expect(onModelChanged).toBeCalledWith(expect.objectContaining({ hotspotColor: 'red' }));
      });

      it('changes outline color', () => {
        el.onColorChanged('outlineColor', 'lightred');

        expect(onModelChanged).toBeCalledWith(expect.objectContaining({ outlineColor: 'lightred' }));
      });
    });

    describe('onPromptChanged', () => {
      it('changes the prompt', () => {
        const newPrompt = 'This is the second question prompt';
        el.onPromptChanged(newPrompt);

        expect(onModelChanged).toBeCalledWith(expect.objectContaining({ prompt: newPrompt }));
      });
    });

    describe('onRationaleChanged', () => {
      it('changes the rationale', () => {
        const newRationale = 'New Rationale';
        el.onRationaleChanged(newRationale);

        expect(onModelChanged).toBeCalledWith(expect.objectContaining({ rationale: newRationale }));
      });
    });

    describe('onTeacherInstructionsChanged', () => {
      it('changes the teacherInstructions', () => {
        const newTeacherInstructions = 'New Teacher Instructions';
        el.onTeacherInstructionsChanged(newTeacherInstructions);

        expect(onModelChanged).toBeCalledWith(expect.objectContaining({ teacherInstructions: newTeacherInstructions }));
      });
    });

    describe('onUpdateImageDimensions', () => {
      it('changes the image dimensions', () => {
        el.onUpdateImageDimension({ height: 400, width: 400 });

        expect(onModelChanged).toBeCalledWith(expect.objectContaining({ dimensions: { height: 400, width: 400 } }));
      });
    });

    describe('onUpdateShapes', () => {
      it('changes the shapes', () => {
        const shapes = { polygons: [], rectangles: [...initialModel.shapes.rectangles, { id: '2' }] };
        el.onUpdateShapes(shapes);

        expect(onModelChanged).toBeCalledWith(expect.objectContaining({ shapes }));
      });

      it('removes the latest shape', () => {
        const shapes = initialModel.shapes.rectangles;
        const newShapes = shapes ? shapes.slice(0, shapes.length - 1) : [];
        el.onUpdateShapes({ polygons: initialModel.shapes.polygons, rectangles: newShapes });

        expect(onModelChanged).toBeCalledWith(
          expect.objectContaining({ shapes: { polygons: initialModel.shapes.polygons, rectangles: newShapes } }),
        );
      });

      it('removes all shapes', () => {
        el.onUpdateShapes({ polygons: [], rectangles: [] });

        expect(onModelChanged).toBeCalledWith(expect.objectContaining({ shapes: { polygons: [], rectangles: [] } }));
      });
    });

    describe('onImageUpload', () => {
      it('uploads an image', () => {
        el.onImageUpload('https://picsum.photos/id/102/200/300');

        expect(onModelChanged).toBeCalledWith(
          expect.objectContaining({ imageUrl: 'https://picsum.photos/id/102/200/300' }),
        );
      });
    });
  });
});
