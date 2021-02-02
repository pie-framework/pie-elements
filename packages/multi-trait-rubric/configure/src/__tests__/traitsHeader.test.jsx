import { shallow } from 'enzyme';
import React from 'react';
import { TraitsHeaderTile } from '../traitsHeader';
import PropTypes from "prop-types";

describe('Trait', () => {
  let w;

  const wrapper = extras => {
    const defaults = {
      classes: {},
      onTraitLabelChange: () => {},
      onScaleChange: () => {},
      scorePointsValues: [0, 1, 2],
      scorePointsLabels: ['A', 'B', 'C'],
      traitLabel: 'Category',
      showStandards: true,
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
  });

  describe('logic', () => {
    let onScaleChange;

    beforeEach(() => {
      onScaleChange = jest.fn();
      w = wrapper({ onScaleChange });
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
