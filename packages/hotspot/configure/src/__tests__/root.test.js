import { render } from '@testing-library/react';
import React from 'react';
import { Root } from '../root';
import defaultValues from '../defaults';

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
  NumberTextField: (props) => <input type="number" {...props} />,
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
    ConfigLayout: ({ children }) => <div>{children}</div>,
  },
}));

const model = () => ({
  prompt: 'This is the question prompt',
  imageUrl: 'https://cdn.fluence.net/image/0240eb1455ce4c4bb6180232347b6aef_W',
  shapes: {
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
        points: [
          { x: 1, y: 148 },
          { x: 1, y: 288 },
          { y: 288, x: 129 },
          { y: 148, x: 129 },
        ],
        correct: true,
        id: '3',
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
        points: [
          { x: 279, y: 149.99999999999997 },
          { x: 279, y: 289 },
          { x: 407, y: 289 },
          {
            x: 407,
            y: 149.99999999999997,
          },
        ],
        correct: false,
        id: '5',
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
    ],
  },
  dimensions: { height: 300, width: 400 },
  hotspotColor: 'rgba(137, 183, 244, 0.65)',
  hotspotList: ['rgba(137, 183, 244, 0.65)', 'rgba(217, 30, 24, 0.65)', 'rgba(254, 241, 96, 0.65)'],
  outlineColor: 'blue',
  outlineList: ['blue', 'red', 'yellow'],
  configure: {},
  multipleCorrect: true,
  partialScoring: false,
});

