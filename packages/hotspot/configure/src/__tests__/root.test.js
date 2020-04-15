import { shallow } from 'enzyme';
import React from 'react';
import { Root } from '../root';
import defaultValues from '../defaults';

jest.mock('@pie-lib/config-ui', () => ({
  choiceUtils: {
    firstAvailableIndex: jest.fn()
  },
  settings: {
    Panel: props => <div {...props} />,
    toggle: jest.fn(),
    radio: jest.fn()
  },
  layout: {
    ConfigLayout: ({ children }) => <div>{children}</div>
  }
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
        correct: true
      }, {
        id: '1',
        height: 140,
        width: 130,
        x: 140,
        y: 1
      }, {
        id: '2',
        height: 140,
        width: 130,
        x: 280,
        y: 1
      }
    ],
    polygons: [
      {
        points: [{ x: 1, y: 148 }, { x: 1, y: 288 }, { y: 288, x: 129 }, { y: 148, x: 129 }],
        correct: true,
        id: '3'
      }, {
        id: '4',
        points: [{ y: 151, x: 141 }, { y: 289, x: 141 }, { y: 289, x: 269 }, { x: 269, y: 151 }],
        correct: false
      }, {
        points: [{ x: 279, y: 149.99999999999997 }, { x: 279, y: 289 }, { x: 407, y: 289 }, {
          x: 407,
          y: 149.99999999999997
        }], correct: false, id: '5'
      }]
  },
  dimensions: { height: 300, width: 400 },
  hotspotColor: 'rgba(137, 183, 244, 0.65)',
  hotspotList: [
    'rgba(137, 183, 244, 0.65)',
    'rgba(217, 30, 24, 0.65)',
    'rgba(254, 241, 96, 0.65)'
  ],
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

      expect(shallow(<Root {...props} />)).toMatchSnapshot();
    })
  });

  describe('logic', () => {
    let w, onColorChanged = jest.fn();

    beforeEach(() => {
      w = (config, onUpdateImageDimension, onUpdateShapes) => {
        const props = {
          classes: {},
          configuration: config || defaultValues.configuration,
          model: {
            ...initialModel,
            dimensions: { width: 200, height: 300 },
            shapes: {
              rectangles: [{ x: 10, y: 10, height: 100, width: 100 }],
              polygons: [{
                points: [{ x: 0, y: 200 }, { x: 200, y: 200 }, { x: 100, y: 300 }]
              }]
            }
          },
          onColorChanged,
          onUpdateImageDimension,
          onUpdateShapes,
        };

        return shallow(<Root {...props} />);
      }
    });

    describe('handleColorChange', () => {
      it('calls onColorChanged', () => {
        let wrapper = w();
        wrapper.instance().handleColorChange('type', 'color');

        expect(onColorChanged).toHaveBeenLastCalledWith('typeColor', 'color');
      });
    });

    describe('KEEP IMAGE ASPECT RATIO: handleOnUpdateImageDimensions: calls onUpdateImageDimension & onUpdateShapes', () => {
      let wrapper;
      let onUpdateImageDimension = jest.fn();
      let onUpdateShapes = jest.fn();

      beforeEach(() => {
        wrapper = w(undefined, onUpdateImageDimension, onUpdateShapes);
      });

      it('increase width with 100%:', () => {
        wrapper.instance().handleOnUpdateImageDimensions(400, 'width');

        expect(onUpdateImageDimension).toBeCalledWith({
          width: 400,
          height: 600
        });
        expect(onUpdateShapes).toBeCalledWith({
          rectangles: [{ x: 20, y: 20, height: 200, width: 200 }],
          polygons: [{
            points: [{ x: 0, y: 400 }, { x: 400, y: 400 }, { x: 200, y: 600 }]
          }]
        });
      });

      it('decrease width with 50%', () => {
        wrapper.instance().handleOnUpdateImageDimensions(100, 'width');

        expect(onUpdateImageDimension).toBeCalledWith({
          width: 100,
          height: 150
        });
        expect(onUpdateShapes).toBeCalledWith({
          rectangles: [{ x: 5, y: 5, height: 50, width: 50 }],
          polygons: [{
            points: [{ x: 0, y: 100 }, { x: 100, y: 100 }, { x: 50, y: 150 }]
          }]
        });
      });

      it('increase height with 50%:', () => {
        wrapper.instance().handleOnUpdateImageDimensions(450, 'height');

        expect(onUpdateImageDimension).toBeCalledWith({
          width: 300,
          height: 450
        });
        expect(onUpdateShapes).toBeCalledWith({
          rectangles: [{ x: 15, y: 15, height: 150, width: 150 }],
          polygons: [{
            points: [{ x: 0, y: 300 }, { x: 300, y: 300 }, { x: 150, y: 450 }]
          }]
        });
      });

      it('decrease height with 10%', () => {
        wrapper.instance().handleOnUpdateImageDimensions(270, 'height');

        expect(onUpdateImageDimension).toBeCalledWith({
          width: 180,
          height: 270
        });
        expect(onUpdateShapes).toBeCalledWith({
          rectangles: [{ x: 9, y: 9, height: 90, width: 90 }],
          polygons: [{
            points: [{ x: 0, y: 180 }, { x: 180, y: 180 }, { x: 90, y: 270 }]
          }]
        });
      });
    });

    describe('DO NOT KEEP IMAGE ASPECT RATIO: handleOnUpdateImageDimensions: calls onUpdateImageDimension & onUpdateShapes', () => {
      let wrapper;
      let onUpdateImageDimension = jest.fn();
      let onUpdateShapes = jest.fn();

      beforeEach(() => {
        wrapper = w({
          ...defaultValues.configuration,
          preserveAspectRatio: {
            enabled: false
          }
        }, onUpdateImageDimension, onUpdateShapes);
      });

      it('increase width with 100%:', () => {
        wrapper.instance().handleOnUpdateImageDimensions(400, 'width');

        expect(onUpdateImageDimension).toBeCalledWith({
          width: 400,
          height: 300
        });
        expect(onUpdateShapes).toBeCalledWith({
          rectangles: [{ x: 20, y: 10, height: 100, width: 200 }],
          polygons: [{
            points: [{ x: 0, y: 200 }, { x: 400, y: 200 }, { x: 200, y: 300 }]
          }]
        });
      });

      it('decrease width with 50%', () => {
        wrapper.instance().handleOnUpdateImageDimensions(100, 'width');

        expect(onUpdateImageDimension).toBeCalledWith({
          width: 100,
          height: 300
        });
        expect(onUpdateShapes).toBeCalledWith({
            rectangles: [{ x: 5, y: 10, height: 100, width: 50 }],
            polygons: [{
              points: [{ x: 0, y: 200 }, { x: 100, y: 200 }, { x: 50, y: 300 }]
            }]
          }
        );
      });

      it('increase height with 50%:', () => {
        wrapper.instance().handleOnUpdateImageDimensions(450, 'height');

        expect(onUpdateImageDimension).toBeCalledWith({
          width: 200,
          height: 450
        });
        expect(onUpdateShapes).toBeCalledWith({
            rectangles: [{ x: 10, y: 15, height: 150, width: 100 }],
            polygons: [{
              points: [{ x: 0, y: 300 }, { x: 200, y: 300 }, { x: 100, y: 450 }]
            }]
          }
        );
      });

      it('decrease height with 10%', () => {
        wrapper.instance().handleOnUpdateImageDimensions(270, 'height');

        expect(onUpdateImageDimension).toBeCalledWith({
          width: 200,
          height: 270
        });
        expect(onUpdateShapes).toBeCalledWith({
            rectangles: [{ x: 10, y: 9, height: 90, width: 100 }],
            polygons: [{
              points: [{ x: 0, y: 180 }, { x: 200, y: 180 }, { x: 100, y: 270 }]
            }]
          }
        );
      });
    });
  });
});
