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
        'id': '0',
        'height': 140,
        'width': 130,
        'x': 1,
        'y': 1,
        correct: true
      }, {
        'id': '1',
        'height': 140,
        'width': 130,
        'x': 140,
        'y': 1
      }, {
        'id': '2',
        'height': 140,
        'width': 130,
        'x': 280,
        'y': 1
      }
    ],
    polygons: [
      {
        'points': [{ 'x': 1, 'y': 148 }, { 'x': 1, 'y': 288 }, { 'y': 288, 'x': 129 }, { 'y': 148, 'x': 129 }],
        'correct': true,
        'id': '3'
      }, {
        'id': '4',
        'points': [{ 'y': 151, 'x': 141 }, { 'y': 289, 'x': 141 }, { 'y': 289, 'x': 269 }, { 'x': 269, 'y': 151 }],
        'correct': false
      }, {
        'points': [{ 'x': 279, 'y': 149.99999999999997 }, { 'x': 279, 'y': 289 }, { 'x': 407, 'y': 289 }, {
          'x': 407,
          'y': 149.99999999999997
        }], 'correct': false, 'id': '5'
      }]
  },
  dimensions: {
    height: 291, width: 410
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
  let w,
    onColorChanged = jest.fn(),
    onImageUpload = jest.fn(),
    onUpdateImageDimension = jest.fn(),
    onConfigurationChanged = jest.fn(),
    onPromptChanged = jest.fn(),
    onRationaleChanged = jest.fn(),
    onUpdateShapes = jest.fn(),
    onModelChangedByConfig = jest.fn(),
    onTeacherInstructionsChanged = jest.fn(),
    initialModel = model()
  ;

  beforeEach(() => {
    w = extras => {
      const props = {
        classes: {},
        configuration: defaultValues.configuration,
        model: initialModel,
        onColorChanged,
        onImageUpload,
        onUpdateImageDimension,
        onConfigurationChanged,
        onPromptChanged,
        onRationaleChanged,
        onUpdateShapes,
        onModelChangedByConfig,
        onTeacherInstructionsChanged,
        ...extras
      };

      return shallow(<Root {...props} />);
    }
  });

  describe('render', () => {
    it('renders', () => {
      expect(w()).toMatchSnapshot();
    })
  });

  describe('logic', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = w();
    });

    it('calls onColorChanged', () => {
      wrapper.instance().handleColorChange('type', 'color');

      expect(onColorChanged).toHaveBeenLastCalledWith('typeColor', 'color');
    });

    it('calls onUpdateImageDimension', () => {
      wrapper.instance().handleOnUpdateImageDimensions('value', 'type');

      expect(onUpdateImageDimension).toHaveBeenLastCalledWith({
        ...initialModel.dimensions,
        type: 'value'
      });
    });
  });
});
