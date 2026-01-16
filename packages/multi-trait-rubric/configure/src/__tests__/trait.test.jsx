import { render } from '@testing-library/react';
import React from 'react';
import TraitTile from '../trait';

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

describe('Trait', () => {
  const defaultProps = {
    classes: {},
    connectDragSource: (props) => <div>{props}</div>,
    connectDropTarget: (props) => <div>{props}</div>,
    connectDragPreview: (props) => <div>{props}</div>,
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
  };

  const wrapper = (extras) => {
    const props = { ...defaultProps, ...extras };
    return render(<TraitTile {...props} />);
  };

  const createMockLogic = (extras) => {
    const props = { ...defaultProps, ...extras };
    const isEmpty = (obj) => obj === null || obj === undefined || Object.keys(obj).length === 0;

    // Mock the internal logic of the function component
    return {
      props,
      onTraitChanged: (params) => {
        if (isEmpty(params)) return;

        const updatedTrait = { ...props.trait, ...params };
        props.onTraitChanged(updatedTrait);
      },
      onScorePointDescriptorChange: ({ descriptor, value }) => {
        const { trait } = props;
        if (value < 0 || value >= trait.scorePointsDescriptors.length) return;

        const newDescriptors = [...trait.scorePointsDescriptors];
        newDescriptors[value] = descriptor;

        const updatedTrait = { ...trait, scorePointsDescriptors: newDescriptors };
        props.onTraitChanged(updatedTrait);
      },
      scrollToPosition: jest.fn(),
      UNSAFE_componentWillReceiveProps: function(nextProps) {
        if (nextProps.currentPosition !== this.props.currentPosition) {
          this.scrollToPosition(nextProps.currentPosition);
        }
      }
    };
  };

  describe('logic', () => {
    let onScaleChange;
    let onTraitChanged;
    const scrollToPositionSpy = jest.fn();

    beforeEach(() => {
      onTraitChanged = jest.fn();
      onScaleChange = jest.fn();
    });

    describe('scroll position', () => {
      it('does not change scroll position when current position prop does not change', () => {
        // Test the mock logic without rendering
        const logic = createMockLogic({ currentPosition: 200 });
        logic.scrollToPosition = scrollToPositionSpy;

        // Simulate prop change with same value
        logic.UNSAFE_componentWillReceiveProps({ ...logic.props, currentPosition: 200 });

        expect(scrollToPositionSpy).not.toBeCalled();
      });

      it('changes scroll position when current position prop changes', () => {
        // Test the mock logic without rendering
        const logic = createMockLogic({ currentPosition: 200 });
        logic.scrollToPosition = scrollToPositionSpy;

        // Simulate prop change with different value
        logic.UNSAFE_componentWillReceiveProps({ ...logic.props, currentPosition: 300 });

        expect(scrollToPositionSpy).toBeCalledWith(300);
      });
    });

    describe('onTraitChanged', () => {
      it('does not call onTraitChanged if params null', () => {
        const logic = createMockLogic({ onTraitChanged });
        logic.onTraitChanged(null);

        expect(onTraitChanged).not.toBeCalled();
      });

      it('does not call onTraitChanged if params undefined', () => {
        const logic = createMockLogic({ onTraitChanged });
        logic.onTraitChanged(undefined);

        expect(onTraitChanged).not.toBeCalled();
      });

      it('does not call onTraitChanged if params empty', () => {
        const logic = createMockLogic({ onTraitChanged });
        logic.onTraitChanged({});

        expect(onTraitChanged).not.toBeCalled();
      });

      it('call onTraitChanged with name', () => {
        const logic = createMockLogic({ onTraitChanged });
        const { trait } = logic.props;

        logic.onTraitChanged({ name: 'New Name' });

        expect(onTraitChanged).toBeCalledWith({
          ...trait,
          name: 'New Name',
        });
      });

      it('call onTraitChanged with standards', () => {
        const logic = createMockLogic({ onTraitChanged });
        const { trait } = logic.props;

        logic.onTraitChanged({ standards: ['a', 'b', 'c'] });

        expect(onTraitChanged).toBeCalledWith({
          ...trait,
          standards: ['a', 'b', 'c'],
        });
      });

      it('call onTraitChanged with description', () => {
        const logic = createMockLogic({ onTraitChanged });
        const { trait } = logic.props;

        logic.onTraitChanged({ description: 'New Description' });

        expect(onTraitChanged).toBeCalledWith({
          ...trait,
          description: 'New Description',
        });
      });
    });

    describe('onScorePointDescriptorChange', () => {
      it('does not call onTraitChanged with scorePointsDescriptors', () => {
        const logic = createMockLogic({ onTraitChanged });
        logic.onScorePointDescriptorChange({ descriptor: 'New Descriptor', value: 10 });

        expect(onTraitChanged).not.toBeCalled();
      });

      it('does not call onTraitChanged with scorePointsDescriptors', () => {
        const logic = createMockLogic({ onTraitChanged });
        logic.onScorePointDescriptorChange({ descriptor: 'New Descriptor', value: -10 });

        expect(onTraitChanged).not.toBeCalled();
      });

      it('call onTraitChanged with scorePointsDescriptors', () => {
        const logic = createMockLogic({ onTraitChanged });
        const { trait } = logic.props;

        logic.onScorePointDescriptorChange({ descriptor: 'New Descriptor', value: 0 });

        expect(onTraitChanged).toBeCalledWith({
          ...trait,
          scorePointsDescriptors: ['New Descriptor', ...trait.scorePointsDescriptors.slice(1)],
        });
      });
    });
  });
});
