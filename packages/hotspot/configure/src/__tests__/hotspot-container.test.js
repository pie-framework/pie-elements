import { render } from '@testing-library/react';
import React from 'react';
import { Container } from '../hotspot-container';
import { getAllShapes, groupShapes } from '../utils';

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
  shapes: groupShapes(
    getAllShapes({
      rectangles: [
        {
          id: '0',
          height: 140,
          width: 130,
          x: 1,
          y: 1,
          correct: true,
        },
        {
          id: '1',
          height: 140,
          width: 130,
          x: 140,
          y: 1,
        },
        {
          id: '2',
          height: 140,
          width: 130,
          x: 280,
          y: 1,
        },
      ],
      polygons: [
        {
          id: '3',
          points: [
            { x: 1, y: 148 },
            { x: 1, y: 288 },
            { y: 288, x: 129 },
            { y: 148, x: 129 },
          ],
          correct: true,
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
        },
      ],
      circles: [
        {
          id: '6',
          radius: 70,
          x: 100,
          y: 100,
          correct: false,
        },
        {
          id: '7',
          radius: 30,
          x: 200,
          y: 150,
          correct: true,
        },
      ],
    }),
  ),
  dimensions: {
    height: 291,
    width: 410,
  },
  hotspotColor: 'rgba(137, 183, 244, 0.65)',
  outlineColor: 'blue',
  multipleCorrect: true,
});

describe('HotspotContainer', () => {
  let w,
    onImageUpload = jest.fn(),
    onUpdateImageDimension = jest.fn(),
    onDeleteShape = jest.fn(),
    onUpdateShapes = jest.fn(),
    initialModel = model();
  beforeEach(() => {
    w = (extras) => {
      const props = {
        classes: {},
        dimensions: initialModel.dimensions,
        imageUrl: initialModel.imageUrl,
        multipleCorrect: initialModel.multipleCorrect,
        hotspotColor: initialModel.hotspotColor,
        outlineColor: initialModel.outlineColor,
        onUpdateImageDimension: onUpdateImageDimension,
        onUpdateShapes: onUpdateShapes,
        onDeleteShape: onDeleteShape,
        onImageUpload: onImageUpload,
        shapes: initialModel.shapes,
        ...extras,
      };

      return render(<Container {...props} />);
    };
  });

  describe('render', () => {
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
        imageUrl: initialModel.imageUrl,
        multipleCorrect: initialModel.multipleCorrect,
        hotspotColor: initialModel.hotspotColor,
        outlineColor: initialModel.outlineColor,
        onUpdateImageDimension: onUpdateImageDimension,
        onUpdateShapes: onUpdateShapes,
        onDeleteShape: onDeleteShape,
        onImageUpload: onImageUpload,
        shapes: initialModel.shapes,
      };
      const instance = new Container(props);

      // Mock setState to execute callback immediately for testing
      instance.setState = jest.fn((state, callback) => {
        Object.assign(instance.state, typeof state === 'function' ? state(instance.state) : state);
        if (callback) callback();
      });

      return instance;
    };

    let formattedShapes = [
      {
        id: '0',
        height: 140,
        width: 130,
        x: 1,
        y: 1,
        correct: true,
        group: 'rectangles',
        index: 0,
      },
      {
        id: '1',
        height: 140,
        width: 130,
        x: 140,
        y: 1,
        group: 'rectangles',
        index: 1,
      },
      {
        id: '2',
        height: 140,
        width: 130,
        x: 280,
        y: 1,
        group: 'rectangles',
        index: 2,
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
        index: 3,
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
        index: 4,
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
        index: 5,
      },
      {
        id: '6',
        radius: 70,
        x: 100,
        y: 100,
        correct: false,
        group: 'circles',
        index: 6,
      },
      {
        id: '7',
        radius: 30,
        x: 200,
        y: 150,
        correct: true,
        group: 'circles',
        index: 7,
      },
    ];

    it('state will contain formatted shapes', () => {
      const instance = createInstance();
      expect(instance.state.shapes).toEqual(expect.arrayContaining(formattedShapes));
    });

    it('onUpdateShapes with new added shape', () => {
      const instance = createInstance();
      const newShape = {
        id: '8',
        height: 140,
        width: 130,
        x: 280,
        y: 1,
        group: 'rectangles',
      };

      instance.onUpdateShapes([...formattedShapes, newShape]);

      expect(onUpdateShapes).toHaveBeenLastCalledWith({
        rectangles: [
          ...initialModel.shapes.rectangles,
          {
            id: '8',
            height: 140,
            width: 130,
            x: 280,
            y: 1,
          },
        ],
        polygons: initialModel.shapes.polygons,
        circles: initialModel.shapes.circles,
      });
    });

    it('onDeleteShape by id', () => {
      const instance = createInstance();
      instance.onDeleteShape('8');
      expect(onUpdateShapes).toHaveBeenCalledWith(
        groupShapes([
          { correct: true, group: 'rectangles', height: 140, id: '0', index: 0, width: 130, x: 1, y: 1 },
          { group: 'rectangles', height: 140, id: '1', index: 1, width: 130, x: 140, y: 1 },
          { group: 'rectangles', height: 140, id: '2', index: 2, width: 130, x: 280, y: 1 },
          {
            correct: true,
            group: 'polygons',
            id: '3',
            index: 3,
            points: [
              { x: 1, y: 148 },
              { x: 1, y: 288 },
              { x: 129, y: 288 },
              { x: 129, y: 148 },
            ],
          },
          {
            correct: false,
            group: 'polygons',
            id: '4',
            index: 4,
            points: [
              { x: 141, y: 151 },
              { x: 141, y: 289 },
              { x: 269, y: 289 },
              { x: 269, y: 151 },
            ],
          },
          {
            correct: false,
            group: 'polygons',
            id: '5',
            index: 5,
            points: [
              { x: 279, y: 150 },
              { x: 279, y: 289 },
              { x: 407, y: 289 },
              { x: 407, y: 150 },
            ],
          },
          {
            id: '6',
            radius: 70,
            x: 100,
            y: 100,
            correct: false,
            group: 'circles',
            index: 6,
          },
          {
            id: '7',
            radius: 30,
            x: 200,
            y: 150,
            correct: true,
            group: 'circles',
            index: 7,
          },
        ]),
      );
    });

    it('onUpdateShapes with no shapes', () => {
      const instance = createInstance();
      instance.onUpdateShapes([]);

      expect(onUpdateShapes).toHaveBeenLastCalledWith({
        rectangles: [],
        polygons: [],
        circles: [],
      });
    });

    it('handleClearAll', () => {
      const instance = createInstance();
      instance.handleClearAll();
      expect(onUpdateShapes).toHaveBeenLastCalledWith({
        rectangles: [],
        polygons: [],
        circles: [],
      });
    });
  });
});
