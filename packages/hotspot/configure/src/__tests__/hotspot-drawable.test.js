import { render } from '@testing-library/react';
import React from 'react';
import { Drawable } from '../hotspot-drawable';

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

const model = () => ({
  imageUrl: 'https://cdn.fluence.net/image/0240eb1455ce4c4bb6180232347b6aef_W',
  shapes: [
    {
      id: '0',
      height: 140,
      width: 130,
      x: 1,
      y: 1,
      correct: true,
      group: 'rectangles',
    },
    {
      id: '1',
      height: 140,
      width: 130,
      x: 140,
      y: 1,
      group: 'rectangles',
    },
    {
      id: '2',
      height: 140,
      width: 130,
      x: 280,
      y: 1,
      group: 'rectangles',
    },
    {
      id: '3',
      points: [
        { x: 1, y: 148 },
        { x: 1, y: 288 },
        { y: 288, x: 129 },
        { y: 148, x: 129 },
      ],
      correct: true,
      group: 'polygons',
    },
    {
      id: '4',
      points: [
        { y: 151, x: 141 },
        { y: 289, x: 141 },
        { y: 289, x: 269 },
        { x: 269, y: 151 },
      ],
      correct: false,
      group: 'polygons',
    },
    {
      id: '5',
      points: [
        { x: 279, y: 150 },
        { x: 279, y: 289 },
        { x: 407, y: 289 },
        { x: 407, y: 150 },
      ],
      correct: false,
      group: 'polygons',
    },
  ],
  dimensions: {
    height: 291,
    width: 410,
  },
  hotspotColor: 'rgba(137, 183, 244, 0.65)',
  outlineColor: 'blue',
  multipleCorrect: true,
});

describe('HotspotDrawable', () => {
  let w,
    handleDisableDrag = jest.fn(),
    handleEnableDrag = jest.fn(),
    onUpdateImageDimension = jest.fn(),
    onUpdateShapes = jest.fn(),
    initialModel = model();
  beforeEach(() => {
    w = (extras) => {
      const props = {
        classes: {},
        dimensions: initialModel.dimensions,
        disableDrag: handleDisableDrag,
        enableDrag: handleEnableDrag,
        imageUrl: initialModel.imageUrl,
        hotspotColor: initialModel.hotspotColor,
        multipleCorrect: initialModel.multipleCorrect,
        onUpdateImageDimension: onUpdateImageDimension,
        onUpdateShapes: onUpdateShapes,
        outlineColor: initialModel.outlineColor,
        shapes: initialModel.shapes,
        strokeWidth: 5,
        shapeType: 'rectangle',
        handleFinishDrawing: jest.fn(),
        onDeleteShape: jest.fn(),
        ...extras,
      };

      return render(<Drawable {...props} />);
    };
  });

  describe('render', () => {
    it('renders with default strokeWidth', () => {
      const { container } = w();
      expect(container).toMatchSnapshot();
    });

    it('renders with given strokeWidth', () => {
      const { container } = w({ strokeWidth: 10 });
      expect(container).toMatchSnapshot();
    });

    it('renders', () => {
      const { container } = w();
      expect(container).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    const createInstance = () => {
      const props = {
        classes: {},
        dimensions: initialModel.dimensions,
        disableDrag: handleDisableDrag,
        enableDrag: handleEnableDrag,
        imageUrl: initialModel.imageUrl,
        hotspotColor: initialModel.hotspotColor,
        multipleCorrect: initialModel.multipleCorrect,
        onUpdateImageDimension: onUpdateImageDimension,
        onUpdateShapes: onUpdateShapes,
        outlineColor: initialModel.outlineColor,
        shapes: initialModel.shapes,
        strokeWidth: 5,
        shapeType: 'rectangle',
        handleFinishDrawing: jest.fn(),
        onDeleteShape: jest.fn(),
      };
      return new Drawable(props);
    };

    it('handleOnMouseDown target != Stage', () => {
      const instance = createInstance();
      instance.state.stateShapes = initialModel.shapes;

      const event = {
        target: 'Line',
        currentTarget: 'Stage',
        evt: {
          layerX: 20,
          layerY: 30,
        },
      };

      instance.handleOnMouseDown(event);

      expect(onUpdateShapes).not.toBeCalled();
    });

    it('handleOnMouseDown target = Stage', () => {
      const instance = createInstance();
      const event = {
        target: 'Stage',
        currentTarget: 'Stage',
        evt: {
          layerX: 20,
          layerY: 30,
        },
      };

      instance.handleOnMouseDown(event);

      expect(onUpdateShapes).toHaveBeenCalledWith([
        ...initialModel.shapes,
        {
          id: '6',
          height: 0,
          width: 0,
          x: 20,
          y: 30,
          group: 'rectangles',
          index: 6,
        },
      ]);
    });

    it('handleOnMouseUp isDrawing = true', () => {
      const instance = createInstance();
      instance.state.isDrawing = true;
      instance.state.shapes = initialModel.shapes.slice(0, 2);

      instance.handleOnMouseUp({
        evt: {
          layerX: 20,
          layerY: 30,
        },
      });

      expect(onUpdateShapes).toHaveBeenCalledWith([...initialModel.shapes.slice(0, 2)]);

      // at this point, state.stateShapes is false, so we don't want to update shapes with false (onUpdateShapes)
      expect(instance.state.stateShapes).toEqual(false);

      instance.handleOnMouseUp({
        evt: {
          layerX: 20,
          layerY: 30,
        },
      });

      expect(onUpdateShapes).not.toBeCalledWith(false);

      instance.handleOnMouseUp({});

      expect(onUpdateShapes).toHaveBeenCalledWith(initialModel.shapes.slice(0, 2));
    });

    it('handleOnSetAsCorrect correct', () => {
      const instance = createInstance();
      instance.handleOnSetAsCorrect({
        id: '1',
      });

      expect(onUpdateShapes).toHaveBeenCalledWith([
        initialModel.shapes[0],
        {
          ...initialModel.shapes[1],
          correct: true,
        },
        ...initialModel.shapes.slice(2),
      ]);
    });

    it('handleOnSetAsCorrect incorrect', () => {
      const instance = createInstance();
      instance.handleOnSetAsCorrect({
        id: '0',
      });

      expect(onUpdateShapes).toHaveBeenCalledWith([
        {
          ...initialModel.shapes[0],
          correct: false,
        },
        ...initialModel.shapes.slice(1),
      ]);
    });

    it('handleOnDragEnd', () => {
      const instance = createInstance();
      instance.handleOnDragEnd('0', { x: 1, y: 1 });

      expect(onUpdateShapes).toHaveBeenCalledWith([
        {
          ...initialModel.shapes[0],
          x: 1,
          y: 1,
        },
        ...initialModel.shapes.slice(1),
      ]);
    });

    it('handleOnDragEnd unexistent id', () => {
      const instance = createInstance();
      instance.handleOnDragEnd('10', { x: 1, y: 1 });

      expect(onUpdateShapes).toHaveBeenCalledWith(initialModel.shapes);
    });
  });
});
