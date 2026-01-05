import { render } from '@testing-library/react';
import React from 'react';
import { Scale } from '../scale';

const scale = () => ({
  excludeZero: false,
  maxPoints: 2,
  scorePointsLabels: ['Non-Scorable', 'Unsatisfactory', 'Satisfactory'],
  traitLabel: 'Category',
  traits: [
    {
      name: 'Presentation',
      standards: [],
      description: '',
      scorePointsDescriptors: [
        'Handwriting is unreadable, or response is blank, not in English, or too brief to evaluate. ',
        'Handwriting poor\n' + '\n' + 'Overall appearance is distracting to unacceptable',
        'Handwriting is generally legible\n' + '\n' + 'Overall appearance is acceptable or better',
      ],
    },
  ],
});

describe('Scale', () => {
  const defaultProps = {
    classes: {},
    scale: scale(),
    scaleIndex: 0,
    showStandards: true,
  };

  const wrapper = (extras) => {
    const props = { ...defaultProps, ...extras };
    return render(<Scale {...props} />);
  };

  const createInstance = (extras) => {
    const props = { ...defaultProps, ...extras };
    const instance = new Scale(props);
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

    it('renders without traits', () => {
      const { container } = wrapper({ traits: [] });
      expect(container).toMatchSnapshot();
    });

    it('renders without standards', () => {
      const { container } = wrapper({ showStandards: false });
      expect(container).toMatchSnapshot();
    });

    it('renders without descriptions', () => {
      const { container } = wrapper({ showDescription: false });
      expect(container).toMatchSnapshot();
    });

    it('renders with drag and drop enabled', () => {
      const { container } = wrapper({ dragAndDrop: true });
      expect(container).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    let onScaleChanged;

    beforeEach(() => {
      onScaleChanged = jest.fn();
    });

    describe('updateMaxPointsFieldValue', () => {
      it('shows alert box is number less then max points', () => {
        const instance = createInstance({ onScaleChanged });
        const { maxPoints } = instance.props.scale;

        instance.updateMaxPointsFieldValue({ target: { value: maxPoints - 1 } });

        expect(instance.state.newMaxPoints).toEqual(maxPoints - 1);
      });

      it('changes max points if number more then max points', () => {
        const instance = createInstance({ onScaleChanged });
        const { maxPoints } = instance.props.scale;

        instance.updateMaxPointsFieldValue({ target: { value: maxPoints + 1 } });

        expect(onScaleChanged).toBeCalledWith(0, { maxPoints: maxPoints + 1 });
      });
    });

    describe('changeMaxPoints', () => {
      it('removes zero', () => {
        const instance = createInstance({ onScaleChanged });
        instance.setState({ newMaxPoints: 10 });
        instance.changeMaxPoints();

        expect(onScaleChanged).toBeCalledWith(0, { maxPoints: 10 });
      });
    });

    describe('deleteScale', () => {
      it('calls onRemoveScale', () => {
        const onScaleRemoved = jest.fn();
        const instance = createInstance({ onScaleRemoved });
        instance.deleteScale();

        expect(onScaleRemoved).toBeCalledWith(0);
      });
    });

    describe('onTraitRemoved', () => {
      it('does not call onScaleChanged if index less than zero', () => {
        const instance = createInstance({ onScaleChanged });
        instance.setState({ traitToDeleteIndex: -1 });
        instance.onTraitRemoved();

        expect(onScaleChanged).not.toBeCalled();
      });

      it('does not call onScaleChanged if index more than length', () => {
        const instance = createInstance({ onScaleChanged });
        instance.setState({ traitToDeleteIndex: 100 });
        instance.onTraitRemoved();

        expect(onScaleChanged).not.toBeCalled();
      });

      it('calls onScaleChanged', () => {
        const instance = createInstance({ onScaleChanged });
        instance.state.traitToDeleteIndex = 0;
        instance.onTraitRemoved();

        expect(onScaleChanged).toBeCalledWith(0, { traits: [] });
      });
    });

    describe('onTraitChanged', () => {
      it('does not call onScaleChanged if index less than zero', () => {
        const instance = createInstance({ onScaleChanged });
        instance.onTraitChanged(-100, {});

        expect(onScaleChanged).not.toBeCalled();
      });

      it('does not call onScaleChanged if index more than length', () => {
        const instance = createInstance({ onScaleChanged });
        instance.onTraitChanged(1000, {});

        expect(onScaleChanged).not.toBeCalled();
      });

      it('calls onScaleChanged', () => {
        const instance = createInstance({ onScaleChanged });
        instance.onTraitChanged(0, {});

        expect(onScaleChanged).toBeCalledWith(0, { traits: [{}] });
      });
    });

    describe('onTraitDropped', () => {
      it('calls onScaleChanged', () => {
        const instance = createInstance({ onScaleChanged });
        instance.onTraitAdded();
        instance.onTraitAdded();

        const { traits } = instance.props.scale;
        const length = traits.length;
        const lastButOne = traits[length - 2];
        const last = traits[length - 1];

        instance.onTraitDropped({ index: length - 2 }, length - 1);

        expect(onScaleChanged).toBeCalledWith(0, {
          traits: [...traits.slice(0, length - 2), last, lastButOne],
        });
      });
    });
  });
});
