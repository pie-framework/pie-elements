import { shallow } from 'enzyme';
import React from 'react';
import { Container } from '../hotspot-container';
import { getAllShapes, groupShapes } from '../utils';

const model = () => ({
  imageUrl: 'https://cdn.fluence.net/image/0240eb1455ce4c4bb6180232347b6aef_W',
  shapes: groupShapes(getAllShapes({
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
        id: '3',
        points: [{ x: 1, y: 148 }, { x: 1, y: 288 }, { y: 288, x: 129 }, { y: 148, x: 129 }],
        correct: true
      }, {
        id: '4',
        points: [{ y: 151, x: 141 }, { y: 289, x: 141 }, { y: 289, x: 269 }, { x: 269, y: 151 }],
        correct: false
      }, {
        id: '5',
        points: [{ x: 279, y: 150 }, { x: 279, y: 289 }, { x: 407, y: 289 }, { x: 407, y: 150 }],
        correct: false
      }]
  })),
  dimensions: {
    height: 291, width: 410
  },
  hotspotColor: 'rgba(137, 183, 244, 0.65)',
  outlineColor: 'blue',
  multipleCorrect: true
});

describe('HotspotContainer', () => {
  let w,
    onImageUpload = jest.fn(),
    onUpdateImageDimension = jest.fn(),
    onUpdateShapes = jest.fn(),
    initialModel = model()
  ;

  beforeEach(() => {
    w = extras => {
      const props = {
        classes: {},
        dimensions: initialModel.dimensions,
        imageUrl: initialModel.imageUrl,
        multipleCorrect: initialModel.multipleCorrect,
        hotspotColor: initialModel.hotspotColor,
        outlineColor: initialModel.outlineColor,
        onUpdateImageDimension: onUpdateImageDimension,
        onUpdateShapes: onUpdateShapes,
        onImageUpload: onImageUpload,
        shapes: initialModel.shapes,
        ...extras
      };

      return shallow(<Container {...props} />);
    }
  });

  describe('render', () => {
    it('renders', () => {
      expect(w()).toMatchSnapshot();
    })
  });

  describe('logic', () => {
    let wrapper;
    let formattedShapes = [
      {
        id: '0',
        height: 140,
        width: 130,
        x: 1,
        y: 1,
        correct: true,
        group: 'rectangles',
        index: 0
      }, {
        id: '1',
        height: 140,
        width: 130,
        x: 140,
        y: 1,
        group: 'rectangles',
        index: 1
      }, {
        id: '2',
        height: 140,
        width: 130,
        x: 280,
        y: 1,
        group: 'rectangles',
        index: 2
      },
      {
        id: '3',
        points: [
          { x: 1, y: 148 },
          { x: 1, y: 288 },
          { y: 288, x: 129 },
          { y: 148, x: 129 }],
        correct: true,
        group: 'polygons',
        index: 3
      }, {
        id: '4',
        points: [
          { y: 151, x: 141 },
          { y: 289, x: 141 },
          { y: 289, x: 269 },
          { x: 269, y: 151 }],
        correct: false,
        group: 'polygons',
        index: 4
      }, {
        id: '5',
        points: [
          { x: 279, y: 150 },
          { x: 279, y: 289 },
          { x: 407, y: 289 },
          { x: 407, y: 150 }
        ],
        correct: false,
        group: 'polygons',
        index: 5
      }
    ];

    beforeEach(() => {
      wrapper = w();
    });

    it('state will contain formatted shapes', () => {
      expect(wrapper.instance().state.shapes).toEqual(expect.arrayContaining(formattedShapes));
    });

    it('onUpdateShapes with new added shape', () => {
      const newShape = {
        id: '7',
        height: 140,
        width: 130,
        x: 280,
        y: 1,
        group: 'rectangles'
      };

      wrapper.instance().onUpdateShapes([...formattedShapes, newShape]);

      expect(onUpdateShapes).toHaveBeenLastCalledWith({
        rectangles: [
          ...initialModel.shapes.rectangles,
          {
            id: '7',
            height: 140,
            width: 130,
            x: 280,
            y: 1,
          }
        ],
        polygons: initialModel.shapes.polygons
      })
    });

    it('onUpdateShapes with no shapes', () => {
      wrapper.instance().onUpdateShapes([]);

      expect(onUpdateShapes).toHaveBeenLastCalledWith({
        rectangles: [],
        polygons: []
      })
    });

    it('handleUndo if no new shape was added', () => {
      wrapper.instance().handleUndo();
      expect(onUpdateShapes).toHaveBeenLastCalledWith({
        ...initialModel.shapes,
        polygons: initialModel.shapes.polygons.slice(0, -1)
      });
    });

    it('handleUndo if new shape was added', () => {
      const newShape = {
        id: '7',
        height: 140,
        width: 130,
        x: 280,
        y: 1,
        index: 6
      };

      // first, add a new shape
      wrapper.instance().state.shapes = getAllShapes({
        ...initialModel.shapes,
        rectangles: [ ...initialModel.shapes.rectangles, newShape],
      });
      wrapper.instance().handleUndo();
      expect(onUpdateShapes).toBeCalledWith(initialModel.shapes);
    });

    it('handleClearAll', () => {
      wrapper.instance().handleClearAll();
      expect(onUpdateShapes).toHaveBeenLastCalledWith({
        rectangles: [],
        polygons: []
      });
    });
  });
});
