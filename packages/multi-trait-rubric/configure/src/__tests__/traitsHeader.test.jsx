import { render } from '@testing-library/react';
import React from 'react';
import { TraitsHeaderTile } from '../traitsHeader';

describe('Trait Header', () => {
  const defaultProps = {
    classes: {},
    onTraitLabelChange: () => {},
    onScaleChange: () => {},
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
    setSecondaryBlockRef: jest.fn(),
    updateMaxPointsFieldValue: jest.fn(),
  };

  const wrapper = (extras) => {
    const props = { ...defaultProps, ...extras };
    return render(<TraitsHeaderTile {...props} />);
  };

  const createInstance = (extras) => {
    const props = { ...defaultProps, ...extras };
    const instance = new TraitsHeaderTile(props);
    instance.setState = jest.fn((state, callback) => {
      Object.assign(instance.state, typeof state === 'function' ? state(instance.state) : state);
      if (callback) callback();
    });
    return instance;
  };

  describe('snapshot', () => {
    it('renders', () => {
      const { container } = wrapper();
      expect(container).toMatchSnapshot();
    });

    it('renders without standards', () => {
      const { container } = wrapper({ showStandards: false });
      expect(container).toMatchSnapshot();
    });

    it('renders without description', () => {
      const { container } = wrapper({ showDescription: false });
      expect(container).toMatchSnapshot();
    });

    it('renders without score point labels', () => {
      const { container } = wrapper({ showScorePointLabels: false });
      expect(container).toMatchSnapshot();
    });

    it('renders without level tag input', () => {
      const { container } = wrapper({ showLevelTagInput: false });
      expect(container).toMatchSnapshot();
    });

    it('renders without score point values', () => {
      const { container } = wrapper({ scorePointsValues: [] });
      expect(container).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    let onScaleChange;
    const scrollToPositionSpy = jest.fn();

    beforeEach(() => {
      onScaleChange = jest.fn();
    });

    describe('scroll position', () => {
      it('does not change scroll position when current position prop does not change', () => {
        const { rerender } = wrapper({ currentPosition: 200 });

        const instance = createInstance({ currentPosition: 200 });
        instance.scrollToPosition = scrollToPositionSpy;

        // Rerender with the same currentPosition
        rerender(<TraitsHeaderTile {...defaultProps} currentPosition={200} />);

        expect(scrollToPositionSpy).not.toBeCalled();
      });

      it('changes scroll position when current position prop changes', () => {
        const { rerender } = wrapper({ currentPosition: 200 });

        const instance = createInstance({ currentPosition: 200 });
        instance.scrollToPosition = scrollToPositionSpy;
        instance.secondaryBlock = { scrollTo: scrollToPositionSpy };

        // Simulate prop change by calling UNSAFE_componentWillReceiveProps
        instance.UNSAFE_componentWillReceiveProps({ ...instance.props, currentPosition: 300 });

        expect(scrollToPositionSpy).toBeCalledWith(300);
      });
    });

    describe('onScorePointLabelChange', () => {
      it('does not call onScaleChange with scorePointsLabels if value less than 0', () => {
        const instance = createInstance({ onScaleChange });
        instance.onScorePointLabelChange({ scorePointLabel: 'New Label', value: -10 });

        expect(onScaleChange).not.toBeCalled();
      });

      it('does not call onScaleChange with scorePointsLabels if value more than length', () => {
        const instance = createInstance({ onScaleChange });
        instance.onScorePointLabelChange({ scorePointLabel: 'New Label', value: 10 });

        expect(onScaleChange).not.toBeCalled();
      });

      it('call onScaleChange with scorePointsLabels', () => {
        const instance = createInstance({ onScaleChange });
        const { scorePointsLabels } = instance.props;

        instance.onScorePointLabelChange({ scorePointLabel: 'New Label', value: 0 });

        expect(onScaleChange).toBeCalledWith({
          scorePointsLabels: ['New Label', ...scorePointsLabels.slice(1)],
        });
      });
    });
  });
});
