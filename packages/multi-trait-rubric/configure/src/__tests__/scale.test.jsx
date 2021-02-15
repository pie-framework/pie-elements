import { shallow } from 'enzyme';
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
  ]
});

jest.mock('@pie-lib/render-ui', () => ({
  color: {
    secondaryBackground: jest.fn().mockReturnValue('grey'),
    text: jest.fn().mockReturnValue('black'),
  }
}));

describe('Scale', () => {
  let w;

  const wrapper = extras => {
    const defaults = {
      classes: {},
      scale: scale(),
      scaleIndex: 0,
      showStandards: true,
      ...extras
    };
    return shallow(<Scale {...defaults} />);
  };

  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();

      expect(w).toMatchSnapshot();
    });

    it('renders without traits', () => {
      w = wrapper({ traits: [] });

      expect(w).toMatchSnapshot();
    });

    it('renders without standards', () => {
      w = wrapper({ showStandards: false });

      expect(w).toMatchSnapshot();
    });

    it('renders without descriptions', () => {
      w = wrapper({ showDescription: false });

      expect(w).toMatchSnapshot();
    });

    it('renders with drag and drop enabled', () => {
      w = wrapper({ dragAndDrop: true });

      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    let onScaleChanged;

    beforeEach(() => {
      onScaleChanged = jest.fn();
      w = wrapper({ onScaleChanged });
    });


    describe('updateMaxPointsFieldValue', () => {
      it('shows alert box is number less then max points', () => {
        const { maxPoints } = w.instance().props.scale;

        w.instance().updateMaxPointsFieldValue({ target: { value: maxPoints - 1 } });

        expect(w.instance().state.newMaxPoints).toEqual(maxPoints - 1);
      });

      it('changes max points if number more then max points', () => {
        const { maxPoints } = w.instance().props.scale;

        w.instance().updateMaxPointsFieldValue({ target: { value: maxPoints + 1 } });

        expect(onScaleChanged).toBeCalledWith(0, { maxPoints: maxPoints + 1 });
      });
    });

    describe('changeMaxPoints', () => {
      it('removes zero', () => {
        w.instance().setState({ newMaxPoints: 10 });
        w.instance().changeMaxPoints();

        expect(onScaleChanged).toBeCalledWith(0, { maxPoints: 10 });
      });
    });

    describe('deleteScale', () => {
      it('calls onRemoveScale', () => {
        const onScaleRemoved = jest.fn();

        w = wrapper({ onScaleRemoved });
        w.instance().deleteScale();

        expect(onScaleRemoved).toBeCalledWith(0);
      });
    });

    describe('onTraitRemoved', () => {
      it('does not call onScaleChanged if index less than zero', () => {
        w.instance().setState({ traitToDeleteIndex: -1 });
        w.instance().onTraitRemoved();

        expect(onScaleChanged).not.toBeCalled();
      });

      it('does not call onScaleChanged if index more than length', () => {
        w.instance().setState({ traitToDeleteIndex: 100 });
        w.instance().onTraitRemoved();

        expect(onScaleChanged).not.toBeCalled();
      });

      it('calls onScaleChanged', () => {
        w.instance().state.traitToDeleteIndex = 0;
        w.instance().onTraitRemoved();

        expect(onScaleChanged).toBeCalledWith(0, { traits: [] });
      });
    });

    describe('onTraitChanged', () => {
      it('does not call onScaleChanged if index less than zero', () => {
        w.instance().onTraitChanged(-100, {});

        expect(onScaleChanged).not.toBeCalled();
      });

      it('does not call onScaleChanged if index more than length', () => {
        w.instance().onTraitChanged(1000, {});

        expect(onScaleChanged).not.toBeCalled();
      });

      it('calls onScaleChanged', () => {
        w.instance().onTraitChanged(0, {});

        expect(onScaleChanged).toBeCalledWith(0, { traits: [{}] });
      });
    });

    describe('onTraitDropped', () => {
      it('calls onScaleChanged', () => {
        w.instance().onTraitAdded();
        w.instance().onTraitAdded();

        const { traits } = w.instance().props.scale;
        const length = traits.length;
        const lastButOne = traits[length - 2];
        const last = traits[length - 1];

        w.instance().onTraitDropped({ index: length - 2 }, length - 1);

        expect(onScaleChanged).toBeCalledWith(0, {
          traits: [
            ...traits.slice(0, length - 2),
            last,
            lastButOne
          ]
        });
      });
    });
  });
});
