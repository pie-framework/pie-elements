import { shallow } from 'enzyme';
import React from 'react';
import { TraitsHeaderTile } from '../traitsHeader';

jest.mock('@pie-lib/render-ui', () => ({
  color: {
    text: jest.fn().mockReturnValue('black'),
    secondaryBackground: jest.fn().mockReturnValue('grey'),
    background: jest.fn().mockReturnValue('transparent'),
  }
}));

describe('Trait Header', () => {
  let w;

  const wrapper = extras => {
    const defaults = {
      classes: {},
      onTraitLabelChange: () => {
      },
      onScaleChange: () => {
      },
      scorePointsValues: [0, 1, 2],
      scorePointsLabels: ['A', 'B', 'C'],
      traitLabel: 'Category',
      maxPoints: 2,
      scaleIndex: 0,
      currentPosition: 0,
      showStandards: true,
      showLevelTagInput: true,
      showDescription: true,
      showDeleteScaleModal: true,
      showScorePointLabels: true,
      ...extras
    };
    return shallow(<TraitsHeaderTile {...defaults} />);
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
      w = wrapper({ showDescription: false });

      expect(w).toMatchSnapshot();
    });

    it('renders without score point labels', () => {
      w = wrapper({ showScorePointLabels: false });

      expect(w).toMatchSnapshot();
    });

    it('renders without level tag input', () => {
      w = wrapper({ showLevelTagInput: false });

      expect(w).toMatchSnapshot();
    });

    it('renders without score point values', () => {
      w = wrapper({ scorePointsValues: [] });

      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    let onScaleChange;
    const scrollToPositionSpy = jest.fn();

    beforeEach(() => {
      onScaleChange = jest.fn();
      w = wrapper({ onScaleChange });
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

    describe('onScorePointLabelChange', () => {
      it('does not call onScaleChange with scorePointsLabels if value less than 0', () => {
        w.instance().onScorePointLabelChange({ scorePointLabel: 'New Label', value: -10 });

        expect(onScaleChange).not.toBeCalled();
      });

      it('does not call onScaleChange with scorePointsLabels if value more than length', () => {
        w.instance().onScorePointLabelChange({ scorePointLabel: 'New Label', value: 10 });

        expect(onScaleChange).not.toBeCalled();
      });

      it('call onScaleChange with scorePointsLabels', () => {
        const { scorePointsLabels } = w.instance().props;

        w.instance().onScorePointLabelChange({ scorePointLabel: 'New Label', value: 0 });

        expect(onScaleChange).toBeCalledWith({
          scorePointsLabels: [
            'New Label',
            ...scorePointsLabels.slice(1)
          ]
        });
      });
    });
  });
});
