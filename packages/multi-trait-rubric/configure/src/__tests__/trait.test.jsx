import { shallow } from 'enzyme';
import React from 'react';
import { TraitTile } from '../trait';

const trait = () => ({
  name: 'Presentation',
  standards: [],
  description: '',
  scorePointsDescriptors: [
    'Handwriting is unreadable, or response is blank, not in English, or too brief to evaluate. ',
    'Handwriting poor\n' + '\n' + 'Overall appearance is distracting to unacceptable',
    'Handwriting is generally legible\n' + '\n' + 'Overall appearance is acceptable or better',
  ],
});

jest.mock('@pie-lib/render-ui', () => ({
  color: {
    text: jest.fn().mockReturnValue('black'),
    secondaryBackground: jest.fn().mockReturnValue('grey'),
  }
}));

describe('Trait', () => {
  let w;

  const wrapper = extras => {
    const defaults = {
      classes: {},
      connectDragSource: props => <div>{props}</div>,
      connectDropTarget: props => <div>{props}</div>,
      trait: trait(),
      index: 0,
      scorePointsValues: [0, 1, 2],
      scorePointsLabels: ['A', 'B', 'C'],
      traitLabel: 'Category',
      maxPoints: 2,
      scaleIndex: 0,
      currentPosition: 0,
      showStandards: true,
      showDescription: true,
      ...extras
    };
    return shallow(<TraitTile {...defaults} />);
  };

  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();

      expect(w).toMatchSnapshot();
    });

    it('renders without standards', () => {
      w = wrapper({ showStandards: false });

      expect(w).toMatchSnapshot();
    });

    it('renders without description', () => {
      w = wrapper({ description: false });

      expect(w).toMatchSnapshot();
    });

    it('renders with drag and drop', () => {
      w = wrapper({ dragAndDrop: true });

      expect(w).toMatchSnapshot();
    });

    it('renders without score points values', () => {
      w = wrapper({ scorePointsValues: [] });

      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    let onScaleChange;
    let onTraitChanged;
    const scrollToPositionSpy = jest.fn();

    beforeEach(() => {
      onTraitChanged = jest.fn();
      onScaleChange = jest.fn();
      w = wrapper({ onScaleChange, onTraitChanged });
    });

    describe('scroll position', () => {
      it ('does not change scroll position when current position prop does not change', () => {
        const wrap = wrapper({ currentPosition: 200 });

        expect(wrap.instance().props.currentPosition).toEqual(200);

        wrap.instance().scrollToPosition = scrollToPositionSpy;
        wrap.setProps({ currentPosition: 200 });

        expect(scrollToPositionSpy).not.toBeCalled();
      });

      it ('changes scroll position when current position prop changes', () => {
        const wrap = wrapper({ currentPosition: 200 });

        expect(wrap.instance().props.currentPosition).toEqual(200);

        wrap.instance().scrollToPosition = scrollToPositionSpy;
        wrap.setProps({ currentPosition: 300 });

        expect(scrollToPositionSpy).toBeCalledWith(300);
      });
    });

    describe('onTraitChanged', () => {
      it('does not call onTraitChanged if params null', () => {
        const { trait } = w.instance().props;

        w.instance().onTraitChanged(null);

        expect(onTraitChanged).not.toBeCalled();
      });

      it('does not call onTraitChanged if params undefined', () => {
        const { trait } = w.instance().props;

        w.instance().onTraitChanged(undefined);

        expect(onTraitChanged).not.toBeCalled();
      });

      it('does not call onTraitChanged if params empty', () => {
        w.instance().onTraitChanged({});

        expect(onTraitChanged).not.toBeCalled();
      });

      it('call onTraitChanged with name', () => {
        const { trait } = w.instance().props;

        w.instance().onTraitChanged({ name: 'New Name' });

        expect(onTraitChanged).toBeCalledWith({
          ...trait,
          name: 'New Name'
        });
      });

      it('call onTraitChanged with standards', () => {
        const { trait } = w.instance().props;

        w.instance().onTraitChanged({ standards: ['a', 'b', 'c'] });

        expect(onTraitChanged).toBeCalledWith({
          ...trait,
          standards: ['a', 'b', 'c']
        });
      });

      it('call onTraitChanged with description', () => {
        const { trait } = w.instance().props;

        w.instance().onTraitChanged({ description: 'New Description' });

        expect(onTraitChanged).toBeCalledWith({
          ...trait,
          description: 'New Description'
        });
      });
    });

    describe('onScorePointDescriptorChange', () => {
      it('does not call onTraitChanged with scorePointsDescriptors', () => {
        w.instance().onScorePointDescriptorChange({ descriptor: 'New Descriptor', value: 10 });

        expect(onTraitChanged).not.toBeCalled();
      });

      it('does not call onTraitChanged with scorePointsDescriptors', () => {
        w.instance().onScorePointDescriptorChange({ descriptor: 'New Descriptor', value: -10 });

        expect(onTraitChanged).not.toBeCalled();
      });

      it('call onTraitChanged with scorePointsDescriptors', () => {
        const { trait } = w.instance().props;

        w.instance().onScorePointDescriptorChange({ descriptor: 'New Descriptor', value: 0 });

        expect(onTraitChanged).toBeCalledWith({
          ...trait,
          scorePointsDescriptors: [
            'New Descriptor',
            ...trait.scorePointsDescriptors.slice(1)
          ]
        });
      });
    });
  });
});
