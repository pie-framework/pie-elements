import { shallow } from 'enzyme';
import React from 'react';

import Root from '../root';

const model = () => ({
  prompt: 'This is the question prompt',
  imageUrl: '',
  shapes: [
    {
      id: '1',
      correct: true
    },
    {
      id: '2'
    },
    {
      id: '3'
    }
  ],
  dimensions: {
    height: 0,
    width: 0
  },
  hotspotColor: 'rgba(137, 183, 244, 0.65)',
  hotspotList: [
    'rgba(137, 183, 244, 0.65)',
    'rgba(217, 30, 24, 0.65)',
    'rgba(254, 241, 96, 0.65)'
  ],
  outlineColor: 'blue',
  outlineList: [
    'blue',
    'red',
    'yellow'
  ],
  configure: {},
  multipleCorrect: true,
  partialScoring: false
});

describe('Root', () => {
  let w;
  let onModelChanged = jest.fn();
  let initialModel = model();
  let modelCopy;

  const wrapper = extras => {
    const defaults = {
      onModelChanged,
      model: model()
    };
    const props = { ...defaults, ...extras };

    return shallow(<Root {...props} />);
  };

  describe('=== HOTSPOT snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });

  //   describe('undoShape', () => {
  //     it('removes the latest shape', () => {
  //       w = wrapper();
  //       w.instance().updateModel({
  //         shapes: initialModel.shapes.slice(1)
  //       });
  //
  //       expect(onModelChanged).toBeCalledWith(
  //         expect.objectContaining({ shapes: initialModel.shapes.slice(1) }),
  //         undefined
  //       );
  //     });
  //   });
  //
  //   describe('clearAllShapes', () => {
  //     it('removes all shapes', () => {
  //       w = wrapper();
  //       w.instance().updateModel({
  //         shapes: []
  //       });
  //
  //       expect(onModelChanged).toBeCalledWith(
  //         expect.objectContaining({ shapes: [] }),
  //         undefined
  //       );
  //     });
  //   });
  //
  //   describe('onPromptChanged', () => {
  //     it('changes the prompt', () => {
  //       w = wrapper();
  //       w.instance().updateModel({
  //         prompt: 'This is the second question prompt'
  //       });
  //
  //       expect(onModelChanged).toBeCalledWith(
  //         expect.objectContaining({ prompt: 'This is the second question prompt' }),
  //         undefined
  //       );
  //     });
  //   });
  //
  //   describe('onColorChanged', () => {
  //     it('changes hotspot color', () => {
  //       w = wrapper();
  //       w.instance().onColorChanged('hotspotColor', 'red');
  //
  //       expect(onModelChanged).toBeCalledWith(
  //         expect.objectContaining({ hotspotColor: 'red' }),
  //         undefined
  //       );
  //     });
  //
  //     it('changes outline color', () => {
  //       w = wrapper();
  //       w.instance().onColorChanged('outlineColor', 'lightred');
  //
  //       expect(onModelChanged).toBeCalledWith(
  //         expect.objectContaining({ outlineColor: 'lightred' }),
  //         undefined
  //       );
  //     });
  //   });
  //
  //   describe('onImageUpload', () => {
  //     it('uploads an image', () => {
  //       w = wrapper();
  //       w.instance().onImageUpload('https://picsum.photos/id/102/200/300');
  //
  //       expect(onModelChanged).toBeCalledWith(
  //         expect.objectContaining({ imageUrl: 'https://picsum.photos/id/102/200/300' }),
  //         undefined
  //       );
  //     });
  //   });
  //
  //   describe('onUpdateImageDimensions', () => {
  //     it('changes the image dimensions', () => {
  //       w = wrapper();
  //       w.instance().onUpdateImageDimension({ height: 400, width: 400 });
  //
  //       expect(onModelChanged).toBeCalledWith(
  //         expect.objectContaining({ dimensions: { height: 400, width: 400 } }),
  //         undefined
  //       );
  //     });
  //   });
  //
  //   describe('onUpdateShapes', () => {
  //     it('changes the shapes', () => {
  //       w = wrapper();
  //       const shapes = [ ...initialModel.shapes, { id: '2' }];
  //       w.instance().onUpdateShapes(shapes);
  //
  //       expect(onModelChanged).toBeCalledWith(
  //         expect.objectContaining({ shapes }),
  //         undefined
  //       );
  //     });
  //   });
  // });
});
