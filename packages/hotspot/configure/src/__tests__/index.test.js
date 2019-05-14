import { shallow } from 'enzyme';
import React from 'react';
import ReactDOM from 'react-dom';

jest.mock('@pie-lib/config-ui', () => ({
  choiceUtils: {
    firstAvailableIndex: jest.fn()
  },
  settings: {
    Panel: props => <div {...props} />,
    toggle: jest.fn(),
    radio: jest.fn()
  }
}));

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

jest.mock('react-dom', () => ({
  render: jest.fn()
}));

describe('index', () => {
  let Def;
  let el;
  let onModelChanged = jest.fn();
  let initialModel = model();

  beforeAll(() => {
    Def = require('../index').default;
  });

  beforeEach(() => {
    el = new Def();
    el.model = initialModel;
    el.onModelChanged = onModelChanged;
  });

  describe('set model', () => {
    it('calls ReactDOM.render', () => {
      expect(ReactDOM.render).toHaveBeenCalled();
    });
  });

  describe('logic', () => {
    describe('onMultipleCorrectChanged', () => {
      it('resets the model', () => {
        el.onMultipleCorrectChanged();

        expect(onModelChanged).toBeCalledWith(
          expect.objectContaining({ multipleCorrect: false }),
        );
      });
    });

    describe('onPartialScoringChanged', () => {
      it('changes partial scoring value', () => {
        el.onPartialScoringChanged();

        expect(onModelChanged).toBeCalledWith(
          expect.objectContaining({ partialScoring: true }),
        );
      });
    });

    describe('undoShape', () => {
      it('removes the latest shape', () => {
        const shapes = initialModel.shapes;
        const newShapes = shapes.slice(0, shapes.length - 1);
        el.onUpdateShapes(newShapes);

        expect(onModelChanged).toBeCalledWith(
          expect.objectContaining({ shapes: newShapes }),
        );
      });
    });

    describe('clearAllShapes', () => {
      it('removes all shapes', () => {
        el.onUpdateShapes([]);

        expect(onModelChanged).toBeCalledWith(
          expect.objectContaining({ shapes: [] }),
        );
      });
    });

    describe('onPromptChanged', () => {
      it('changes the prompt', () => {
        const newPrompt = 'This is the second question prompt';
        el.onPromptChanged(newPrompt);

        expect(onModelChanged).toBeCalledWith(
          expect.objectContaining({ prompt: newPrompt }),
        );
      });
    });

    describe('onColorChanged', () => {
      it('changes hotspot color', () => {
        el.onColorChanged('hotspotColor', 'red');

        expect(onModelChanged).toBeCalledWith(
          expect.objectContaining({ hotspotColor: 'red' }),
        );
      });

      it('changes outline color', () => {
        el.onColorChanged('outlineColor', 'lightred');

        expect(onModelChanged).toBeCalledWith(
          expect.objectContaining({ outlineColor: 'lightred' }),
        );
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

    describe('onUpdateImageDimensions', () => {
      it('changes the image dimensions', () => {
        el.onUpdateImageDimension({height: 400, width: 400});

        expect(onModelChanged).toBeCalledWith(
          expect.objectContaining({dimensions: {height: 400, width: 400}})
        );
      });
    });

    describe('onUpdateShapes', () => {
      it('changes the shapes', () => {
        const shapes = [...initialModel.shapes, {id: '2'}];
        el.onUpdateShapes(shapes);

        expect(onModelChanged).toBeCalledWith(
          expect.objectContaining({shapes})
        );
      });
    });
  });
});