describe('Root', () => {
  let initialModel = model();

  describe('render', () => {
    it('renders', () => {
      const props = {
        classes: {},
        configuration: defaultValues.configuration,
        model: initialModel,
      };

      const { container } = render(<Root {...props} />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    let onColorChanged = jest.fn();

    const createInstance = (config, onUpdateImageDimension, onUpdateShapes) => {
      const props = {
        classes: {},
        configuration: config || defaultValues.configuration,
        model: {
          ...initialModel,
          dimensions: { width: 200, height: 300 },
          shapes: {
            rectangles: [{ x: 10, y: 10, height: 100, width: 100 }],
            polygons: [
              {
                points: [
                  { x: 0, y: 200 },
                  { x: 200, y: 200 },
                  { x: 100, y: 300 },
                ],
              },
            ],
          },
        },
        onColorChanged,
        onUpdateImageDimension,
        onUpdateShapes,
      };

      return new Root(props);
    };

    describe('handleColorChange', () => {
      it('calls onColorChanged', () => {
        const instance = createInstance();
        instance.handleColorChange('type', 'color');

        expect(onColorChanged).toHaveBeenLastCalledWith('typeColor', 'color');
      });
    });

    describe('KEEP IMAGE ASPECT RATIO: handleOnUpdateImageDimensions: calls onUpdateImageDimension & onUpdateShapes', () => {
      let onUpdateImageDimension = jest.fn();
      let onUpdateShapes = jest.fn();

      it('increase width with 100%:', () => {
        const instance = createInstance(undefined, onUpdateImageDimension, onUpdateShapes);
        instance.handleOnUpdateImageDimensions(400, 'width');

        expect(onUpdateImageDimension).toBeCalledWith({
          width: 400,
          height: 600,
        });
        expect(onUpdateShapes).toBeCalledWith({
          rectangles: [{ x: 20, y: 20, height: 200, width: 200, index: 0 }],
          polygons: [
            {
              points: [
                { x: 0, y: 400 },
                { x: 400, y: 400 },
                { x: 200, y: 600 },
              ],
              index: 1,
            },
          ],
          circles: [],
        });
      });

      it('decrease width with 50%', () => {
        const instance = createInstance(undefined, onUpdateImageDimension, onUpdateShapes);
        instance.handleOnUpdateImageDimensions(100, 'width');

        expect(onUpdateImageDimension).toBeCalledWith({
          width: 100,
          height: 150,
        });
        expect(onUpdateShapes).toBeCalledWith({
          rectangles: [{ x: 5, y: 5, height: 50, width: 50, index: 0 }],
          polygons: [
            {
              points: [
                { x: 0, y: 100 },
                { x: 100, y: 100 },
                { x: 50, y: 150 },
              ],
              index: 1,
            },
          ],
          circles: [],
        });
      });

      it('increase height with 50%:', () => {
        const instance = createInstance(undefined, onUpdateImageDimension, onUpdateShapes);
        instance.handleOnUpdateImageDimensions(450, 'height');

        expect(onUpdateImageDimension).toBeCalledWith({
          width: 300,
          height: 450,
        });
        expect(onUpdateShapes).toBeCalledWith({
          rectangles: [{ x: 15, y: 15, height: 150, width: 150, index: 0 }],
          polygons: [
            {
              points: [
                { x: 0, y: 300 },
                { x: 300, y: 300 },
                { x: 150, y: 450 },
              ],
              index: 1,
            },
          ],
          circles: [],
        });
      });

      it('decrease height with 10%', () => {
        const instance = createInstance(undefined, onUpdateImageDimension, onUpdateShapes);
        instance.handleOnUpdateImageDimensions(270, 'height');

        expect(onUpdateImageDimension).toBeCalledWith({
          width: 180,
          height: 270,
        });
        expect(onUpdateShapes).toBeCalledWith({
          rectangles: [{ x: 9, y: 9, height: 90, width: 90, index: 0 }],
          polygons: [
            {
              points: [
                { x: 0, y: 180 },
                { x: 180, y: 180 },
                { x: 90, y: 270 },
              ],
              index: 1,
            },
          ],
          circles: [],
        });
      });
    });

    describe('DO NOT KEEP IMAGE ASPECT RATIO: handleOnUpdateImageDimensions: calls onUpdateImageDimension & onUpdateShapes', () => {
      let onUpdateImageDimension = jest.fn();
      let onUpdateShapes = jest.fn();

      it('increase width with 100%:', () => {
        const instance = createInstance(
          {
            ...defaultValues.configuration,
            preserveAspectRatio: {
              enabled: false,
            },
          },
          onUpdateImageDimension,
          onUpdateShapes,
        );
        instance.handleOnUpdateImageDimensions(400, 'width');

        expect(onUpdateImageDimension).toBeCalledWith({
          width: 400,
          height: 300,
        });
        expect(onUpdateShapes).toBeCalledWith({
          rectangles: [{ x: 20, y: 10, height: 100, width: 200, index: 0 }],
          polygons: [
            {
              points: [
                { x: 0, y: 200 },
                { x: 400, y: 200 },
                { x: 200, y: 300 },
              ],
              index: 1,
            },
          ],
          circles: [],
        });
      });

      it('decrease width with 50%', () => {
        const instance = createInstance(
          {
            ...defaultValues.configuration,
            preserveAspectRatio: {
              enabled: false,
            },
          },
          onUpdateImageDimension,
          onUpdateShapes,
        );
        instance.handleOnUpdateImageDimensions(100, 'width');

        expect(onUpdateImageDimension).toBeCalledWith({
          width: 100,
          height: 300,
        });
        expect(onUpdateShapes).toBeCalledWith({
          rectangles: [{ x: 5, y: 10, height: 100, width: 50, index: 0 }],
          polygons: [
            {
              points: [
                { x: 0, y: 200 },
                { x: 100, y: 200 },
                { x: 50, y: 300 },
              ],
              index: 1,
            },
          ],
          circles: [],
        });
      });

      it('increase height with 50%:', () => {
        const instance = createInstance(
          {
            ...defaultValues.configuration,
            preserveAspectRatio: {
              enabled: false,
            },
          },
          onUpdateImageDimension,
          onUpdateShapes,
        );
        instance.handleOnUpdateImageDimensions(450, 'height');

        expect(onUpdateImageDimension).toBeCalledWith({
          width: 200,
          height: 450,
        });
        expect(onUpdateShapes).toBeCalledWith({
          rectangles: [{ x: 10, y: 15, height: 150, width: 100, index: 0 }],
          polygons: [
            {
              index: 1,
              points: [
                { x: 0, y: 300 },
                { x: 200, y: 300 },
                { x: 100, y: 450 },
              ],
            },
          ],
          circles: [],
        });
      });

      it('decrease height with 10%', () => {
        const instance = createInstance(
          {
            ...defaultValues.configuration,
            preserveAspectRatio: {
              enabled: false,
            },
          },
          onUpdateImageDimension,
          onUpdateShapes,
        );
        instance.handleOnUpdateImageDimensions(270, 'height');

        expect(onUpdateImageDimension).toBeCalledWith({
          width: 200,
          height: 270,
        });
        expect(onUpdateShapes).toBeCalledWith({
          rectangles: [{ x: 10, y: 9, height: 90, width: 100, index: 0 }],
          polygons: [
            {
              points: [
                { x: 0, y: 180 },
                { x: 200, y: 180 },
                { x: 100, y: 270 },
              ],
              index: 1,
            },
          ],
          circles: [],
        });
      });
    });
  });
});
