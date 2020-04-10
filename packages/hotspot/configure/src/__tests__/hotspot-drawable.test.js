import { shallow } from 'enzyme';
import React from 'react';
import { Drawable } from '../hotspot-drawable';

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
      type: 'rectangles'
    }, {
      id: '1',
      height: 140,
      width: 130,
      x: 140,
      y: 1,
      type: 'rectangles'
    }, {
      id: '2',
      height: 140,
      width: 130,
      x: 280,
      y: 1,
      type: 'rectangles'
    },
    {
      id: '3',
      points: [
        { x: 1, y: 148 },
        { x: 1, y: 288 },
        { y: 288, x: 129 },
        { y: 148, x: 129 }],
      correct: true,
      type: 'polygons'
    }, {
      id: '4',
      points: [
        { y: 151, x: 141 },
        { y: 289, x: 141 },
        { y: 289, x: 269 },
        { x: 269, y: 151 }],
      correct: false,
      type: 'polygons'
    }, {
      id: '5',
      points: [
        { x: 279, y: 150 },
        { x: 279, y: 289 },
        { x: 407, y: 289 },
        { x: 407, y: 150 }
      ],
      correct: false,
      type: 'polygons'
    }
  ],
  dimensions: {
    height: 291, width: 410
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
    initialModel = model()
  ;

  beforeEach(() => {
    w = extras => {
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
        ...extras
      };

      return shallow(<Drawable {...props} />);
    }
  });

  describe('render', () => {
    it('renders with default strokeWidth', () => {
      expect(w()).toMatchSnapshot();
    });

    it('renders with given strokeWidth', () => {
      expect(w({ strokeWidth: 10 })).toMatchSnapshot();
    });

    it('renders', () => {
      expect(w()).toMatchSnapshot();
    });

    it('snapshot with padding having a size accordingly to strokeWidth', () => {
      expect(w({ strokeWidth: 100 })).toMatchSnapshot();
    })
  });

  describe('logic', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = w();
    });

    it('handleOnStageClick isDrawing = false', () => {
      wrapper.instance().handleOnStageClick({
        evt: {
          layerX: 20,
          layerY: 30
        }
      });

      expect(onUpdateShapes).toHaveBeenCalledWith([
        ...initialModel.shapes,
        {
          id: '6',
          height: 0,
          width: 0,
          x: 20,
          y: 30,
          type: 'rectangles'
        }
      ]);
    });

    it('handleOnStageClick isDrawing = true', () => {
      wrapper.instance().state.isDrawing = true;
      wrapper.instance().state.stateShapes = initialModel.shapes.slice(0, 2);

      wrapper.instance().handleOnStageClick({
        evt: {
          layerX: 20,
          layerY: 30
        }
      });

      expect(onUpdateShapes).toHaveBeenCalledWith([...initialModel.shapes.slice(0, 2)]);

      // at this point, state.stateShapes is false, so we don't want to update shapes with false (onUpdateShapes)
      expect(wrapper.instance().state.stateShapes).toEqual(false);

      wrapper.instance().handleOnStageClick({
        evt: {
          layerX: 20,
          layerY: 30
        }
      });

      expect(onUpdateShapes).not.toBeCalledWith(false);
    });

    it('handleOnStageClick isDrawing = true', () => {
      wrapper.instance().state.isDrawing = true;
      wrapper.instance().state.stateShapes = initialModel.shapes.slice(0, 2);

      wrapper.instance().handleOnStageClick({});

      expect(onUpdateShapes).toHaveBeenCalledWith(initialModel.shapes.slice(0, 2))
    });

    it('handleOnSetAsCorrect correct', () => {
      wrapper.instance().handleOnSetAsCorrect(
        {
          id: '1'
        }
      );

      expect(onUpdateShapes).toHaveBeenCalledWith([
        initialModel.shapes[0],
        {
          ...initialModel.shapes[1],
          correct: true
        },
        ...initialModel.shapes.slice(2)
      ]);
    });

    it('handleOnSetAsCorrect incorrect', () => {
      wrapper.instance().handleOnSetAsCorrect(
        {
          id: '0'
        }
      );

      expect(onUpdateShapes).toHaveBeenCalledWith([
        {
          ...initialModel.shapes[0],
          correct: false
        },
        ...initialModel.shapes.slice(1)
      ]);
    });

    it('handleOnDragEnd', () => {
      wrapper.instance().handleOnDragEnd('0', { x: 1, y: 1 });

      expect(onUpdateShapes).toHaveBeenCalledWith([
        {
          ...initialModel.shapes[0],
          x: 1,
          y: 1
        },
        ...initialModel.shapes.slice(1)
      ]);
    });

    it('handleOnDragEnd unexistent id', () => {
      wrapper.instance().handleOnDragEnd('10', { x: 1, y: 1 });

      expect(onUpdateShapes).toHaveBeenCalledWith(initialModel.shapes);
    });

  });
});
